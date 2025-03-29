import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Test database connection - simply try to run a query
    await prisma.$queryRaw`SELECT 1`

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
    })
  } catch (error) {
    console.error("Database connection test failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to connect to database",
      },
      { status: 500 },
    )
  }
}

