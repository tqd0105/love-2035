import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { listWishes } from "@/src/services/wedding.service"
import { getSystemMode } from "@/src/services/mode.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/wedding/wishes/list
 *
 * List all wedding wishes. Wishes are PUBLIC.
 *
 * Flow: Auth → check mode = WEDDING → service → respond
 *
 * Only available when system mode is WEDDING.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, _session) => {
    try {
      const mode = await getSystemMode()

      if (mode !== "WEDDING") {
        return errorResponse(
          ErrorCode.FORBIDDEN,
          "Wedding wishes are only available in WEDDING mode",
          403,
        )
      }

      const wishes = await listWishes()
      return successResponse({ wishes })
    } catch (err) {
      return handleError(err)
    }
  })
}
