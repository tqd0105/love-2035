import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { getTimelineEvents } from "@/src/services/timeline.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/timeline
 *
 * Return sorted timeline events with visibility applied.
 *
 * Flow:
 *   Auth Middleware (via withVisibilityFilter)
 *   → Route Handler (queries DB with visibility filter)
 *
 * Response: { success: true, data: { timelineEvents: [...] } }
 */
const handler = withVisibilityFilter(async (_request, session) => {
  try {
    const timelineEvents = await getTimelineEvents(session.role)
    return successResponse({ timelineEvents })
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
