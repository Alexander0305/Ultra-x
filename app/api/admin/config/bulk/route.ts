import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { setEnvVariable } from "@/lib/config"

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get request data
    const { settings } = await req.json()

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    // Get client info for audit
    const userAgent = req.headers.get("user-agent") || ""
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"

    // Update each setting
    for (const setting of settings) {
      if (!setting.key || typeof setting.value !== "string") {
        continue
      }

      await setEnvVariable(setting.key, setting.value, {
        category: setting.category || "general",
        userId: session.user.id,
        ipAddress,
        userAgent,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating settings:", error)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}

