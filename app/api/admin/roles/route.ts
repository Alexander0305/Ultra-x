import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for roles
const roleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Role name must be at least 2 characters"),
  description: z.string().optional(),
  permissions: z.array(z.string()),
  isSystem: z.boolean().optional().default(false),
})

// Get all roles
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

    // Build filter conditions
    const where: any = {}

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    // Get roles
    const roles = await prisma.role.findMany({
      where,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    // Format roles for response
    const formattedRoles = roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description || "",
      permissions: role.permissions,
      userCount: role._count.users,
      isSystem: role.isSystem,
      createdAt: role.createdAt.toISOString(),
    }))

    return NextResponse.json(formattedRoles)
  } catch (error) {
    console.error("Error fetching roles:", error)
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 })
  }
}

// Create a new role
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = roleSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { id, name, description, permissions, isSystem } = result.data

    // Check if role already exists
    const existingRole = await prisma.role.findFirst({
      where: {
        OR: [{ id: id || name.toLowerCase().replace(/\s+/g, "_") }, { name }],
      },
    })

    if (existingRole) {
      return NextResponse.json({ error: "Role with this name or ID already exists" }, { status: 409 })
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        id: id || name.toLowerCase().replace(/\s+/g, "_"),
        name,
        description,
        permissions,
        isSystem: isSystem || false,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "CREATE",
        entityType: "ROLE",
        entityId: role.id,
        userId: session.user.id,
        metadata: { role },
      },
    })

    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    console.error("Error creating role:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
}

// Update a role
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = roleSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { id, name, description, permissions } = result.data

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 })
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    })

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Check if role is system role and prevent modification of system roles
    if (existingRole.isSystem) {
      return NextResponse.json({ error: "System roles cannot be modified" }, { status: 403 })
    }

    // Update role
    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "UPDATE",
        entityType: "ROLE",
        entityId: updatedRole.id,
        userId: session.user.id,
        metadata: {
          before: existingRole,
          after: updatedRole,
        },
      },
    })

    return NextResponse.json(updatedRole)
  } catch (error) {
    console.error("Error updating role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}

