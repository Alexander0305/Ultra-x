import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for updating user
const updateUserSchema = z.object({
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  role: z.enum(["USER", "MODERATOR", "ADMIN"]).optional(),
  isVerified: z.boolean().optional(),
  isSuspended: z.boolean().optional(),
})

// Get users with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ]
    }

    if (role) {
      where.role = role
    }

    if (status === "online") {
      where.isOnline = true
    } else if (status === "verified") {
      where.isVerified = true
    } else if (status === "suspended") {
      where.isSuspended = true
    }

    // Get users with pagination
    const users = await prisma.user.findMany({
      where,
      orderBy: { joinedAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        isVerified: true,
        isOnline: true,
        role: true,
        joinedAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    })

    // Get total count for pagination
    const totalUsers = await prisma.user.count({ where })
    const totalPages = Math.ceil(totalUsers / limit)

    return NextResponse.json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// Bulk update users
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.userIds || !Array.isArray(body.userIds) || body.userIds.length === 0) {
      return NextResponse.json({ error: "User IDs are required" }, { status: 400 })
    }

    const updateData = updateUserSchema.parse(body.data)

    // Update users
    const result = await prisma.user.updateMany({
      where: {
        id: { in: body.userIds },
      },
      data: updateData,
    })

    return NextResponse.json({
      message: `Updated ${result.count} users`,
      count: result.count,
    })
  } catch (error) {
    console.error("Error updating users:", error)
    return NextResponse.json({ error: "Failed to update users" }, { status: 500 })
  }
}

