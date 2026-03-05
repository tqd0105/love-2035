import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { listMedia, deleteMedia } from "@/src/services/admin.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/admin/media
 * List all media (no visibility filter). ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const media = await listMedia()
      return successResponse({ media })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * DELETE /api/admin/media
 * Delete a media item by ID. ADMIN only.
 *
 * Body: { "id": "string" }
 */
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const body = await req.json().catch(() => null)
      if (!body) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
      }

      const { id } = body
      if (!id || typeof id !== "string") {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Media ID is required", 400)
      }

      await deleteMedia(id)
      return successResponse({ message: "Media deleted" })
    } catch (err) {
      return handleError(err)
    }
  })
}
