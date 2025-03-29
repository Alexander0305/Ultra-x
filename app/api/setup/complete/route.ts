import { type NextRequest, NextResponse } from "next/server"
import { completeSetup } from "@/lib/setup"

export async function POST(req: NextRequest) {
  try {
    const setupData = await req.json()

    const result = await completeSetup(setupData)

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to complete setup",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Setup completed successfully",
    })
  } catch (error) {
    console.error("Setup completion error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to complete setup",
      },
      { status: 500 },
    )
  }
}

