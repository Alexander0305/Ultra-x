import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db/prisma"
import { z } from "zod"

// Validation schema for updating report
const updateReportSchema = z.object({
  status: z.enum(["PENDING", "RESOLVED", "REJECTED"]),
  resolution: z.string().optional(),
})

// Get reports with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (type) {
      where.entityType = type
    }

    // Get reports with pagination
    const reports = await prisma.report.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    })

    // Get total count for pagination
    const totalReports = await prisma.report.count({ where })
    const totalPages = Math.ceil(totalReports / limit)

    return NextResponse.json({
      reports,
      pagination: {
        total: totalReports,
        page,
        limit,
        totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

// Update report status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 })
    }

    const updateData = updateReportSchema.parse(body)

    // Update report
    const report = await prisma.report.update({
      where: { id: body.reportId },
      data: {
        status: updateData.status,
        resolution: updateData.resolution,
        resolvedAt: updateData.status !== "PENDING" ? new Date() : null,
        resolvedById: updateData.status !== "PENDING" ? session.user.id : null,
      },
    })

    // If report is resolved and action is needed, take action on the reported content
    if (updateData.status === "RESOLVED" && body.takeAction) {
      if (report.entityType === "POST") {
        await prisma.post.update({
          where: { id: report.entityId! },
          data: { isHidden: true },
        })
      } else if (report.entityType === "COMMENT") {
        await prisma.comment.update({
          where: { id: report.entityId! },
          data: { isHidden: true },
        })
      } else if (report.entityType === "USER") {
        await prisma.user.update({
          where: { id: report.entityId! },
          data: { isSuspended: true },
        })
      }
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 })
  }
}

