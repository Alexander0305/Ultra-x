import { NextResponse } from "next/server"
import prisma from "@/lib/db/prisma"

export async function GET() {
  try {
    // Get all login settings from the database
    const settings = await prisma.environmentVariable.findMany({
      where: {
        key: {
          startsWith: "LOGIN_",
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
      LOGIN_USERNAME_ENABLED: "true",
      LOGIN_EMAIL_ENABLED: "true",
      LOGIN_PHONE_ENABLED: "false",
      LOGIN_SOCIAL_ENABLED: "true",
      LOGIN_PASSWORDLESS_ENABLED: "false",
      LOGIN_2FA_ENABLED: "false",
      LOGIN_2FA_REQUIRED: "false",
      LOGIN_MAX_ATTEMPTS: "5",
      LOGIN_LOCKOUT_DURATION: "30",
      LOGIN_SESSION_DURATION: "1440",
      LOGIN_REMEMBER_ME_ENABLED: "true",
      LOGIN_IP_TRACKING: "true",
      LOGIN_SSO_ENABLED: "false",
      LOGIN_OAUTH_ENABLED: "true",
      LOGIN_OPENID_ENABLED: "false",
      LOGIN_PAGE_TITLE: "Log In",
      LOGIN_PAGE_DESCRIPTION: "Log in to your account",
      LOGIN_REDIRECT_URL: "/",
    }

    // Merge default settings with database settings
    const mergedSettings = { ...defaultSettings, ...settingsObject }

    return NextResponse.json(mergedSettings)
  } catch (error) {
    console.error("Error fetching login settings:", error)
    return NextResponse.json({ error: "Failed to fetch login settings" }, { status: 500 })
  }
}

