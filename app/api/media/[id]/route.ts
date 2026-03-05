import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { getMediaById, deleteMedia } from "@/src/services/media.service"
import { assertAccess } from "@/src/services/visibility.service"
import { withAuth } from "@/src/middleware/auth.middleware"
import { withModeGuard } from "@/src/middleware/mode.middleware"

/**
 * Extract media ID from pathname: /api/media/[id]
 */
function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/")
  return segments[segments.length - 1]!
}

/**
 * GET /api/media/[id]
 *
 * Get a single media item by ID with visibility check.
 *
 * Flow: Auth → fetch → visibility check → respond
 */
const getHandler = async (request: NextRequest) => {
  return withAuth(request, async (_req, session) => {
    try {
      const id = extractId(request)
      const media = await getMediaById(id)

      assertAccess(session.role, media.visibility)

      return successResponse({ media })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * DELETE /api/media/[id]
 *
 * Delete a media item.
 *
 * Only COUPLE or ADMIN can delete.
 * ARCHIVE mode blocks deletion.
 */
const deleteHandler = withModeGuard("CREATE_MEDIA")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can delete media", 403),
      )
    }

    const id = extractId(request)
    await deleteMedia(id)

    return successResponse({ message: "Media deleted successfully" })
  } catch (err) {
    return handleError(err)
  }
})

export { getHandler as GET, deleteHandler as DELETE }
