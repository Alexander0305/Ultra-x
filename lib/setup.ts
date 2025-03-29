import prisma from "@/lib/db/prisma"
import { hash } from "bcryptjs"
import { setEnvVariable } from "@/lib/config"
import { UserRole, UserTier } from "@prisma/client"

// Interface for setup data
export interface SetupData {
  database: {
    type: string
    host?: string
    port?: string
    database: string
    username?: string
    password?: string
    connectionString?: string
    useConnectionString?: boolean
  }
  admin: {
    name: string
    username: string
    email: string
    password: string
    avatar?: string
  }
  settings: {
    siteName: string
    siteDescription: string
    siteUrl: string
    logo?: string
    favicon?: string
    theme: string
    allowRegistration: boolean
    requireEmailVerification: boolean
    defaultTimezone: string
  }
  features: Record<string, boolean>
}

// Check if setup is already complete
export async function isSetupComplete(): Promise<boolean> {
  try {
    // Check if SETUP_COMPLETED env var exists
    const setupCompleted = await prisma.environmentVariable.findUnique({
      where: { key: "SETUP_COMPLETED" },
      select: { value: true },
    })

    if (setupCompleted && setupCompleted.value === "true") {
      return true
    }

    // Check if at least one admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: UserRole.ADMIN },
    })

    return !!adminExists
  } catch (error) {
    // If prisma is not connected or tables don't exist, setup is not complete
    return false
  }
}

// Test database connection
export async function testDatabaseConnection(dbConfig: SetupData["database"]): Promise<boolean> {
  try {
    // Test query to check if connection works
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Complete setup process
export async function completeSetup(data: SetupData): Promise<boolean> {
  try {
    // First, update database configuration
    // (In a production app, this might involve updating .env file or environment variables)
    let databaseUrl = ""

    if (data.database.useConnectionString && data.database.connectionString) {
      databaseUrl = data.database.connectionString
    } else {
      // Construct the connection string based on the database type
      switch (data.database.type) {
        case "postgresql":
          databaseUrl = `postgresql://${data.database.username}:${data.database.password}@${data.database.host}:${data.database.port || "5432"}/${data.database.database}`
          break
        case "mysql":
          databaseUrl = `mysql://${data.database.username}:${data.database.password}@${data.database.host}:${data.database.port || "3306"}/${data.database.database}`
          break
        case "sqlite":
          databaseUrl = `file:${data.database.database}`
          break
        default:
          throw new Error("Unsupported database type")
      }
    }

    // Store database URL in environment variables
    await setEnvVariable("DATABASE_URL", databaseUrl, {
      description: "Database connection string",
      isSecret: true,
      category: "database",
    })

    // Create admin user
    const hashedPassword = await hash(data.admin.password, 12)

    const adminUser = await prisma.user.create({
      data: {
        name: data.admin.name,
        username: data.admin.username,
        email: data.admin.email,
        password: hashedPassword,
        avatar: data.admin.avatar,
        role: UserRole.ADMIN,
        tier: UserTier.BUSINESS,
        isVerified: true,
        joinedAt: new Date(),
      },
    })

    // Store site settings
    const siteSettings = [
      { key: "SITE_NAME", value: data.settings.siteName, category: "general" },
      { key: "SITE_DESCRIPTION", value: data.settings.siteDescription, category: "general" },
      { key: "SITE_URL", value: data.settings.siteUrl, category: "general" },
      { key: "SITE_LOGO", value: data.settings.logo || "", category: "general" },
      { key: "SITE_FAVICON", value: data.settings.favicon || "", category: "general" },
      { key: "SITE_THEME", value: data.settings.theme, category: "general" },
      { key: "ALLOW_REGISTRATION", value: data.settings.allowRegistration ? "true" : "false", category: "security" },
      {
        key: "REQUIRE_EMAIL_VERIFICATION",
        value: data.settings.requireEmailVerification ? "true" : "false",
        category: "security",
      },
      { key: "DEFAULT_TIMEZONE", value: data.settings.defaultTimezone, category: "general" },
    ]

    for (const setting of siteSettings) {
      await setEnvVariable(setting.key, setting.value, {
        category: setting.category,
      })
    }

    // Store feature flags
    for (const [key, value] of Object.entries(data.features)) {
      await setEnvVariable(`FEATURE_${key.toUpperCase()}`, value ? "true" : "false", {
        category: "features",
      })
    }

    // Mark setup as complete
    await setEnvVariable("SETUP_COMPLETED", "true", {
      description: "Whether the initial setup has been completed",
      category: "system",
    })

    return true
  } catch (error) {
    console.error("Setup process failed:", error)
    return false
  }
}

// Get current setup status and progress
export async function getSetupStatus(): Promise<{
  complete: boolean
  progress: {
    database: boolean
    admin: boolean
    settings: boolean
    features: boolean
  }
}> {
  try {
    const complete = await isSetupComplete()

    // Check database connection
    let databaseSetup = false
    try {
      databaseSetup = await testDatabaseConnection({} as any)
    } catch {
      // Ignore errors
    }

    // Check if admin exists
    let adminSetup = false
    try {
      const adminExists = await prisma.user.findFirst({
        where: { role: UserRole.ADMIN },
      })
      adminSetup = !!adminExists
    } catch {
      // Ignore errors
    }

    // Check if settings exist
    let settingsSetup = false
    try {
      const siteNameVar = await prisma.environmentVariable.findUnique({
        where: { key: "SITE_NAME" },
      })
      settingsSetup = !!siteNameVar
    } catch {
      // Ignore errors
    }

    // Check if features are configured
    let featuresSetup = false
    try {
      const featureVars = await prisma.environmentVariable.findFirst({
        where: {
          key: {
            startsWith: "FEATURE_",
          },
        },
      })
      featuresSetup = !!featureVars
    } catch {
      // Ignore errors
    }

    return {
      complete,
      progress: {
        database: databaseSetup,
        admin: adminSetup,
        settings: settingsSetup,
        features: featuresSetup,
      },
    }
  } catch (error) {
    console.error("Failed to get setup status:", error)
    return {
      complete: false,
      progress: {
        database: false,
        admin: false,
        settings: false,
        features: false,
      },
    }
  }
}

