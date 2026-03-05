import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createWish } from "@/src/services/wedding.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"
import { rateLimit } from "@/src/lib/rate-limit"
import { invalidateCache } from "@/src/lib/cache"

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
    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { name, message, photoUrl } = body

    if (!name || typeof name !== "string" || !name.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Name is required", 400)
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Message is required", 400)
    }

    if (message.trim().length > 1000) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Message must be at most 1000 characters", 400)
    }

    if (photoUrl !== undefined && typeof photoUrl !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "photoUrl must be a string", 400)
    }

    const wish = await createWish({
      name: name.trim(),
      message: message.trim(),
      photoUrl: photoUrl?.trim(),
    })

    // Invalidate wishes list cache on new wish
    invalidateCache("wedding:wishes")

    return successResponse({ wish }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
