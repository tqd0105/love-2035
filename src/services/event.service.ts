import type { Role, EventType, Visibility } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { visibilityWhereClause } from "@/src/services/visibility.service"

// ── Input types ─────────────────────────────────────────────────────

export interface CreateEventInput {
  title: string
  description?: string
  eventType: EventType
  date: Date
  isRecurring?: boolean
  recurrence?: string
  visibility: Visibility
}

export interface UpdateEventInput {
  title?: string
  description?: string
  eventType?: EventType
  date?: Date
  isRecurring?: boolean
  recurrence?: string
  visibility?: Visibility
}

// ── Select fragment ─────────────────────────────────────────────────

const eventSelect = {
  id: true,
  title: true,
  description: true,
  eventType: true,
  date: true,
  isRecurring: true,
  recurrence: true,
  visibility: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── Service functions ───────────────────────────────────────────────

/**
 * Create a new event.
 * Mode guard is enforced by middleware — this function only handles DB logic.
 */
export async function createEvent(input: CreateEventInput) {
  return prisma.event.create({
    data: {
      title: input.title,
      description: input.description,
      eventType: input.eventType,
      date: input.date,
      isRecurring: input.isRecurring ?? false,
      recurrence: input.recurrence,
      visibility: input.visibility,
    },
    select: eventSelect,
  })
}

/**
 * Update an existing event by ID.
 * Throws NOT_FOUND if the event does not exist.
 */
export async function updateEvent(id: string, input: UpdateEventInput) {
  await getEventById(id) // ensure it exists

  return prisma.event.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.eventType !== undefined && { eventType: input.eventType }),
      ...(input.date !== undefined && { date: input.date }),
      ...(input.isRecurring !== undefined && { isRecurring: input.isRecurring }),
      ...(input.recurrence !== undefined && { recurrence: input.recurrence }),
      ...(input.visibility !== undefined && { visibility: input.visibility }),
    },
    select: eventSelect,
  })
}

/**
 * Get a single event by ID.
 * Does NOT apply visibility check — caller (middleware) is responsible.
 */
export async function getEventById(id: string) {
  const event = await prisma.event.findUnique({
    where: { id },
    select: eventSelect,
  })

  if (!event) {
    throw new AppError(ErrorCode.NOT_FOUND, "Event not found", 404)
  }

  return event
}

/**
 * List all events visible to the given role.
 * Applies visibility filtering at database level.
 * Returns events sorted by date ascending (upcoming first).
 */
export async function listEvents(
  role: Role,
  pagination?: { page: number; limit: number },
) {
  const page = pagination?.page ?? 1
  const limit = pagination?.limit ?? 50

  const where = visibilityWhereClause(role)

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      select: eventSelect,
      orderBy: { date: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.event.count({ where }),
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
 * Delete an event by ID.
 * Throws NOT_FOUND if the event does not exist.
 */
export async function deleteEvent(id: string) {
  await getEventById(id) // ensure it exists

  await prisma.event.delete({
    where: { id },
  })
}
