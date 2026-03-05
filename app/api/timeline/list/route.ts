import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { getTimelineEvents, getTimelineEventsByYear } from "@/src/services/timeline.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"
import { cached } from "@/src/lib/cache"

const CACHE_TTL = 60_000 // 60 seconds

/**
 * GET /api/timeline/list
 *
 * List timeline events sorted chronologically (date ASC).
 * Responses are cached for 60 seconds.
 *
 * Query params:
 *   ?year=2025       — filter by year
 *   ?page=1&limit=50 — pagination
 *
 * Flow: Auth → visibility filter (DB-level) → cache → respond
 */
const handler = withVisibilityFilter(async (request, session) => {
  try {
    const { searchParams } = request.nextUrl
    const yearParam = searchParams.get("year")
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50))

    if (yearParam) {
      const year = parseInt(yearParam, 10)
      if (isNaN(year) || year < 1900 || year > 2100) {
        return successResponse({ events: [], pagination: { page: 1, limit, total: 0, totalPages: 0 } })
      }
      const cacheKey = `timeline-list:${session.role}:year:${year}:${page}:${limit}`
      const result = await cached(cacheKey, CACHE_TTL, () =>
        getTimelineEventsByYear(session.role, year, { page, limit }),
      )
      return successResponse(result)
    }

    const cacheKey = `timeline-list:${session.role}:all:${page}:${limit}`
    const result = await cached(cacheKey, CACHE_TTL, () =>
      getTimelineEvents(session.role, { page, limit }),
    )
    return successResponse(result)
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
