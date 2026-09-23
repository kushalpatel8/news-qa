import { Redis } from '@upstash/redis'

// Initialize the Upstash Redis client
// Note: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be in .env.local
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})
