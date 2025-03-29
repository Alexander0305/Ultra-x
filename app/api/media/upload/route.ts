import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { randomUUID } from "crypto"

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const file = await req.formData().then((fd) => fd.get("file"))

    if (!file || typeof file === "string") {
      return NextResponse.json({ message: "No file found" }, { status: 400 })
    }

    const filename = randomUUID()

    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to upload file" }, { status: 500 })
  }
}

