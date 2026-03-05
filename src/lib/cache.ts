/**
 * Simple in-memory cache for API responses.
 *
 * Stores serializable data keyed by a string.
 * Each entry has a TTL after which it expires.
 *
 * Not shared across server instances — suitable for
 * single-process deployments. For multi-instance setups,
 * swap with Redis.
 */

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<unknown>>()

/**
 * Get a cached value or compute and cache it.
 *
 * @param key   - Unique cache key
 * @param ttlMs - Time-to-live in milliseconds
 * @param fn    - Async function to compute the value on cache miss
 */
export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const now = Date.now()
  const entry = store.get(key) as CacheEntry<T> | undefined

  if (entry && entry.expiresAt > now) {
    return entry.data
  }

  const data = await fn()
  store.set(key, { data, expiresAt: now + ttlMs })
  return data
}

/**
 * Invalidate a specific cache key.
 */
export function invalidateCache(key: string): void {
  store.delete(key)
}

/**
 * Invalidate all cache keys matching a prefix.
 */
export function invalidateCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key)
    }
  }
}
