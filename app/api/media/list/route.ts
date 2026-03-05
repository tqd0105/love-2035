import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { listMedia } from "@/src/services/media.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/media/list
 *
 * List all media visible to the authenticated user.
 * Returns only id, url, mediaType for performance.
 *
 * Query params:
 *   ?page=1&limit=50 — pagination
 *
 * Flow: Auth → service (visibility filtered at DB level) → respond
 */
const handler = withVisibilityFilter(async (request, session) => {
  try {
    const { searchParams } = request.nextUrl
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50))

    const result = await listMedia(session.role, { page, limit })
    return successResponse(result)
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
