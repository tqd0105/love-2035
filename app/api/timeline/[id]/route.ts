import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { getTimelineEventById } from "@/src/services/timeline.service"
import { withVisibility, type VisibilityContext } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/timeline/[id]
 *
 * Fetch a single timeline event with visibility enforcement.
 *
 * Flow:
 *   Auth Middleware (via withVisibility)
 *   → Visibility Middleware (checks role vs content visibility)
 *   → Route Handler (returns data)
 *
 * Response: { success: true, data: { timelineEvent: {...} } }
 */

// Resolve visibility from DB for the requested timeline event
const checkVisibility = withVisibility(async (request, _session) => {
  const id = request.nextUrl.pathname.split("/").pop()!
  const event = await getTimelineEventById(id)
  return { visibility: event.visibility, passwordHash: null }
})

// Handler after auth + visibility pass
const handler = checkVisibility(async (request: NextRequest, context: VisibilityContext) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop()!
    const timelineEvent = await getTimelineEventById(id)

    return successResponse({ timelineEvent })
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
