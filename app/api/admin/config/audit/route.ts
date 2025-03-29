import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"

// Get audit logs for configuration changes
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")
    const userId = searchParams.get("userId")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (entityType) {
      where.entityType = entityType
    }

    if (entityId) {
      where.entityId = entityId
    }

    if (userId) {
      where.userId = userId
    }

    // Get audit logs with pagination
    const auditLogs = await prisma.configAuditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      skip,
      take: limit,
    })

    // Get total count for pagination
    const totalLogs = await prisma.configAuditLog.count({ where })
    const totalPages = Math.ceil(totalLogs / limit)

    return NextResponse.json({
      auditLogs,
      pagination: {
        total: totalLogs,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}

