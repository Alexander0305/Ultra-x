import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { importEnvVariables } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Get client info for audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip
    const userAgent = request.headers.get("user-agent")

    // Import environment variables
    const result = await importEnvVariables(body.content, {
      userId: session.user.id,
      ipAddress: ipAddress?.toString(),
      userAgent,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error importing environment variables:", error)
    return NextResponse.json({ error: "Failed to import environment variables" }, { status: 500 })
  }
}

