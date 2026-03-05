import { NextRequest } from "next/server"
import type { EventType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createEvent } from "@/src/services/event.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"
import { createEventSchema, validateBody } from "@/src/lib/validations"

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
    const { title, description, eventType, date, isRecurring, recurrence, visibility } =
      validateBody(createEventSchema, body)

    const event = await createEvent({
      title,
      description,
      eventType: eventType as EventType,
      date: new Date(date),
      isRecurring: isRecurring ?? false,
      recurrence,
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
