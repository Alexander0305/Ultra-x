import prisma from "@/lib/db/prisma"
import { cache } from "react"
import { LRUCache } from "lru-cache"

// In-memory cache for ultra-fast access
const memoryCache = new LRUCache<string, any>({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 5, // 5 minutes
  updateAgeOnGet: true, // Update age on access
})

// Interface for environment variables
export interface EnvVariable {
  key: string
  value: string
  description?: string
  isSecret: boolean
  category: string
}

// Get all environment variables (cached)
export const getEnvVariables = cache(async (category?: string): Promise<EnvVariable[]> => {
  try {
    // Cache key
    const cacheKey = `config:env_vars${category ? `:${category}` : ""}`

    // Try memory cache first (fastest)
    const cachedVars = memoryCache.get(cacheKey)
    if (cachedVars) {
      return cachedVars
    }

    // If not in memory cache, get from database
    const where = category ? { category } : {}

    const variables = await prisma.environmentVariable.findMany({
      where,
      select: {
        key: true,
        value: true,
        description: true,
        isSecret: true,
        category: true,
      },
      orderBy: {
        key: "asc",
      },
    })

    // Cache the result
    memoryCache.set(cacheKey, variables)

    return variables
  } catch (error) {
    console.error("Error getting environment variables:", error)
    return []
  }
})

// Get a single environment variable by key (cached)
export const getEnvVariable = cache(async (key: string): Promise<string | null> => {
  try {
    // Cache key
    const cacheKey = `config:env_var:${key}`

    // Try memory cache first (fastest)
    const cachedVar = memoryCache.get(cacheKey)
    if (cachedVar !== undefined) {
      return cachedVar
    }

    // If not in memory cache, get from database
    const variable = await prisma.environmentVariable.findUnique({
      where: { key },
      select: { value: true },
    })

    if (!variable) {
      // If not found in database, check Node.js environment variables
      const envValue = process.env[key]

      // Cache the result (even if it's null)
      memoryCache.set(cacheKey, envValue || null)

      return envValue || null
    }

    // Cache the result
    memoryCache.set(cacheKey, variable.value)

    return variable.value
  } catch (error) {
    console.error(`Error getting environment variable ${key}:`, error)

    // Fallback to Node.js environment variables
    return process.env[key] || null
  }
})

// Set an environment variable
export async function setEnvVariable(
  key: string,
  value: string,
  options?: {
    description?: string
    isSecret?: boolean
    category?: string
    userId?: string
    ipAddress?: string
    userAgent?: string
  },
): Promise<EnvVariable | null> {
  try {
    // Check if variable exists
    const existingVar = await prisma.environmentVariable.findUnique({
      where: { key },
    })

    let result

    if (existingVar) {
      // Update existing variable
      result = await prisma.environmentVariable.update({
        where: { key },
        data: {
          value,
          description: options?.description !== undefined ? options.description : existingVar.description,
          isSecret: options?.isSecret !== undefined ? options.isSecret : existingVar.isSecret,
          category: options?.category || existingVar.category,
          updatedBy: options?.userId,
        },
      })

      // Create audit log
      await prisma.configAuditLog.create({
        data: {
          action: "UPDATE",
          entityType: "ENVIRONMENT_VARIABLE",
          entityId: result.id,
          previousValue: existingVar.isSecret ? "[REDACTED]" : existingVar.value,
          newValue: result.isSecret ? "[REDACTED]" : value,
          userId: options?.userId || "system",
          ipAddress: options?.ipAddress,
          userAgent: options?.userAgent,
        },
      })
    } else {
      // Create new variable
      result = await prisma.environmentVariable.create({
        data: {
          key,
          value,
          description: options?.description,
          isSecret: options?.isSecret || false,
          category: options?.category || "general",
          createdBy: options?.userId,
        },
      })

      // Create audit log
      await prisma.configAuditLog.create({
        data: {
          action: "CREATE",
          entityType: "ENVIRONMENT_VARIABLE",
          entityId: result.id,
          newValue: result.isSecret ? "[REDACTED]" : value,
          userId: options?.userId || "system",
          ipAddress: options?.ipAddress,
          userAgent: options?.userAgent,
        },
      })
    }

    // Invalidate cache
    memoryCache.delete(`config:env_var:${key}`)
    memoryCache.delete(`config:env_vars`)
    memoryCache.delete(`config:env_vars:${result.category}`)

    return {
      key: result.key,
      value: result.value,
      description: result.description || undefined,
      isSecret: result.isSecret,
      category: result.category,
    }
  } catch (error) {
    console.error(`Error setting environment variable ${key}:`, error)
    return null
  }
}

// Delete an environment variable
export async function deleteEnvVariable(
  key: string,
  options?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
  },
): Promise<boolean> {
  try {
    // Get variable before deletion for audit log
    const variable = await prisma.environmentVariable.findUnique({
      where: { key },
    })

    if (!variable) {
      return false
    }

    // Delete variable
    await prisma.environmentVariable.delete({
      where: { key },
    })

    // Create audit log
    await prisma.configAuditLog.create({
      data: {
        action: "DELETE",
        entityType: "ENVIRONMENT_VARIABLE",
        entityId: variable.id,
        previousValue: variable.isSecret ? "[REDACTED]" : variable.value,
        userId: options?.userId || "system",
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      },
    })

    // Invalidate cache
    memoryCache.delete(`config:env_var:${key}`)
    memoryCache.delete(`config:env_vars`)
    memoryCache.delete(`config:env_vars:${variable.category}`)

    return true
  } catch (error) {
    console.error(`Error deleting environment variable ${key}:`, error)
    return false
  }
}

// Initialize default environment variables
export async function initializeDefaultEnvVariables(): Promise<void> {
  try {
    // Define default variables
    const defaultVars: Array<{
      key: string
      value: string
      description: string
      isSecret: boolean
      category: string
    }> = [
      {
        key: "SITE_NAME",
        value: "SocialNet",
        description: "The name of the site",
        isSecret: false,
        category: "general",
      },
      {
        key: "SITE_URL",
        value: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
        description: "The URL of the site",
        isSecret: false,
        category: "general",
      },
      {
        key: "ADMIN_EMAIL",
        value: process.env.ADMIN_EMAIL || "admin@example.com",
        description: "The email address for admin notifications",
        isSecret: false,
        category: "general",
      },
      {
        key: "ENABLE_REGISTRATION",
        value: "true",
        description: "Whether new user registration is enabled",
        isSecret: false,
        category: "security",
      },
      {
        key: "MAX_UPLOAD_SIZE",
        value: "10485760", // 10MB
        description: "Maximum file upload size in bytes",
        isSecret: false,
        category: "media",
      },
      {
        key: "ALLOWED_FILE_TYPES",
        value: "jpg,jpeg,png,gif,mp4,mp3,pdf",
        description: "Comma-separated list of allowed file extensions",
        isSecret: false,
        category: "media",
      },
      {
        key: "ENABLE_EMAIL_NOTIFICATIONS",
        value: "true",
        description: "Whether to send email notifications",
        isSecret: false,
        category: "notifications",
      },
      {
        key: "ENABLE_PUSH_NOTIFICATIONS",
        value: "true",
        description: "Whether to send push notifications",
        isSecret: false,
        category: "notifications",
      },
      {
        key: "FEATURE_STORIES",
        value: "true",
        description: "Enable stories feature",
        isSecret: false,
        category: "features",
      },
      {
        key: "FEATURE_MARKETPLACE",
        value: "true",
        description: "Enable marketplace feature",
        isSecret: false,
        category: "features",
      },
      {
        key: "FEATURE_EVENTS",
        value: "true",
        description: "Enable events feature",
        isSecret: false,
        category: "features",
      },
      {
        key: "FEATURE_GROUPS",
        value: "true",
        description: "Enable groups feature",
        isSecret: false,
        category: "features",
      },
      {
        key: "CONTENT_MODERATION_ENABLED",
        value: process.env.OPENAI_API_KEY ? "true" : "false",
        description: "Enable automatic content moderation",
        isSecret: false,
        category: "security",
      },
    ]

    // Import environment variables from .env if they exist
    const envVars = [
      "GOOGLE_CLIENT_ID",
      "GOOGLE_CLIENT_SECRET",
      "FACEBOOK_CLIENT_ID",
      "FACEBOOK_CLIENT_SECRET",
      "TWITTER_CLIENT_ID",
      "TWITTER_CLIENT_SECRET",
      "GITHUB_CLIENT_ID",
      "GITHUB_CLIENT_SECRET",
      "NEXTAUTH_SECRET",
      "UPSTASH_REDIS_REST_URL",
      "UPSTASH_REDIS_REST_TOKEN",
      "OPENAI_API_KEY",
      "DATABASE_URL",
      "EMAIL_SERVER_HOST",
      "EMAIL_SERVER_PORT",
      "EMAIL_SERVER_USER",
      "EMAIL_SERVER_PASSWORD",
      "EMAIL_FROM",
      "S3_UPLOAD_KEY",
      "S3_UPLOAD_SECRET",
      "S3_UPLOAD_BUCKET",
      "S3_UPLOAD_REGION",
    ]

    for (const key of envVars) {
      if (process.env[key]) {
        defaultVars.push({
          key,
          value: process.env[key] as string,
          description: `Imported from environment`,
          isSecret: key.includes("SECRET") || key.includes("KEY") || key.includes("TOKEN") || key.includes("PASSWORD"),
          category: key.includes("EMAIL")
            ? "email"
            : key.includes("S3")
              ? "storage"
              : key.includes("DATABASE")
                ? "database"
                : "auth",
        })
      }
    }

    // Create or update each default variable
    for (const variable of defaultVars) {
      await setEnvVariable(variable.key, variable.value, {
        description: variable.description,
        isSecret: variable.isSecret,
        category: variable.category,
      })
    }

    console.log("Default environment variables initialized")
  } catch (error) {
    console.error("Error initializing default environment variables:", error)
  }
}

// Get environment variable with fallback
export async function env(key: string, defaultValue = ""): Promise<string> {
  const value = await getEnvVariable(key)
  return value !== null ? value : defaultValue
}

// Check if a feature is enabled (for feature flags)
export async function isFeatureEnabled(featureKey: string): Promise<boolean> {
  const value = await getEnvVariable(`FEATURE_${featureKey.toUpperCase()}`)
  return value === "true" || value === "1"
}

// Get all feature flags
export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  const variables = await getEnvVariables("features")
  const featureFlags: Record<string, boolean> = {}

  for (const variable of variables) {
    featureFlags[variable.key.replace("FEATURE_", "")] = variable.value === "true" || variable.value === "1"
  }

  return featureFlags
}

// Bulk update environment variables
export async function bulkUpdateEnvVariables(
  updates: Array<{
    key: string
    value: string
    description?: string
    isSecret?: boolean
    category?: string
  }>,
  options?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
  },
): Promise<boolean> {
  try {
    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(async (tx) => {
      for (const update of updates) {
        await setEnvVariable(update.key, update.value, {
          description: update.description,
          isSecret: update.isSecret,
          category: update.category,
          userId: options?.userId,
          ipAddress: options?.ipAddress,
          userAgent: options?.userAgent,
        })
      }
    })

    return true
  } catch (error) {
    console.error("Error bulk updating environment variables:", error)
    return false
  }
}

// Export environment variables to .env format
export async function exportEnvVariables(includeSecrets = false): Promise<string> {
  const variables = await getEnvVariables()

  return variables
    .filter((v) => includeSecrets || !v.isSecret)
    .map((v) => `${v.key}=${v.value}`)
    .join("\n")
}

// Import environment variables from .env format
export async function importEnvVariables(
  envContent: string,
  options?: {
    userId?: string
    ipAddress?: string
    userAgent?: string
  },
): Promise<{ success: boolean; imported: number; errors: string[] }> {
  const lines = envContent.split("\n")
  const updates: Array<{
    key: string
    value: string
  }> = []
  const errors: string[] = []

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || !line.trim()) {
      continue
    }

    // Parse key-value pair
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const [, key, value] = match
      updates.push({
        key: key.trim(),
        value: value.trim(),
      })
    } else {
      errors.push(`Invalid format: ${line}`)
    }
  }

  // Update variables
  try {
    await bulkUpdateEnvVariables(updates, options)

    return {
      success: true,
      imported: updates.length,
      errors,
    }
  } catch (error) {
    console.error("Error importing environment variables:", error)
    errors.push("Database error during import")

    return {
      success: false,
      imported: 0,
      errors,
    }
  }
}

