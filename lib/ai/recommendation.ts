import prisma from "@/lib/db/prisma"
import { redis } from "@/lib/redis"

// User similarity calculation based on interactions
async function calculateUserSimilarity(userId: string, otherUserId: string): Promise<number> {
  // Get posts liked by both users
  const userLikes = await prisma.like.findMany({
    where: { userId },
    select: { postId: true },
  })

  const otherUserLikes = await prisma.like.findMany({
    where: { userId: otherUserId },
    select: { postId: true },
  })

  const userLikedPostIds = userLikes.map((like) => like.postId)
  const otherUserLikedPostIds = otherUserLikes.map((like) => like.postId)

  // Calculate Jaccard similarity (intersection over union)
  const intersection = userLikedPostIds.filter((id) => otherUserLikedPostIds.includes(id)).length

  const union = new Set([...userLikedPostIds, ...otherUserLikedPostIds]).size

  return union === 0 ? 0 : intersection / union
}

// Get recommended users to follow
export async function getRecommendedUsers(userId: string, limit = 5): Promise<any[]> {
  try {
    // Check cache first
    const cacheKey = `recommendations:users:${userId}`
    const cachedRecommendations = await redis.get<any[]>(cacheKey)

    if (cachedRecommendations) {
      return cachedRecommendations
    }

    // Get user's friends
    const friends = await prisma.friend.findMany({
      where: { userId },
      select: { friendId: true },
    })

    const friendIds = friends.map((friend) => friend.friendId)

    // Get friends of friends who aren't already friends with the user
    const friendsOfFriends = await prisma.friend.findMany({
      where: {
        userId: { in: friendIds },
        friendId: {
          not: userId,
          notIn: friendIds,
        },
      },
      select: {
        friendId: true,
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
      },
    })

    // Calculate similarity scores
    const recommendationsWithScores = await Promise.all(
      friendsOfFriends.map(async (fof) => {
        const similarity = await calculateUserSimilarity(userId, fof.friendId)
        return {
          ...fof.friend,
          score: similarity,
        }
      }),
    )

    // Sort by similarity score and take top recommendations
    const recommendations = recommendationsWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score, ...user }) => user) // Remove score from final results

    // Cache recommendations for 1 hour
    await redis.set(cacheKey, recommendations, { ex: 3600 })

    return recommendations
  } catch (error) {
    console.error("Error getting recommended users:", error)
    return []
  }
}

// Get recommended posts
export async function getRecommendedPosts(userId: string, limit = 10): Promise<any[]> {
  try {
    // Check cache first
    const cacheKey = `recommendations:posts:${userId}`
    const cachedRecommendations = await redis.get<any[]>(cacheKey)

    if (cachedRecommendations) {
      return cachedRecommendations
    }

    // Get user's liked posts
    const userLikes = await prisma.like.findMany({
      where: { userId },
      select: { postId: true },
    })

    const likedPostIds = userLikes.map((like) => like.postId)

    // Get user's friends
    const friends = await prisma.friend.findMany({
      where: { userId },
      select: { friendId: true },
    })

    const friendIds = friends.map((friend) => friend.friendId)

    // Get posts liked by friends that the user hasn't seen yet
    const friendLikedPosts = await prisma.like.findMany({
      where: {
        userId: { in: friendIds },
        postId: { notIn: likedPostIds },
      },
      select: {
        postId: true,
        post: {
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
        },
      },
      distinct: ["postId"],
    })

    // Format and return recommendations
    const recommendations = friendLikedPosts
      .map((like) => ({
        ...like.post,
        likesCount: like.post._count.likes,
        commentsCount: like.post._count.comments,
        _count: undefined,
      }))
      .slice(0, limit)

    // Cache recommendations for 30 minutes
    await redis.set(cacheKey, recommendations, { ex: 1800 })

    return recommendations
  } catch (error) {
    console.error("Error getting recommended posts:", error)
    return []
  }
}

