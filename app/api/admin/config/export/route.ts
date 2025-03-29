import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { exportEnvVariables } from "@/lib/config"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const includeSecrets = searchParams.get("includeSecrets") === "true"

    // Export environment variables
    const envContent = await exportEnvVariables(includeSecrets)

    // Return as text file
    return new NextResponse(envContent, {
      headers: {
        "Content-Type": "text/plain",
        "Content-Disposition": 'attachment; filename="environment-variables.env"',
      },
    })
  } catch (error) {
    console.error("Error exporting environment variables:", error)
    return NextResponse.json({ error: "Failed to export environment variables" }, { status: 500 })
  }
}

