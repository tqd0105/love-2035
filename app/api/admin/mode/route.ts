import { NextRequest } from "next/server"
import type { Mode } from "@/generated/prisma/client"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { getSystemMode, setSystemMode, getSystemConfig } from "@/src/services/admin.service"
import { withAuth } from "@/src/middleware/auth.middleware"

const VALID_MODES: Mode[] = ["RELATIONSHIP", "WEDDING", "ARCHIVE"]

/**
 * GET /api/admin/mode
 * Returns the current system mode and feature flags. ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const config = await getSystemConfig()
      return successResponse(config)
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * PUT /api/admin/mode
 * Switch system mode. ADMIN only.
 *
 * Body: { "mode": "RELATIONSHIP" | "WEDDING" | "ARCHIVE" }
 */
export async function PUT(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const body = await req.json().catch(() => null)
      if (!body) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
      }

      const { mode } = body
      if (!mode || !VALID_MODES.includes(mode as Mode)) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          `Invalid mode. Must be one of: ${VALID_MODES.join(", ")}`,
          400,
        )
      }

      const updated = await setSystemMode(mode as Mode)
      return successResponse({ mode: updated })
    } catch (err) {
      return handleError(err)
    }
  })
}
