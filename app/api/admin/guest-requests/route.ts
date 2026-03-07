import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { withAuth } from "@/src/middleware/auth.middleware"
import { prisma } from "@/src/lib/prisma"

/**
 * GET /api/admin/guest-requests
 * List all guest access requests. ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const requests = await prisma.guestRequest.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          relationship: true,
          message: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return successResponse({ requests })
    } catch (err) {
      return handleError(err)
    }
  })
}
