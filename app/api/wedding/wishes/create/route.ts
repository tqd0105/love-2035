import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createWish } from "@/src/services/wedding.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"
import { rateLimit } from "@/src/lib/rate-limit"
import { invalidateCache } from "@/src/lib/cache"
import { logger } from "@/src/lib/logger"
import { createWishSchema, validateBody } from "@/src/lib/validations"

const checkRateLimit = rateLimit("wishes-create", 10, 60_000) // 10 req/min per IP

/**
 * POST /api/wedding/wishes/create
 *
 * Create a new wedding wish.
 * Rate-limited to 10 requests per minute per IP.
 *
 * Flow: Rate limit → Auth → Mode guard (GUEST_INTERACTION) → validate → service
 *
 * Any authenticated user can create a wish when mode = WEDDING.
 */
const handler = withModeGuard("GUEST_INTERACTION")(async (request, context) => {
  try {
    const rateLimited = checkRateLimit(request)
    if (rateLimited) return rateLimited

    const body = await request.json().catch(() => null)
    const { name, message, photoUrl } = validateBody(createWishSchema, body)

    const wish = await createWish({
      name,
      message,
      photoUrl,
    })

    // Invalidate wishes list cache on new wish
    invalidateCache("wedding:wishes")

    logger.info(
      { endpoint: "/api/wedding/wishes/create", userId: context.session.userId, wishId: wish.id },
      "Wedding wish created",
    )

    return successResponse({ wish }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
