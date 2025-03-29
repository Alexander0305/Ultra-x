import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"

// Get a specific role
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const roleId = params.id

    // Get role
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    })

    if (!role) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Format role for response
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description || "",
      permissions: role.permissions,
      userCount: role._count.users,
      isSystem: role.isSystem,
      createdAt: role.createdAt.toISOString(),
    }

    return NextResponse.json(formattedRole)
  } catch (error) {
    console.error("Error fetching role:", error)
    return NextResponse.json({ error: "Failed to fetch role" }, { status: 500 })
  }
}

// Delete a role
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const roleId = params.id

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!existingRole) {
      return NextResponse.json({ error: "Role not found" }, { status: 404 })
    }

    // Check if role is system role
    if (existingRole.isSystem) {
      return NextResponse.json({ error: "System roles cannot be deleted" }, { status: 403 })
    }

    // Check if role is in use
    const usersWithRole = await prisma.user.count({
      where: { role: roleId },
    })

    if (usersWithRole > 0) {
      return NextResponse.json(
        {
          error: "Role is in use by users and cannot be deleted",
          userCount: usersWithRole,
        },
        { status: 409 },
      )
    }

    // Delete role
    await prisma.role.delete({
      where: { id: roleId },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "ROLE",
        entityId: roleId,
        userId: session.user.id,
        metadata: { deletedRole: existingRole },
      },
    })

    return NextResponse.json({ message: "Role deleted successfully" })
  } catch (error) {
    console.error("Error deleting role:", error)
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
}

