import { Redis } from "@upstash/redis"
import { env } from "@/lib/config"

// Create Redis client for caching and real-time features
let redisInstance: Redis | null = null

// Initialize Redis with dynamic config
export async function initRedis(): Promise<Redis> {
  if (redisInstance) {
    return redisInstance
  }

  const url = await env("UPSTASH_REDIS_REST_URL", "")
  const token = await env("UPSTASH_REDIS_REST_TOKEN", "")

  if (!url || !token) {
    throw new Error("Redis configuration is missing")
  }

  redisInstance = new Redis({
    url,
    token,
    automaticDeserialization: true,
  })

  return redisInstance
}

// Get Redis instance with connection pooling
export async function getRedis(): Promise<Redis> {
  if (!redisInstance) {
    return await initRedis()
  }
  return redisInstance
}

// Redis client with dynamic config and error handling
export const redis = {\
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const client = await getRedis()
      return await client.get(key) as T
    } catch (error) {
      console.error('Redis get error:', error)
      return null
    }
  },
  
  set: async <T>
;
;(key: string, data: T, options?: { ex?: number }): Promise<void> => {
  try {
    const client = await getRedis()
    if (options?.ex) {
      await client.set(key, data, { ex: options.ex })
    } else {
      await client.set(key, data)
    }
  } catch (error) {
    console.error("Redis set error:", error)
  }
},
  del
: async (key: string): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.del(key)
  } catch (error) {
    console.error("Redis delete error:", error)
  }
}
,
  
  incr: async (key: string): Promise<number> =>
{
  try {
    const client = await getRedis()
    return await client.incr(key)
  } catch (error) {
    console.error("Redis incr error:", error)
    return 0
  }
}
,
  
  expire: async (key: string, seconds: number): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.expire(key, seconds)
  } catch (error) {
    console.error("Redis expire error:", error)
  }
}
,
  
  lpush: async <T>(key: string, value: T): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.lpush(key, value)
  } catch (error) {
    console.error("Redis lpush error:", error)
  }
}
,
  
  rpush: async <T>(key: string, value: T): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.rpush(key, value)
  } catch (error) {
    console.error("Redis rpush error:", error)
  }
}
,
  
  lrange: async <T>(key: string, start: number, stop: number): Promise<T[]> =>
{
  try {
    const client = await getRedis()
    return await client.lrange(key, start, stop) as T[]
  } catch (error) {
    console.error("Redis lrange error:", error)
    return []
  }
}
,
  
  sadd: async (key: string, member: string): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.sadd(key, member)
  } catch (error) {
    console.error("Redis sadd error:", error)
  }
}
,
  
  srem: async (key: string, member: string): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.srem(key, member)
  } catch (error) {
    console.error("Redis srem error:", error)
  }
}
,
  
  smembers: async (key: string): Promise<string[]> =>
{
  try {
    const client = await getRedis()
    return await client.smembers(key)
  } catch (error) {
    console.error("Redis smembers error:", error)
    return []
  }
}
,
  
  sismember: async (key: string, member: string): Promise<boolean> =>
{
  try {
    const client = await getRedis()
    return await client.sismember(key, member)
  } catch (error) {
    console.error("Redis sismember error:", error)
    return false
  }
}
,
  
  hset: async (key: string, field: string, value: any): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.hset(key, { [field]: value })
  } catch (error) {
    console.error("Redis hset error:", error)
  }
}
,
  
  hget: async <T>(key: string, field: string): Promise<T | null> =>
{
  try {
    const client = await getRedis()
    return await client.hget(key, field) as T
  } catch (error) {
    console.error("Redis hget error:", error)
    return null
  }
}
,
  
  hgetall: async <T>(key: string): Promise<Record<string, T> | null> =>
{
  try {
    const client = await getRedis()
    return await client.hgetall(key) as Record<string, T>
  } catch (error) {
    console.error("Redis hgetall error:", error)
    return null
  }
}
,
  
  hdel: async (key: string, field: string): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.hdel(key, field)
  } catch (error) {
    console.error("Redis hdel error:", error)
  }
}
,
  
  // Batch operations for performance
  pipeline: async (commands: Array<[string, ...any[]]>): Promise<any[]> =>
{
  try {
    const client = await getRedis()
    const pipeline = client.pipeline()

    for (const [command, ...args] of commands) {
      // @ts-ignore - Dynamic command execution
      pipeline[command](...args)
    }

    return await pipeline.exec()
  } catch (error) {
    console.error("Redis pipeline error:", error)
    return []
  }
}
,
  
  // Health check
  ping: async (): Promise<boolean> =>
{
  try {
    const client = await getRedis()
    const result = await client.ping()
    return result === 'PONG'
  } catch (error) {
    console.error("Redis ping error:", error)
    return false
  }
}
,
  
  // Clear all keys (use with caution!)
  flushall: async (): Promise<void> =>
{
  try {
    const client = await getRedis()
    await client.flushall()
  } catch (error) {
    console.error("Redis flushall error:", error)
  }
}
,
}

