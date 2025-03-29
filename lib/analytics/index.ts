import prisma from "@/lib/db/prisma"
import { redis } from "@/lib/redis"

// User growth analytics
export async function getUserGrowthAnalytics(
  startDate: Date,
  endDate: Date,
  interval: "day" | "week" | "month" = "day",
): Promise<any[]> {
  try {
    // Format dates for SQL query
    const start = startDate.toISOString()
    const end = endDate.toISOString()

    // Build interval format based on database type
    let dateFormat: string

    switch (interval) {
      case "day":
        dateFormat = "YYYY-MM-DD"
        break
      case "week":
        dateFormat = "YYYY-WW"
        break
      case "month":
        dateFormat = "YYYY-MM"
        break
    }

    // Execute raw SQL query for analytics
    const results = await prisma.$queryRaw`
      SELECT
        TO_CHAR("joinedAt", ${dateFormat}) as period,
        COUNT(*) as new_users
      FROM users
      WHERE "joinedAt" BETWEEN ${start} AND ${end}
      GROUP BY period
      ORDER BY period
    `

    return results as any[]
  } catch (error) {
    console.error("Error getting user growth analytics:", error)
    return []
  }
}

// Content engagement analytics
export async function getContentEngagementAnalytics(startDate: Date, endDate: Date): Promise<any> {
  try {
    const start = startDate.toISOString()
    const end = endDate.toISOString()

    // Get post counts
    const postCount = await prisma.post.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Get comment counts
    const commentCount = await prisma.comment.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Get like counts
    const likeCount = await prisma.like.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Get average likes per post
    const postsWithLikes = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
      include: {
        _count: {
          select: {
            likes: true,
          },
        },
      },
    })

    const totalLikes = postsWithLikes.reduce((sum, post) => sum + post._count.likes, 0)

    const avgLikesPerPost = postsWithLikes.length > 0 ? totalLikes / postsWithLikes.length : 0

    return {
      postCount,
      commentCount,
      likeCount,
      avgLikesPerPost,
    }
  } catch (error) {
    console.error("Error getting content engagement analytics:", error)
    return {
      postCount: 0,
      commentCount: 0,
      likeCount: 0,
      avgLikesPerPost: 0,
    }
  }
}

// User activity analytics
export async function getUserActivityAnalytics(userId: string, days = 30): Promise<any> {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get post count
    const postCount = await prisma.post.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get comment count
    const commentCount = await prisma.comment.count({
      where: {
        authorId: userId,
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get like count
    const likeCount = await prisma.like.count({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get login activity from Redis
    const loginKey = `analytics:logins:${userId}`
    const loginDates = await redis.smembers(loginKey)

    return {
      postCount,
      commentCount,
      likeCount,
      loginCount: loginDates.length,
      lastActive: loginDates.length > 0 ? new Date(Math.max(...loginDates.map((d) => new Date(d).getTime()))) : null,
    }
  } catch (error) {
    console.error("Error getting user activity analytics:", error)
    return {
      postCount: 0,
      commentCount: 0,
      likeCount: 0,
      loginCount: 0,
      lastActive: null,
    }
  }
}

// Track user login
export async function trackUserLogin(userId: string): Promise<void> {
  try {
    const loginKey = `analytics:logins:${userId}`
    const today = new Date().toISOString().split("T")[0]

    // Add today's date to the set of login dates
    await redis.sadd(loginKey, today)

    // Set expiration to 90 days
    await redis.expire(loginKey, 60 * 60 * 24 * 90)
  } catch (error) {
    console.error("Error tracking user login:", error)
  }
}

