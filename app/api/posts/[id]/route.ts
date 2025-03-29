import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for updating a post
const updatePostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").optional(),
  privacy: z.enum(["PUBLIC", "FRIENDS", "PRIVATE"]).optional(),
  mediaIds: z.array(z.string()).optional(),
})

// Get a single post by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id

    // Get post with author, media, and counts
    const post = await prisma.post.findUnique({
      where: { id: postId },
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
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user has permission to view this post
    if (post.privacy === "PRIVATE" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to view this post" }, { status: 403 })
    }

    if (post.privacy === "FRIENDS" && post.authorId !== session.user.id) {
      // Check if user is friends with the author
      const friendship = await prisma.friend.findFirst({
        where: {
          OR: [
            {
              userId: session.user.id,
              friendId: post.authorId,
            },
            {
              userId: post.authorId,
              friendId: session.user.id,
            },
          ],
        },
      })

      if (!friendship) {
        return NextResponse.json({ error: "You don't have permission to view this post" }, { status: 403 })
      }
    }

    // Check if user has liked the post
    const like = await prisma.like.findUnique({
      where: {
        userId_postId_commentId: {
          userId: session.user.id,
          postId: post.id,
          commentId: null,
        },
      },
    })

    // Check if user has saved the post
    const saved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: post.id,
        },
      },
    })

    return NextResponse.json({
      ...post,
      isLiked: !!like,
      isSaved: !!saved,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      _count: undefined,
    })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// Update a post
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const body = await request.json()

    // Validate input
    const result = updatePostSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    // Check if post exists and user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to update this post" }, { status: 403 })
    }

    const { content, privacy, mediaIds } = result.data

    // Prepare update data
    const updateData: any = {}
    if (content !== undefined) updateData.content = content
    if (privacy !== undefined) updateData.privacy = privacy

    // Update post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: updateData,
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
      },
    })

    // Update media items if provided
    if (mediaIds) {
      // First disconnect all existing media
      await prisma.mediaItem.updateMany({
        where: { postId },
        data: { postId: null },
      })

      // Then connect new media
      if (mediaIds.length > 0) {
        await prisma.mediaItem.updateMany({
          where: { id: { in: mediaIds } },
          data: { postId },
        })
      }

      // Refresh post with updated media
      const refreshedPost = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          mediaItems: true,
        },
      })

      if (refreshedPost) {
        updatedPost.mediaItems = refreshedPost.mediaItems
      }
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// Delete a post
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id

    // Check if post exists and user is the author
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Check if user is the author or an admin
    if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You don't have permission to delete this post" }, { status: 403 })
    }

    // Delete post
    await prisma.post.delete({
      where: { id: postId },
    })

    return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}

