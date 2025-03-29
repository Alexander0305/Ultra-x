import { type NextRequest, NextResponse } from "next/server"
import { createCanvas } from "canvas"

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const name = decodeURIComponent(params.name)
    const initials = getInitials(name)
    const color = getColorFromName(name)

    const canvas = createCanvas(200, 200)
    const ctx = canvas.getContext("2d")

    // Draw background
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 200, 200)

    // Draw text
    ctx.fillStyle = "#FFFFFF"
    ctx.font = "bold 80px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(initials, 100, 100)

    const buffer = canvas.toBuffer("image/png")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error generating avatar:", error)
    return NextResponse.json({ error: "An error occurred while generating the avatar" }, { status: 500 })
  }
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getColorFromName(name: string): string {
  const colors = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#16a085",
    "#27ae60",
    "#2980b9",
    "#8e44ad",
    "#2c3e50",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6",
    "#f39c12",
    "#d35400",
    "#c0392b",
    "#bdc3c7",
    "#7f8c8d",
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

