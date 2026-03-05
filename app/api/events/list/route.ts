import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { listEvents } from "@/src/services/event.service"
import { withAuth } from "@/src/middleware/auth.middleware"
import { cached } from "@/src/lib/cache"

const CACHE_TTL = 60_000 // 60 seconds

/**
 * GET /api/events/list
 *
 * List all events visible to the authenticated user.
 * Responses are cached for 60 seconds.
 *
 * Query params:
 *   ?page=1&limit=50 — pagination
 *
 * Flow: Auth → cache → service (visibility filtered at DB level) → respond
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      const { searchParams } = req.nextUrl
      const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
      const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50))

      const cacheKey = `events-list:${session.role}:${page}:${limit}`
      const result = await cached(cacheKey, CACHE_TTL, () =>
        listEvents(session.role, { page, limit }),
      )

      return successResponse(result)
    } catch (err) {
      return handleError(err)
    }
  })
}
