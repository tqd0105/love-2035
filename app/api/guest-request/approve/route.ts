import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { withAuth } from "@/src/middleware/auth.middleware"
import { prisma } from "@/src/lib/prisma"
import { logger } from "@/src/lib/logger"

/**
 * POST /api/guest-request/approve
 *
 * Body: { id: string }
 *
 * Approves a pending guest request:
 * 1. Updates GuestRequest status to APPROVED
 * 2. Creates a User with role APPROVED_GUEST (random password)
 *
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
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Only pending requests can be approved", 400)
      }

      if (!guestRequest.passwordHash) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Guest request is missing password data", 400)
      }

      // Transaction: update request + create user with the password guest chose
      await prisma.$transaction([
        prisma.guestRequest.update({
          where: { id: body.id },
          data: {
            status: "APPROVED",
            approvedAt: new Date(),
            approvedBy: session.userId,
          },
        }),
        prisma.user.create({
          data: {
            email: guestRequest.email,
            passwordHash: guestRequest.passwordHash,
            role: "APPROVED_GUEST",
          },
        }),
      ])

      logger.info(
        { endpoint: "/api/guest-request/approve", requestId: body.id, email: guestRequest.email },
        "Guest request approved",
      )

      return successResponse({ message: "Guest request approved" })
    } catch (err) {
      return handleError(err)
    }
  })
}
