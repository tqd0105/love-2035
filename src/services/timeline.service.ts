import type { Role } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { visibilityWhereClause } from "@/src/services/visibility.service"

/**
 * Get a single timeline event by ID.
 * Does NOT apply visibility check — caller (middleware) is responsible.
 */
export async function getTimelineEventById(id: string) {
  const event = await prisma.timelineEvent.findUnique({
    where: { id },
    select: {
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
    },
  })

  if (!event) {
    throw new AppError(ErrorCode.NOT_FOUND, "Timeline event not found", 404)
  }

  return event
}

/**
 * Get all timeline events visible to the given role.
 * Applies visibility filtering at database level using Prisma where clause.
 * Returns events sorted by date descending.
 */
export async function getTimelineEvents(role: Role) {
  return prisma.timelineEvent.findMany({
    where: {
      ...visibilityWhereClause(role),
    },
    select: {
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
    },
    orderBy: { date: "desc" },
  })
}
