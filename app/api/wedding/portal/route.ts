import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { getSystemMode } from "@/src/services/mode.service"
import { listWishes } from "@/src/services/wedding.service"
import { withAuth } from "@/src/middleware/auth.middleware"
import { cached } from "@/src/lib/cache"

const CACHE_TTL = 30_000 // 30 seconds

/**
 * GET /api/wedding/portal
 *
 * Wedding portal data endpoint.
 * Returns aggregated wedding information when mode = WEDDING.
 * Cached for 30 seconds.
 *
 * Flow: Auth → check mode = WEDDING → aggregate → respond
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, _session) => {
    try {
      const mode = await getSystemMode()

      if (mode !== "WEDDING") {
        return errorResponse(
          ErrorCode.FORBIDDEN,
          "Wedding portal is only available in WEDDING mode",
          403,
        )
      }

      const portal = await cached("wedding:portal", CACHE_TTL, async () => {
        const wishes = await listWishes()
        return {
          mode: "WEDDING" as const,
          weddingEnabled: true,
          wishes,
          wishCount: wishes.length,
        }
      })

      return successResponse({ portal })
    } catch (err) {
      return handleError(err)
    }
  })
}
