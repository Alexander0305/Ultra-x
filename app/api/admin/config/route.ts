import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getEnvVariables, setEnvVariable, deleteEnvVariable } from "@/lib/config"
import { z } from "zod"

// Validation schema for environment variables
const envVarSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^[A-Z0-9_]+$/, "Key must be uppercase with only letters, numbers, and underscores"),
  value: z.string(),
  description: z.string().optional(),
  isSecret: z.boolean().optional(),
  category: z.string().optional(),
})

// Get all environment variables
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    // Get environment variables
    let variables = await getEnvVariables(category || undefined)

    // Filter by search query if provided
    if (search) {
      const query = search.toLowerCase()
      variables = variables.filter(
        (variable) =>
          variable.key.toLowerCase().includes(query) ||
          (!variable.isSecret && variable.value.toLowerCase().includes(query)) ||
          variable.description?.toLowerCase().includes(query) ||
          false ||
          variable.category.toLowerCase().includes(query),
      )
    }

    // Mask secret values
    const maskedVariables = variables.map((variable) => ({
      ...variable,
      value: variable.isSecret ? "[REDACTED]" : variable.value,
    }))

    return NextResponse.json(maskedVariables)
  } catch (error) {
    console.error("Error fetching environment variables:", error)
    return NextResponse.json({ error: "Failed to fetch environment variables" }, { status: 500 })
  }
}

// Create or update an environment variable
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const result = envVarSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation failed", details: result.error.format() }, { status: 400 })
    }

    const { key, value, description, isSecret, category } = result.data

    // Get client info for audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip
    const userAgent = request.headers.get("user-agent")

    // Set environment variable
    const variable = await setEnvVariable(key, value, {
      description,
      isSecret,
      category,
      userId: session.user.id,
      ipAddress: ipAddress?.toString(),
      userAgent,
    })

    if (!variable) {
      return NextResponse.json({ error: "Failed to set environment variable" }, { status: 500 })
    }

    // Mask secret value in response
    const response = {
      ...variable,
      value: variable.isSecret ? "[REDACTED]" : variable.value,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error setting environment variable:", error)
    return NextResponse.json({ error: "Failed to set environment variable" }, { status: 500 })
  }
}

// Delete an environment variable
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const key = searchParams.get("key")

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }

    // Get client info for audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip
    const userAgent = request.headers.get("user-agent")

    // Delete environment variable
    const success = await deleteEnvVariable(key, {
      userId: session.user.id,
      ipAddress: ipAddress?.toString(),
      userAgent,
    })

    if (!success) {
      return NextResponse.json({ error: "Environment variable not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting environment variable:", error)
    return NextResponse.json({ error: "Failed to delete environment variable" }, { status: 500 })
  }
}

