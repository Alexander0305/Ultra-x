import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"

export async function GET() {
  try {
    // Get all registration settings from the database
    const settings = await prisma.environmentVariable.findMany({
      where: {
        key: {
          startsWith: "REGISTRATION_",
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
      REGISTRATION_ENABLED: "true",
      REGISTRATION_APPROVAL_REQUIRED: "false",
      REGISTRATION_EMAIL_VERIFICATION: "true",
      REGISTRATION_PHONE_VERIFICATION: "false",
      REGISTRATION_SOCIAL_ENABLED: "true",
      REGISTRATION_CAPTCHA_ENABLED: "false",
      REGISTRATION_INVITATION_ONLY: "false",
      REGISTRATION_CUSTOM_FIELDS: "[]",
      REGISTRATION_PAGE_TITLE: "Create an Account",
      REGISTRATION_PAGE_DESCRIPTION: "Join our community by creating an account",
      REGISTRATION_TERMS_ENABLED: "true",
      REGISTRATION_TERMS_TEXT: "I agree to the Terms of Service and Privacy Policy",
    }

    // Merge default settings with database settings
    const mergedSettings = { ...defaultSettings, ...settingsObject }

    return NextResponse.json(mergedSettings)
  } catch (error) {
    console.error("Error fetching registration settings:", error)
    return NextResponse.json({ error: "Failed to fetch registration settings" }, { status: 500 })
  }
}

