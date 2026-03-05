import type { Role, Visibility, TimelineType } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { visibilityWhereClause } from "@/src/services/visibility.service"

// ── Types ───────────────────────────────────────────────────────────

/**
 * Input for creating a new timeline event.
 */
export interface CreateTimelineInput {
  title: string
  description?: string
  timelineType: TimelineType
  date: Date
  visibility: Visibility
  isHighlighted?: boolean
  eventId?: string
}

/**
 * Pagination options for timeline queries.
 */
export interface TimelinePaginationOptions {
  page?: number
  limit?: number
}

// ── Select fragment ─────────────────────────────────────────────────

const timelineSelect = {
  id: true,
  title: true,
  description: true,
  timelineType: true,
  date: true,
  visibility: true,
  isHighlighted: true,
  createdAt: true,
  updatedAt: true,
  eventId: true,
} as const

// ── Service functions ───────────────────────────────────────────────

/**
 * Get a single timeline event by ID.
 * Does NOT apply visibility check — caller (middleware) is responsible.
 */
export async function getTimelineEventById(id: string) {
  const event = await prisma.timelineEvent.findUnique({
    where: { id },
    select: timelineSelect,
  })

  if (!event) {
    throw new AppError(ErrorCode.NOT_FOUND, "Timeline event not found", 404)
  }

  return event
}

/**
 * Get all timeline events visible to the given role.
 * Sorted by date ascending (chronological).
 * Supports pagination.
 */
export async function getTimelineEvents(
  role: Role,
  options: TimelinePaginationOptions = {},
) {
  const { page = 1, limit = 50 } = options
  const skip = (page - 1) * limit

  const [events, total] = await Promise.all([
    prisma.timelineEvent.findMany({
      where: visibilityWhereClause(role),
      select: timelineSelect,
      orderBy: { date: "asc" },
      skip,
      take: limit,
    }),
    prisma.timelineEvent.count({
      where: visibilityWhereClause(role),
    }),
  ])

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get timeline events for a specific year, visible to the given role.
 * Sorted by date ascending.
 */
export async function getTimelineEventsByYear(
  role: Role,
  year: number,
  options: TimelinePaginationOptions = {},
) {
  const { page = 1, limit = 50 } = options
  const skip = (page - 1) * limit

  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`)
  const startOfNextYear = new Date(`${year + 1}-01-01T00:00:00.000Z`)

  const where = {
    ...visibilityWhereClause(role),
    date: {
      gte: startOfYear,
      lt: startOfNextYear,
    },
  }

  const [events, total] = await Promise.all([
    prisma.timelineEvent.findMany({
      where,
      select: timelineSelect,
      orderBy: { date: "asc" },
      skip,
      take: limit,
    }),
    prisma.timelineEvent.count({ where }),
  ])

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get the most recent timeline events visible to the given role.
 * Sorted by date descending (newest first).
 */
export async function getRecentEvents(role: Role, limit: number = 5) {
  return prisma.timelineEvent.findMany({
    where: visibilityWhereClause(role),
    select: timelineSelect,
    orderBy: { date: "desc" },
    take: limit,
  })
}

/**
 * Create a new timeline event.
 * Mode guard is enforced by middleware — this function only handles DB logic.
 */
export async function createTimelineEvent(input: CreateTimelineInput) {
  return prisma.timelineEvent.create({
    data: {
      title: input.title,
      description: input.description,
      timelineType: input.timelineType,
      date: input.date,
      visibility: input.visibility,
      isHighlighted: input.isHighlighted ?? false,
      eventId: input.eventId,
    },
    select: timelineSelect,
  })
}
