import { NextResponse } from "next/server"
import { getSetupStatus } from "@/lib/setup"

export async function GET() {
  try {
    const status = await getSetupStatus()

    return NextResponse.json(status)
  } catch (error) {
    console.error("Failed to get setup status:", error)

    return NextResponse.json(
      {
        complete: false,
        progress: {
          database: false,
          admin: false,
          settings: false,
          features: false,
        },
        error: error instanceof Error ? error.message : "Failed to get setup status",
      },
      { status: 500 },
    )
  }
}

