import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createWish } from "@/src/services/wedding.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

/**
 * POST /api/wedding/wishes/create
 *
 * Create a new wedding wish.
 *
 * Flow: Auth → Mode guard (GUEST_INTERACTION, requires WEDDING mode) → validate → service
 *
 * Any authenticated user can create a wish when mode = WEDDING.
 */
const handler = withModeGuard("GUEST_INTERACTION")(async (request, context) => {
  try {
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

    if (photoUrl !== undefined && typeof photoUrl !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "photoUrl must be a string", 400)
    }

    const wish = await createWish({
      name: name.trim(),
      message: message.trim(),
      photoUrl: photoUrl?.trim(),
    })

    return successResponse({ wish }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
