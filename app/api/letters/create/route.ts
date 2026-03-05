import { NextRequest } from "next/server"
import type { LetterType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createLetter } from "@/src/services/letter.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"
import { createLetterSchema, validateBody } from "@/src/lib/validations"

/**
 * POST /api/letters/create
 *
 * Create a new letter.
 *
 * Flow: Auth → Mode guard (CREATE_LETTER) → validate → service
 *
 * Only COUPLE or ADMIN can create letters.
 * ARCHIVE mode blocks creation.
 *
 * Request body:
 * {
 *   "title": "string",
 *   "content": "string",
 *   "letterType": "REGULAR | TIME_LOCKED | PASSWORD_LOCKED | FUTURE_MESSAGE",
 *   "visibility": "PUBLIC | APPROVED_GUEST | COUPLE | PASSWORD_LOCKED",
 *   "unlockAt": "ISO 8601 string?",
 *   "password": "string?",
 *   "moodTags": "string[]?",
 *   "musicUrl": "string?",
 *   "isReadTracking": "boolean?"
 * }
 */
const handler = withModeGuard("CREATE_LETTER")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can create letters", 403),
      )
    }

    const body = await request.json().catch(() => null)
    const {
      title, content, letterType, visibility,
      unlockAt, password, moodTags, musicUrl, isReadTracking,
    } = validateBody(createLetterSchema, body)

    const letter = await createLetter({
      title,
      content,
      letterType: letterType as LetterType,
      visibility: visibility as Visibility,
      unlockAt: unlockAt ? new Date(unlockAt) : undefined,
      password,
      moodTags,
      musicUrl: musicUrl?.trim(),
      isReadTracking: isReadTracking ?? false,
    })

    return successResponse({ letter }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
