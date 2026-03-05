import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { listEvents, deleteEvent } from "@/src/services/admin.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/admin/events
 * List all events (no visibility filter). ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const events = await listEvents()
      return successResponse({ events })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * DELETE /api/admin/events
 * Delete an event by ID. ADMIN only.
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
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Event ID is required", 400)
      }

      await deleteEvent(id)
      return successResponse({ message: "Event deleted" })
    } catch (err) {
      return handleError(err)
    }
  })
}
