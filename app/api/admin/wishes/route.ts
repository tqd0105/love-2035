import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { listWishes, deleteWish } from "@/src/services/admin.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/admin/wishes
 * List all wedding wishes. ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const wishes = await listWishes()
      return successResponse({ wishes })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * DELETE /api/admin/wishes
 * Delete a wedding wish by ID. ADMIN only.
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
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Wish ID is required", 400)
      }

      await deleteWish(id)
      return successResponse({ message: "Wish deleted" })
    } catch (err) {
      return handleError(err)
    }
  })
}
