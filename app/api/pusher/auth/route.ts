import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const socketId = formData.get("socket_id") as string
    const channel = formData.get("channel_name") as string

    // Only authorize private channels for the current user
    if (channel.startsWith("private-user-") && !channel.endsWith(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const authResponse = pusherServer.authorizeChannel(socketId, channel)

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("Pusher auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

