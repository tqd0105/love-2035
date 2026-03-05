import { NextRequest } from "next/server"
import type { LetterType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createLetter } from "@/src/services/letter.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_LETTER_TYPES: LetterType[] = ["REGULAR", "TIME_LOCKED", "PASSWORD_LOCKED", "FUTURE_MESSAGE"]
const VALID_VISIBILITIES: Visibility[] = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]

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
    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const {
      title, content, letterType, visibility,
      unlockAt, password, moodTags, musicUrl, isReadTracking,
    } = body

    if (!title || typeof title !== "string" || !title.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title is required", 400)
    }

    if (!content || typeof content !== "string" || !content.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Content is required", 400)
    }

    if (!letterType || !VALID_LETTER_TYPES.includes(letterType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `letterType must be one of: ${VALID_LETTER_TYPES.join(", ")}`,
        400,
      )
    }

    if (!visibility || !VALID_VISIBILITIES.includes(visibility)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `visibility must be one of: ${VALID_VISIBILITIES.join(", ")}`,
        400,
      )
    }

    if (unlockAt && isNaN(Date.parse(unlockAt))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid unlockAt date format", 400)
    }

    if (moodTags && !Array.isArray(moodTags)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "moodTags must be an array", 400)
    }

    const letter = await createLetter({
      title: title.trim(),
      content: content.trim(),
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
