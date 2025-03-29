import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for permissions
const permissionSchema = z.object({
  id: z.string().min(2, "Permission ID must be at least 2 characters"),
  name: z.string().min(2, "Permission name must be at least 2 characters"),
  description: z.string().optional(),
  category: z.string().default("custom"),
  isSystem: z.boolean().optional().default(false),
})

// Get all permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    const category = searchParams.get("category")

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [
        { id: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    if (category) {
      where.category = category
    }

    // Get permissions
    const permissions = await prisma.permission.findMany({
      where,
      orderBy: { name: "asc" },
    })

    return NextResponse.json(permissions)
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 })
  }
}

// Create a new permission
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = permissionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { id, name, description, category, isSystem } = result.data

    // Check if permission already exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    })

    if (existingPermission) {
      return NextResponse.json({ error: "Permission with this ID already exists" }, { status: 409 })
    }

    // Create permission
    const permission = await prisma.permission.create({
      data: {
        id,
        name,
        description: description || "",
        category,
        isSystem: isSystem || false,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "PERMISSION",
        entityId: permission.id,
        userId: session.user.id,
        metadata: { permission },
      },
    })

    return NextResponse.json(permission, { status: 201 })
  } catch (error) {
    console.error("Error creating permission:", error)
    return NextResponse.json({ error: "Failed to create permission" }, { status: 500 })
  }
}

// Update a permission
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = permissionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { id, name, description, category } = result.data

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id },
    })

    if (!existingPermission) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    // Check if permission is system permission
    if (existingPermission.isSystem) {
      return NextResponse.json({ error: "System permissions cannot be modified" }, { status: 403 })
    }

    // Update permission
    const updatedPermission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description: description || "",
        category,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "PERMISSION",
        entityId: updatedPermission.id,
        userId: session.user.id,
        metadata: {
          before: existingPermission,
          after: updatedPermission,
        },
      },
    })

    return NextResponse.json(updatedPermission)
  } catch (error) {
    console.error("Error updating permission:", error)
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 })
  }
}

