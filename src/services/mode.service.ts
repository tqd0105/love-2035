import type { Mode } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { invalidateCacheByPrefix } from "@/src/lib/cache"

/**
 * In-memory mode cache.
 *
 * From mode-system.md §5.1:
 *   1. Load SystemConfig from database
 *   2. Cache in memory (optional)
 *   3. Inject into request context
 *
 * Cache TTL: 60 seconds — avoids hitting DB on every request
 * while keeping mode switches responsive.
 */
let cachedMode: Mode | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 60_000 // 60 seconds

/**
 * Fetch the current system mode from database.
 * Uses in-memory cache to reduce DB load.
 *
 * There should only be one SystemConfig record (seeded on init).
 */
export async function getSystemMode(): Promise<Mode> {
  const now = Date.now()

  if (cachedMode && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedMode
  }

  const config = await prisma.systemConfig.findFirst({
    select: { mode: true },
  })

  if (!config) {
    throw new AppError(
      ErrorCode.INTERNAL_ERROR,
      "SystemConfig not found — run database seed first",
      500,
    )
  }

  cachedMode = config.mode
  cacheTimestamp = now

  return config.mode
}

/**
 * Update the system mode. ADMIN only (enforced in route/middleware).
 *
 * From mode-system.md §5.2:
 *   1. Validate role (caller responsibility)
 *   2. Update SystemConfig
 *   3. Invalidate cache
 */
export async function setSystemMode(mode: Mode): Promise<Mode> {
  const config = await prisma.systemConfig.findFirst({
    select: { id: true },
  })

  if (!config) {
    throw new AppError(
      ErrorCode.INTERNAL_ERROR,
      "SystemConfig not found — run database seed first",
      500,
    )
  }

  const updated = await prisma.systemConfig.update({
    where: { id: config.id },
    data: {
      mode,
      weddingEnabled: mode === "WEDDING",
      archiveEnabled: mode === "ARCHIVE",
    },
    select: { mode: true },
  })

  // Invalidate mode cache
  invalidateModeCache()

  // Invalidate content caches so responses reflect new mode restrictions
  invalidateCacheByPrefix("timeline")
  invalidateCacheByPrefix("wedding")

  return updated.mode
}

/**
 * Invalidate the in-memory mode cache.
 * Called after mode switch.
 */
export function invalidateModeCache(): void {
  cachedMode = null
  cacheTimestamp = 0
}
