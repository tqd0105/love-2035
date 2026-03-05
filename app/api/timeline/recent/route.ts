import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { getRecentEvents } from "@/src/services/timeline.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"
import { cached } from "@/src/lib/cache"

const CACHE_TTL = 60_000 // 60 seconds

/**
 * GET /api/timeline/recent
 *
 * Return the most recent timeline events (newest first).
 * Responses are cached for 60 seconds.
 *
 * Query params:
 *   ?limit=5 — number of events to return (default 5, max 20)
 *
 * Flow: Auth → visibility filter (DB-level) → cache → respond
 */
const handler = withVisibilityFilter(async (request, session) => {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit")
    const limit = Math.min(20, Math.max(1, parseInt(limitParam ?? "5", 10) || 5))

    const cacheKey = `timeline-recent:${session.role}:${limit}`
    const events = await cached(cacheKey, CACHE_TTL, () =>
      getRecentEvents(session.role, limit),
    )
    return successResponse({ events })
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
