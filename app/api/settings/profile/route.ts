import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"

export async function GET() {
  try {
    // Get all profile settings from the database
    const settings = await prisma.environmentVariable.findMany({
      where: {
        key: {
          startsWith: "PROFILE_",
        },
      },
      select: {
        key: true,
        value: true,
      },
    })

    // Convert to object
    const settingsObject = settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value
        return acc
      },
      {} as Record<string, string>,
    )

    // Set default values for any missing settings
    const defaultSettings = {
      PROFILE_BIO_ENABLED: "true",
      PROFILE_BIO_MAX_LENGTH: "500",
      PROFILE_LOCATION_ENABLED: "true",
      PROFILE_WEBSITE_ENABLED: "true",
      PROFILE_SOCIAL_LINKS_ENABLED: "true",
      PROFILE_AVATAR_ENABLED: "true",
      PROFILE_AVATAR_MAX_SIZE: "2",
      PROFILE_COVER_ENABLED: "true",
      PROFILE_COVER_MAX_SIZE: "5",
      PROFILE_PRIVACY_ENABLED: "true",
      PROFILE_DEFAULT_PRIVACY: "public",
      PROFILE_ACTIVITY_TRACKING: "true",
      PROFILE_CUSTOM_FIELDS: "[]",
    }

    // Merge default settings with database settings
    const mergedSettings = { ...defaultSettings, ...settingsObject }

    return NextResponse.json(mergedSettings)
  } catch (error) {
    console.error("Error fetching profile settings:", error)
    return NextResponse.json({ error: "Failed to fetch profile settings" }, { status: 500 })
  }
}

