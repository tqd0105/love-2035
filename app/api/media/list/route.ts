import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { listMedia } from "@/src/services/media.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/media/list
 *
 * List all media visible to the authenticated user.
 *
 * Flow: Auth → service (visibility filtered at DB level) → respond
 */
const handler = withVisibilityFilter(async (_request, session) => {
  try {
    const media = await listMedia(session.role)
    return successResponse({ media })
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
