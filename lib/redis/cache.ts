import { redis } from './client'

export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get<T>(key)
    return data
  } catch (error) {
    console.error(`Redis GET error for key ${key}:`, error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, expireSeconds: number = 3600): Promise<void> {
  try {
    await redis.set(key, data, { ex: expireSeconds })
  } catch (error) {
    console.error(`Redis SET error for key ${key}:`, error)
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error(`Redis DEL error for key ${key}:`, error)
  }
}
