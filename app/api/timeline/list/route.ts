import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { getTimelineEvents, getTimelineEventsByYear } from "@/src/services/timeline.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/timeline/list
 *
 * List timeline events sorted chronologically (date ASC).
 *
 * Query params:
 *   ?year=2025       — filter by year
 *   ?page=1&limit=50 — pagination
 *
 * Flow: Auth → visibility filter (DB-level) → respond
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
      const result = await getTimelineEventsByYear(session.role, year, { page, limit })
      return successResponse(result)
    }

    const result = await getTimelineEvents(session.role, { page, limit })
    return successResponse(result)
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
