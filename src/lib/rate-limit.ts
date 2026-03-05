import { NextRequest } from "next/server"
import { errorResponse } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"

/**
 * Simple in-memory sliding-window rate limiter.
 *
 * Tracks request timestamps per key (IP address).
 * Not shared across instances — suitable for single-process deployments.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000

let cleanupTimer: ReturnType<typeof setInterval> | null = null

function startCleanup(windowMs: number) {
  if (cleanupTimer) return
  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)
      if (entry.timestamps.length === 0) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL_MS)
  // Allow process to exit without waiting for cleanup
  if (cleanupTimer && typeof cleanupTimer === "object" && "unref" in cleanupTimer) {
    cleanupTimer.unref()
  }
}

/**
 * Extract client IP from request headers.
 * Checks x-forwarded-for (behind proxy/load balancer), falls back to "unknown".
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) {
    // Take the first IP (original client)
    return forwarded.split(",")[0]!.trim()
  }
  return "unknown"
}

/**
 * Check if a request exceeds the rate limit.
 *
 * @param key      - Unique identifier (typically IP + route)
 * @param maxHits  - Maximum requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request is allowed, false if rate-limited
 */
function isAllowed(key: string, maxHits: number, windowMs: number): boolean {
  startCleanup(windowMs)

  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    store.set(key, { timestamps: [now] })
    return true
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs)

  if (entry.timestamps.length >= maxHits) {
    return false
  }

  entry.timestamps.push(now)
  return true
}

/**
 * Create a rate-limit check function for a specific endpoint.
 *
 * @param routeKey - Identifier for the route (e.g. "wishes-create")
 * @param maxHits  - Maximum requests per window (default: 10)
 * @param windowMs - Window duration in ms (default: 60_000 = 1 minute)
 *
 * Returns null if allowed, or a 429 Response if rate-limited.
 */
export function rateLimit(
  routeKey: string,
  maxHits = 10,
  windowMs = 60_000,
) {
  return (request: NextRequest) => {
    const ip = getClientIp(request)
    const key = `${routeKey}:${ip}`

    if (!isAllowed(key, maxHits, windowMs)) {
      return errorResponse(
        ErrorCode.VALIDATION_ERROR,
        "Too many requests. Please try again later.",
        429,
      )
    }

    return null // allowed
  }
}
