import { NextResponse } from "next/server"
import { get } from "@vercel/blob"

export async function GET(req: Request, { params }: { params: { type: string; filename: string } }) {
  try {
    const { type, filename } = params

    const blob = await get(filename)

    if (!blob) {
      return new NextResponse(JSON.stringify({ message: "File not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    return NextResponse.redirect(blob.url)
  } catch (error) {
    console.error(error)
    return new NextResponse(JSON.stringify({ message: "Failed to retrieve file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

