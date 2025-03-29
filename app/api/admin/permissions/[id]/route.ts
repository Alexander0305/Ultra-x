import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"

// Get a specific permission
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissionId = params.id

    // Get permission
    const permission = await prisma.permission.findUnique({
      where: { id: permissionId },
    })

    if (!permission) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    return NextResponse.json(permission)
  } catch (error) {
    console.error("Error fetching permission:", error)
    return NextResponse.json({ error: "Failed to fetch permission" }, { status: 500 })
  }
}

// Delete a permission
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const permissionId = params.id

    // Check if permission exists
    const existingPermission = await prisma.permission.findUnique({
      where: { id: permissionId },
    })

    if (!existingPermission) {
      return NextResponse.json({ error: "Permission not found" }, { status: 404 })
    }

    // Check if permission is system permission
    if (existingPermission.isSystem) {
      return NextResponse.json({ error: "System permissions cannot be deleted" }, { status: 403 })
    }

    // Check if permission is in use by any roles
    const rolesWithPermission = await prisma.role.findMany({
      where: {
        permissions: {
          has: permissionId,
        },
      },
    })

    if (rolesWithPermission.length > 0) {
      return NextResponse.json(
        {
          error: "Permission is in use by roles and cannot be deleted",
          roles: rolesWithPermission.map((role) => role.name),
        },
        { status: 409 },
      )
    }

    // Delete permission
    await prisma.permission.delete({
      where: { id: permissionId },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: "DELETE",
        entityType: "PERMISSION",
        entityId: permissionId,
        userId: session.user.id,
        metadata: { deletedPermission: existingPermission },
      },
    })

    return NextResponse.json({ message: "Permission deleted successfully" })
  } catch (error) {
    console.error("Error deleting permission:", error)
    return NextResponse.json({ error: "Failed to delete permission" }, { status: 500 })
  }
}

