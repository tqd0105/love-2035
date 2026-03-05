import { NextRequest } from "next/server"
import type { EventType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createEvent } from "@/src/services/event.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_EVENT_TYPES: EventType[] = ["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"]
const VALID_VISIBILITIES: Visibility[] = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]

/**
 * POST /api/events/create
 *
 * Create a new event.
 *
 * Flow:
 *   Auth → Mode guard (CREATE_EVENT) → validate → service
 *
 * Mode rules:
 *   RELATIONSHIP → allowed
 *   WEDDING      → blocked
 *   ARCHIVE      → blocked (read-only)
 *
 * Role: Only COUPLE or ADMIN (enforced via mode + auth).
 */
const handler = withModeGuard("CREATE_EVENT")(async (request, context) => {
  try {
    // Only COUPLE or ADMIN can create events
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can create events", 403),
      )
    }

    const body = await request.json().catch(() => null)

    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { title, description, eventType, date, isRecurring, recurrence, visibility } = body

    if (!title || typeof title !== "string" || !title.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title is required", 400)
    }

    if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `eventType must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
        400,
      )
    }

    if (!date || isNaN(Date.parse(date))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "A valid date is required", 400)
    }

    if (!visibility || !VALID_VISIBILITIES.includes(visibility)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `visibility must be one of: ${VALID_VISIBILITIES.join(", ")}`,
        400,
      )
    }

    const event = await createEvent({
      title: title.trim(),
      description: description?.trim(),
      eventType: eventType as EventType,
      date: new Date(date),
      isRecurring: isRecurring ?? false,
      recurrence: recurrence?.trim(),
      visibility: visibility as Visibility,
    })

    return successResponse({ event }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
