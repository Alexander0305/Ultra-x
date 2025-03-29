import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().nullable(),
  occupation: z.string().optional(),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  interests: z.array(z.string()).optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        location: true,
        website: true,
        occupation: true,
        joinedAt: true,
        avatar: true,
        coverImage: true,
        isVerified: true,
        role: true,
        tier: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "An error occurred while fetching profile" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Validate input
    const result = profileSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { username, interests, ...profileData } = result.data

    // If username is provided, check if it's already taken
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 409 })
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(username && { username }),
        ...profileData,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "An error occurred while updating profile" }, { status: 500 })
  }
}

