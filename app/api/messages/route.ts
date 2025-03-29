import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"
import { pusherServer } from "@/lib/pusher"

// Validation schema for sending a message
const sendMessageSchema = z.object({
  content: z.string().optional(),
  receiverId: z.string().min(1, "Receiver ID is required"),
  mediaIds: z.array(z.string()).optional(),
})

// Get conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const conversationId = searchParams.get("conversationId")

    if (conversationId) {
      // Get messages for a specific conversation
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
        },
      })

      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }

      // Check if user is a participant in the conversation
      const isParticipant = conversation.participants.some((p) => p.userId === session.user.id)

      if (!isParticipant) {
        return NextResponse.json({ error: "You are not a participant in this conversation" }, { status: 403 })
      }

      // Get messages for the conversation
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: session.user.id,
              receiverId: { in: conversation.participants.map((p) => p.userId).filter((id) => id !== session.user.id) },
            },
            {
              senderId: { in: conversation.participants.map((p) => p.userId).filter((id) => id !== session.user.id) },
              receiverId: session.user.id,
            },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          mediaItems: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      })

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          receiverId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      })

      return NextResponse.json(messages)
    }

    // Get all conversations for the current user
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            leftAt: null,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Get the last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              {
                senderId: session.user.id,
                receiverId: {
                  in: conversation.participants.map((p) => p.userId).filter((id) => id !== session.user.id),
                },
              },
              {
                senderId: { in: conversation.participants.map((p) => p.userId).filter((id) => id !== session.user.id) },
                receiverId: session.user.id,
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        // Count unread messages
        const unreadCount = await prisma.message.count({
          where: {
            receiverId: session.user.id,
            senderId: { in: conversation.participants.map((p) => p.userId).filter((id) => id !== session.user.id) },
            isRead: false,
          },
        })

        // Format the conversation data
        return {
          id: conversation.id,
          participants: conversation.participants.map((p) => p.user),
          lastMessage,
          unreadCount,
          updatedAt: conversation.updatedAt,
        }
      }),
    )

    return NextResponse.json(conversationsWithLastMessage)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

// Send a new message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = sendMessageSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { content, receiverId, mediaIds = [] } = result.data

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    })

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // Check if content or media is provided
    if (!content && mediaIds.length === 0) {
      return NextResponse.json({ error: "Message must have content or media" }, { status: 400 })
    }

    // Find or create conversation
    let conversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: {
                userId: session.user.id,
                leftAt: null,
              },
            },
          },
          {
            participants: {
              some: {
                userId: receiverId,
                leftAt: null,
              },
            },
          },
        ],
      },
    })

    if (!conversation) {
      // Create new conversation
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            create: [{ userId: session.user.id }, { userId: receiverId }],
          },
        },
      })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId,
        mediaItems: {
          connect: mediaIds.map((id) => ({ id })),
        },
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        mediaItems: true,
      },
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    })

    // Create notification for the receiver
    await prisma.notification.create({
      data: {
        type: "LIKE",
        content: `sent you a message`,
        senderId: session.user.id,
        receiverId,
        entityId: message.id,
        entityType: "MESSAGE",
      },
    })

    // Trigger real-time update via Pusher
    await pusherServer.trigger(`private-user-${receiverId}`, "new-message", {
      message,
      conversation: conversation.id,
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}

