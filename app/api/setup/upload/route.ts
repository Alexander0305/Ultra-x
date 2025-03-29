import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const type = (formData.get("type") as string) || "image"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads")

    // Get file extension
    const fileExt = file.name.split(".").pop()

    // Generate a unique filename
    const fileName = `${type}_${uuidv4()}.${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Save file to disk
    await writeFile(filePath, buffer)

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "File upload failed" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

