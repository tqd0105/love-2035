import { NextRequest } from "next/server"
import type { LetterType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import {
  getLetterById,
  getLetterLockInfo,
  updateLetter,
  deleteLetter,
  assertNotTimeLocked,
  verifyLetterPassword,
  trackLetterRead,
} from "@/src/services/letter.service"
import { assertAccess } from "@/src/services/visibility.service"
import { withAuth } from "@/src/middleware/auth.middleware"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_LETTER_TYPES: LetterType[] = ["REGULAR", "TIME_LOCKED", "PASSWORD_LOCKED", "FUTURE_MESSAGE"]
const VALID_VISIBILITIES: Visibility[] = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]

/**
 * Extract letter ID from pathname: /api/letters/[id]
 */
function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/")
  return segments[segments.length - 1]!
}

/**
 * GET /api/letters/[id]
 *
 * Get a single letter with full lock checks:
 *   1. Auth
 *   2. Visibility check
 *   3. Time-lock check (if unlockAt is in the future → 423)
 *   4. Password check (if PASSWORD_LOCKED letterType → requires ?password= or body)
 *   5. Read tracking
 *
 * Query params:
 *   ?password=xxx — for password-locked letters
 */
const getHandler = async (request: NextRequest) => {
  return withAuth(request, async (_req, session) => {
    try {
      const id = extractId(request)

      // 1. Get lock info for access checks
      const lockInfo = await getLetterLockInfo(id)

      // 2. Visibility check
      assertAccess(session.role, lockInfo.visibility)

      // 3. Time-lock check (ADMIN bypasses)
      if (session.role !== "ADMIN") {
        assertNotTimeLocked(lockInfo.unlockAt)
      }

      // 4. Password check for PASSWORD_LOCKED letterType (ADMIN bypasses)
      if (lockInfo.letterType === "PASSWORD_LOCKED" && lockInfo.passwordHash && session.role !== "ADMIN") {
        const password = request.nextUrl.searchParams.get("password")
        if (!password) {
          throw new AppError(ErrorCode.LOCKED, "This letter requires a password to read", 423)
        }
        const valid = await verifyLetterPassword(password, lockInfo.passwordHash)
        if (!valid) {
          throw new AppError(ErrorCode.LOCKED, "Incorrect password", 423)
        }
      }

      // 5. Get full letter
      const letter = await getLetterById(id)

      // 6. Track read
      await trackLetterRead(id, session.userId)

      return successResponse({ letter })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * PUT /api/letters/[id]
 *
 * Update a letter.
 *
 * Only COUPLE or ADMIN can update.
 * ARCHIVE mode blocks editing.
 */
const putHandler = withModeGuard("EDIT_LETTER")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can update letters", 403),
      )
    }

    const id = extractId(request)
    const body = await request.json().catch(() => null)

    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const {
      title, content, letterType, visibility,
      unlockAt, password, moodTags, musicUrl, isReadTracking,
    } = body

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title must be a non-empty string", 400)
    }

    if (content !== undefined && (typeof content !== "string" || !content.trim())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Content must be a non-empty string", 400)
    }

    if (letterType !== undefined && !VALID_LETTER_TYPES.includes(letterType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `letterType must be one of: ${VALID_LETTER_TYPES.join(", ")}`,
        400,
      )
    }

    if (visibility !== undefined && !VALID_VISIBILITIES.includes(visibility)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `visibility must be one of: ${VALID_VISIBILITIES.join(", ")}`,
        400,
      )
    }

    if (unlockAt !== undefined && unlockAt !== null && isNaN(Date.parse(unlockAt))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid unlockAt date format", 400)
    }

    if (moodTags !== undefined && !Array.isArray(moodTags)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "moodTags must be an array", 400)
    }

    const letter = await updateLetter(id, {
      title: title?.trim(),
      content: content?.trim(),
      letterType: letterType as LetterType | undefined,
      visibility: visibility as Visibility | undefined,
      unlockAt: unlockAt ? new Date(unlockAt) : unlockAt === null ? undefined : undefined,
      password,
      moodTags,
      musicUrl: musicUrl?.trim(),
      isReadTracking,
    })

    return successResponse({ letter })
  } catch (err) {
    return handleError(err)
  }
})

/**
 * DELETE /api/letters/[id]
 *
 * Delete a letter.
 *
 * Only COUPLE or ADMIN can delete.
 * ARCHIVE mode blocks deletion.
 */
const deleteHandler = withModeGuard("EDIT_LETTER")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can delete letters", 403),
      )
    }

    const id = extractId(request)
    await deleteLetter(id)

    return successResponse({ message: "Letter deleted successfully" })
  } catch (err) {
    return handleError(err)
  }
})

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE }
