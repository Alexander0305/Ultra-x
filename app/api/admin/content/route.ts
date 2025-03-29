import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { moderateContent } from "@/lib/ai/content-moderation"

// Get content with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const contentType = searchParams.get("type") || "posts"
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const reportStatus = searchParams.get("reportStatus")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Handle different content types
    if (contentType === "posts") {
      // Build filter conditions for posts
      const where: any = {}

      if (query) {
        where.content = { contains: query, mode: "insensitive" }
      }

      if (status === "hidden") {
        where.isHidden = true
      }

      if (reportStatus === "reported") {
        where.reports = { some: {} }
      }

      // Get posts with pagination
      const posts = await prisma.post.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      })

      // Get total count for pagination
      const totalPosts = await prisma.post.count({ where })
      const totalPages = Math.ceil(totalPosts / limit)

      return NextResponse.json({
        content: posts,
        pagination: {
          total: totalPosts,
          page,
          limit,
          totalPages,
        },
      })
    } else if (contentType === "comments") {
      // Build filter conditions for comments
      const where: any = {}

      if (query) {
        where.content = { contains: query, mode: "insensitive" }
      }

      if (status === "hidden") {
        where.isHidden = true
      }

      if (reportStatus === "reported") {
        where.reports = { some: {} }
      }

      // Get comments with pagination
      const comments = await prisma.comment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          post: {
            select: {
              id: true,
              content: true,
            },
          },
          _count: {
            select: {
              reports: true,
            },
          },
        },
      })

      // Get total count for pagination
      const totalComments = await prisma.comment.count({ where })
      const totalPages = Math.ceil(totalComments / limit)

      return NextResponse.json({
        content: comments,
        pagination: {
          total: totalComments,
          page,
          limit,
          totalPages,
        },
      })
    } else if (contentType === "media") {
      // Build filter conditions for media
      const where: any = {}

      if (query) {
        where.OR = [
          { filename: { contains: query, mode: "insensitive" } },
          { mimeType: { contains: query, mode: "insensitive" } },
        ]
      }

      if (status) {
        where.type = status.toUpperCase()
      }

      // Get media with pagination
      const media = await prisma.mediaItem.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      })

      // Get total count for pagination
      const totalMedia = await prisma.mediaItem.count({ where })
      const totalPages = Math.ceil(totalMedia / limit)

      return NextResponse.json({
        content: media,
        pagination: {
          total: totalMedia,
          page,
          limit,
          totalPages,
        },
      })
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

// Moderate content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Moderate content
    const moderationResult = await moderateContent(body.content)

    return NextResponse.json(moderationResult)
  } catch (error) {
    console.error("Error moderating content:", error)
    return NextResponse.json({ error: "Failed to moderate content" }, { status: 500 })
  }
}

// Update content status (hide/unhide)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.contentId || !body.contentType) {
      return NextResponse.json({ error: "Content ID and type are required" }, { status: 400 })
    }

    // Update content based on type
    if (body.contentType === "post") {
      const post = await prisma.post.update({
        where: { id: body.contentId },
        data: { isHidden: body.isHidden },
      })

      return NextResponse.json(post)
    } else if (body.contentType === "comment") {
      const comment = await prisma.comment.update({
        where: { id: body.contentId },
        data: { isHidden: body.isHidden },
      })

      return NextResponse.json(comment)
    } else if (body.contentType === "media") {
      const media = await prisma.mediaItem.update({
        where: { id: body.contentId },
        data: { isHidden: body.isHidden },
      })

      return NextResponse.json(media)
    }

    return NextResponse.json({ error: "Invalid content type" }, { status: 400 })
  } catch (error) {
    console.error("Error updating content:", error)
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

