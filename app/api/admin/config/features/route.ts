import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getEnvVariables, setEnvVariable } from "@/lib/config"

// Get all feature flags
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || !["ADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get all environment variables in the 'features' category
    const variables = await getEnvVariables("features")

    // Format as feature flags
    const featureFlags = variables.map((variable) => ({
      key: variable.key,
      enabled: variable.value === "true" || variable.value === "1",
      description: variable.description,
    }))

    return NextResponse.json(featureFlags)
  } catch (error) {
    console.error("Error fetching feature flags:", error)
    return NextResponse.json({ error: "Failed to fetch feature flags" }, { status: 500 })
  }
}

// Update feature flags
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and has admin role
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    if (!body.features || !Array.isArray(body.features)) {
      return NextResponse.json({ error: "Features array is required" }, { status: 400 })
    }

    // Get client info for audit log
    const ipAddress = request.headers.get("x-forwarded-for") || request.ip
    const userAgent = request.headers.get("user-agent")

    // Update each feature flag
    for (const feature of body.features) {
      await setEnvVariable(feature.key, feature.enabled ? "true" : "false", {
        userId: session.user.id,
        ipAddress: ipAddress?.toString(),
        userAgent,
      })
    }

    // Get updated feature flags
    const variables = await getEnvVariables("features")

    // Format as feature flags
    const updatedFeatureFlags = variables.map((variable) => ({
      key: variable.key,
      enabled: variable.value === "true" || variable.value === "1",
      description: variable.description,
    }))

    return NextResponse.json(updatedFeatureFlags)
  } catch (error) {
    console.error("Error updating feature flags:", error)
    return NextResponse.json({ error: "Failed to update feature flags" }, { status: 500 })
  }
}

