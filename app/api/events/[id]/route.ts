import { NextRequest } from "next/server"
import type { EventType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { getEventById, updateEvent, deleteEvent } from "@/src/services/event.service"
import { assertAccess } from "@/src/services/visibility.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"
import { withAuth } from "@/src/middleware/auth.middleware"

const VALID_EVENT_TYPES: EventType[] = ["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"]
const VALID_VISIBILITIES: Visibility[] = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]

/**
 * Extract event ID from pathname: /api/events/[id]
 */
function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/")
  return segments[segments.length - 1]!
}

/**
 * GET /api/events/[id]
 *
 * Get a single event by ID with visibility check.
 *
 * Flow: Auth → fetch event → visibility check → respond
 */
const getHandler = async (request: NextRequest) => {
  return withAuth(request, async (_req, session) => {
    try {
      const id = extractId(request)
      const event = await getEventById(id)

      assertAccess(session.role, event.visibility)

      return successResponse({ event })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * PUT /api/events/[id]
 *
 * Update an event.
 *
 * Flow: Auth → Mode guard (EDIT_EVENT) → validate → service
 *
 * Only COUPLE or ADMIN can update events.
 */
const putHandler = withModeGuard("EDIT_EVENT")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can update events", 403),
      )
    }

    const id = extractId(request)
    const body = await request.json().catch(() => null)

    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { title, description, eventType, date, isRecurring, recurrence, visibility } = body

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title must be a non-empty string", 400)
    }

    if (eventType !== undefined && !VALID_EVENT_TYPES.includes(eventType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `eventType must be one of: ${VALID_EVENT_TYPES.join(", ")}`,
        400,
      )
    }

    if (date !== undefined && isNaN(Date.parse(date))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid date format", 400)
    }

    if (visibility !== undefined && !VALID_VISIBILITIES.includes(visibility)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `visibility must be one of: ${VALID_VISIBILITIES.join(", ")}`,
        400,
      )
    }

    const event = await updateEvent(id, {
      title: title?.trim(),
      description: description?.trim(),
      eventType: eventType as EventType | undefined,
      date: date ? new Date(date) : undefined,
      isRecurring,
      recurrence: recurrence?.trim(),
      visibility: visibility as Visibility | undefined,
    })

    return successResponse({ event })
  } catch (err) {
    return handleError(err)
  }
})

/**
 * DELETE /api/events/[id]
 *
 * Delete an event.
 *
 * Only COUPLE or ADMIN can delete events.
 * ARCHIVE mode blocks deletion.
 */
const deleteHandler = withModeGuard("EDIT_EVENT")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can delete events", 403),
      )
    }

    const id = extractId(request)
    await deleteEvent(id)

    return successResponse({ message: "Event deleted successfully" })
  } catch (err) {
    return handleError(err)
  }
})

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE }
