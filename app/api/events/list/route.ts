import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { listEvents } from "@/src/services/event.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/events/list
 *
 * List all events visible to the authenticated user.
 *
 * Flow: Auth → service (visibility filtered at DB level) → respond
 *
 * Visibility filtering is handled in the service layer via
 * visibilityWhereClause, so no visibility middleware needed here.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      const events = await listEvents(session.role)
      return successResponse({ events })
    } catch (err) {
      return handleError(err)
    }
  })
}
