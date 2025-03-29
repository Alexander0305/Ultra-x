import crypto from "crypto"
import { redis } from "@/lib/redis"
import prisma from "@/lib/db/prisma"

// Generate secure token
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

// Hash sensitive data
export function hashData(data: string, salt?: string): { hash: string; salt: string } {
  const dataSalt = salt || crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(data, dataSalt, 1000, 64, "sha512").toString("hex")

  return { hash, salt: dataSalt }
}

// Verify hashed data
export function verifyHashedData(data: string, hash: string, salt: string): boolean {
  const { hash: newHash } = hashData(data, salt)
  return newHash === hash
}

// Check for suspicious activity
export async function checkSuspiciousActivity(
  userId: string,
  action: string,
  ip: string,
): Promise<{ suspicious: boolean; reason?: string }> {
  try {
    // Get user's known IPs
    const knownIpsKey = `security:known_ips:${userId}`
    const knownIps = await redis.smembers(knownIpsKey)

    // If this is a new IP and it's a sensitive action, flag it
    const isNewIp = !knownIps.includes(ip)
    const isSensitiveAction = ["password_change", "email_change", "payment_add"].includes(action)

    if (isNewIp && isSensitiveAction) {
      return {
        suspicious: true,
        reason: "New IP address detected for sensitive action",
      }
    }

    // Check for rapid actions (rate limiting)
    const actionKey = `security:actions:${userId}:${action}`
    const actionCount = await redis.incr(actionKey)
    await redis.expire(actionKey, 3600) // 1 hour expiration

    if (actionCount > 10) {
      // More than 10 of the same action in an hour
      return {
        suspicious: true,
        reason: "Too many actions in a short time period",
      }
    }

    // If not suspicious, add this IP to known IPs
    if (isNewIp) {
      await redis.sadd(knownIpsKey, ip)
      await redis.expire(knownIpsKey, 60 * 60 * 24 * 90) // 90 days expiration
    }

    return { suspicious: false }
  } catch (error) {
    console.error("Error checking suspicious activity:", error)
    return { suspicious: false } // Default to not suspicious on error
  }
}

// Log security event
export async function logSecurityEvent(
  userId: string,
  event: string,
  metadata: Record<string, any> = {},
  ip?: string,
): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        userId,
        event,
        metadata,
        ipAddress: ip,
      },
    })
  } catch (error) {
    console.error("Error logging security event:", error)
  }
}

// Generate two-factor authentication secret
export function generateTwoFactorSecret(): string {
  return crypto.randomBytes(20).toString("hex")
}

// Generate two-factor authentication QR code URL
export function generateTwoFactorQrCodeUrl(secret: string, email: string): string {
  const appName = "SocialNet"
  const encodedAppName = encodeURIComponent(appName)
  const encodedEmail = encodeURIComponent(email)

  return `otpauth://totp/${encodedAppName}:${encodedEmail}?secret=${secret}&issuer=${encodedAppName}`
}

// Verify two-factor authentication code
export function verifyTwoFactorCode(secret: string, code: string): boolean {
  // This is a simplified implementation
  // In a real app, you would use a library like 'otplib'
  const now = Math.floor(Date.now() / 1000 / 30)

  // Check current and adjacent time windows
  for (let i = -1; i <= 1; i++) {
    const timeWindow = now + i
    const expectedCode = generateCodeForTimeWindow(secret, timeWindow)

    if (expectedCode === code) {
      return true
    }
  }

  return false
}

// Helper function to generate TOTP code for a specific time window
function generateCodeForTimeWindow(secret: string, timeWindow: number): string {
  const timeBuffer = Buffer.alloc(8)
  timeBuffer.writeBigInt64BE(BigInt(timeWindow), 0)

  const hmac = crypto.createHmac("sha1", Buffer.from(secret, "hex"))
  hmac.update(timeBuffer)
  const hmacResult = hmac.digest()

  const offset = hmacResult[hmacResult.length - 1] & 0xf
  const code =
    ((hmacResult[offset] & 0x7f) << 24) |
    ((hmacResult[offset + 1] & 0xff) << 16) |
    ((hmacResult[offset + 2] & 0xff) << 8) |
    (hmacResult[offset + 3] & 0xff)

  return (code % 1000000).toString().padStart(6, "0")
}

