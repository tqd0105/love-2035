import { NextRequest } from "next/server"
import type { TimelineType, Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createTimelineEvent } from "@/src/services/timeline.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

/**
 * POST /api/timeline/create
 *
 * Create a new timeline event.
 *
 * Flow:
 *   Auth Middleware (via withModeGuard)
 *   → Mode Middleware (loads mode, checks CREATE_TIMELINE action)
 *   → Route Handler (validates input, calls service)
 *
 * Mode rules:
 *   RELATIONSHIP → allowed
 *   WEDDING      → blocked (restricted editing)
 *   ARCHIVE      → blocked (read-only)
 *
 * Request body:
 * {
 *   "title": "string",
 *   "description": "string?",
 *   "timelineType": "MEMORY | MILESTONE | ANNIVERSARY | WEDDING",
 *   "date": "ISO 8601 string",
 *   "visibility": "PUBLIC | APPROVED_GUEST | COUPLE | PASSWORD_LOCKED",
 *   "isHighlighted": "boolean?",
 *   "eventId": "string?"
 * }
 *
 * Response: { success: true, data: { timelineEvent: {...} } }
 */
const handler = withModeGuard("CREATE_TIMELINE")(async (request, context) => {
  try {
    const body = await request.json().catch(() => null)

    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { title, description, timelineType, date, visibility, isHighlighted, eventId } = body

    // Validate required fields
    if (!title || typeof title !== "string" || !title.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title is required", 400)
    }

    if (!timelineType || typeof timelineType !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Timeline type is required", 400)
    }

    const validTimelineTypes = ["MEMORY", "MILESTONE", "ANNIVERSARY", "WEDDING"]
    if (!validTimelineTypes.includes(timelineType)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, `Invalid timeline type: ${timelineType}`, 400)
    }

    if (!date || typeof date !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Date is required", 400)
    }

    const parsedDate = new Date(date)
    if (isNaN(parsedDate.getTime())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid date format", 400)
    }

    if (!visibility || typeof visibility !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Visibility is required", 400)
    }

    const validVisibilities = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]
    if (!validVisibilities.includes(visibility)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, `Invalid visibility: ${visibility}`, 400)
    }

    const timelineEvent = await createTimelineEvent({
      title: title.trim(),
      description: description?.trim(),
      timelineType: timelineType as TimelineType,
      date: parsedDate,
      visibility: visibility as Visibility,
      isHighlighted: isHighlighted ?? false,
      eventId,
    })

    return successResponse({ timelineEvent }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export async function POST(request: NextRequest) {
  return handler(request)
}
