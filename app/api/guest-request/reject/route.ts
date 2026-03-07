import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { withAuth } from "@/src/middleware/auth.middleware"
import { prisma } from "@/src/lib/prisma"
import { logger } from "@/src/lib/logger"

/**
 * POST /api/guest-request/reject
 *
 * Body: { id: string }
 *
 * Rejects a pending guest request.
 * ADMIN only.
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const body = await req.json().catch(() => null)
      if (!body || !body.id || typeof body.id !== "string") {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Guest request ID is required", 400)
      }

      const guestRequest = await prisma.guestRequest.findUnique({
        where: { id: body.id },
      })

      if (!guestRequest) {
        throw new AppError(ErrorCode.NOT_FOUND, "Guest request not found", 404)
      }

      if (guestRequest.status !== "PENDING") {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Only pending requests can be rejected", 400)
      }

      await prisma.guestRequest.update({
        where: { id: body.id },
        data: { status: "REJECTED" },
      })

      logger.info(
        { endpoint: "/api/guest-request/reject", requestId: body.id },
        "Guest request rejected",
      )

      return successResponse({ message: "Guest request rejected" })
    } catch (err) {
      return handleError(err)
    }
  })
}
