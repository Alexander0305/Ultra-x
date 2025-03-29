import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"
import { db } from "@/lib/db/prisma"

// Validation schema for creating a post
const createPostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty"),
  privacy: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).optional(),
  mediaIds: z.array(z.string()).optional(),
})

// Get posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const cursor = searchParams.get("cursor")

    // Build query
    const query: any = {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            isVerified: true,
          },
        },
        mediaItems: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    }

    // Add cursor-based pagination
    if (cursor) {
      query.cursor = {
        id: cursor,
      }
      query.skip = 1 // Skip the cursor
    }

    // Filter by user if userId is provided
    if (userId) {
      query.where = {
        authorId: userId,
      }
    } else {
      // For the main feed, show public posts and posts from friends
      const currentUserId = session.user.id

      // Get user's friends
      const friends = await prisma.friend.findMany({
        where: {
          userId: currentUserId,
        },
        select: {
          friendId: true,
        },
      })

      const friendIds = friends.map((friend) => friend.friendId)

      query.where = {
        OR: [
          { privacy: "PUBLIC" },
          {
            AND: [{ privacy: "FRIENDS" }, { authorId: { in: [...friendIds, currentUserId] } }],
          },
          {
            AND: [{ privacy: "PRIVATE" }, { authorId: currentUserId }],
          },
        ],
      }
    }

    // Execute query
    const posts = await prisma.post.findMany(query)

    // Check if user has liked each post
    const postsWithLikeStatus = await Promise.all(
      posts.map(async (post) => {
        const like = await prisma.like.findUnique({
          where: {
            userId_postId_commentId: {
              userId: session.user.id,
              postId: post.id,
              commentId: null,
            },
          },
        })

        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              userId: session.user.id,
              postId: post.id,
            },
          },
        })

        return {
          ...post,
          isLiked: !!like,
          isSaved: !!saved,
          likesCount: post._count.likes,
          commentsCount: post._count.comments,
          _count: undefined,
        }
      }),
    )

    // Get next cursor
    const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null

    return NextResponse.json({
      posts: postsWithLikeStatus,
      nextCursor,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

// Create a new post
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const { content, images } = await req.json()

    const post = await db.post.create({
      data: {
        content,
        images,
        authorId: session.user.id,
      },
    })

    return new NextResponse(JSON.stringify(post), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: "Failed to create post" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

