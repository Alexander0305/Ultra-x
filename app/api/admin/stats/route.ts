import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get time period from query params
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get("period") || "30d"

    // Calculate start date based on period
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Get user stats
    const totalUsers = await prisma.user.count()
    const newUsers = await prisma.user.count({
      where: {
        joinedAt: {
          gte: startDate,
        },
      },
    })
    const activeUsers = await prisma.user.count({
      where: {
        OR: [{ isOnline: true }, { lastSeen: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }],
      },
    })

    // Get content stats
    const totalPosts = await prisma.post.count()
    const newPosts = await prisma.post.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    const totalComments = await prisma.comment.count()
    const newComments = await prisma.comment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get engagement stats
    const totalLikes = await prisma.like.count()
    const newLikes = await prisma.like.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get report stats
    const totalReports = await prisma.report.count()
    const pendingReports = await prisma.report.count({
      where: {
        status: "PENDING",
      },
    })

    // Return all stats
    return NextResponse.json({
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        growthRate: totalUsers > 0 ? (newUsers / totalUsers) * 100 : 0,
      },
      content: {
        posts: {
          total: totalPosts,
          new: newPosts,
        },
        comments: {
          total: totalComments,
          new: newComments,
        },
      },
      engagement: {
        likes: {
          total: totalLikes,
          new: newLikes,
        },
        likesPerPost: totalPosts > 0 ? totalLikes / totalPosts : 0,
        commentsPerPost: totalPosts > 0 ? totalComments / totalPosts : 0,
      },
      reports: {
        total: totalReports,
        pending: pendingReports,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}

