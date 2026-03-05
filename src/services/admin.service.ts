import type { Mode } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { getSystemMode, setSystemMode } from "@/src/services/mode.service"
import { deleteWish } from "@/src/services/wedding.service"
import { deleteEvent } from "@/src/services/event.service"
import { deleteMedia } from "@/src/services/media.service"

// ── Re-export mode operations ───────────────────────────────────────

export { getSystemMode, setSystemMode }

/**
 * Get full system config including mode and feature flags.
 * ADMIN only (enforced by route).
 */
export async function getSystemConfig() {
  const config = await prisma.systemConfig.findFirst({
    select: {
      mode: true,
      weddingEnabled: true,
      archiveEnabled: true,
      updatedAt: true,
    },
  })

  if (!config) {
    throw new AppError(
      ErrorCode.INTERNAL_ERROR,
      "SystemConfig not found — run database seed first",
      500,
    )
  }

  return config
}

// ── Select fragments ────────────────────────────────────────────────

const wishSelect = {
  id: true,
  name: true,
  message: true,
  photoUrl: true,
  createdAt: true,
} as const

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

const mediaSelect = {
  id: true,
  url: true,
  mediaType: true,
  visibility: true,
  uploadedBy: true,
  createdAt: true,
} as const

// ── Wishes (admin: no mode guard) ──────────────────────────────────

/**
 * List all wedding wishes. Admin sees all regardless of mode.
 */
export async function listWishes() {
  return prisma.weddingWish.findMany({
    select: wishSelect,
    orderBy: { createdAt: "desc" },
  })
}

export { deleteWish }

// ── Events (admin: no visibility filter) ────────────────────────────

/**
 * List all events without visibility filtering. Admin sees everything.
 */
export async function listEvents() {
  return prisma.event.findMany({
    select: eventSelect,
    orderBy: { date: "asc" },
  })
}

export { deleteEvent }

// ── Media (admin: no visibility filter) ─────────────────────────────

/**
 * List all media without visibility filtering. Admin sees everything.
 */
export async function listMedia() {
  return prisma.media.findMany({
    select: mediaSelect,
    orderBy: { createdAt: "desc" },
  })
}

export { deleteMedia }

// ── Export (admin: full unfiltered data) ─────────────────────────────

/** Timeline fields for export. */
const timelineExportSelect = {
  id: true,
  title: true,
  description: true,
  timelineType: true,
  date: true,
  visibility: true,
  isHighlighted: true,
  eventId: true,
  createdAt: true,
  updatedAt: true,
} as const

/** Letter fields for export — no passwordHash. */
const letterExportSelect = {
  id: true,
  title: true,
  content: true,
  letterType: true,
  visibility: true,
  unlockAt: true,
  moodTags: true,
  musicUrl: true,
  isReadTracking: true,
  createdAt: true,
  updatedAt: true,
} as const

/** Media fields for export. */
const mediaExportSelect = {
  id: true,
  url: true,
  mediaType: true,
  visibility: true,
  blurDataUrl: true,
  width: true,
  height: true,
  uploadedBy: true,
  createdAt: true,
} as const

/**
 * Export all data as JSON. ADMIN only (enforced by route).
 * Returns timeline events, letters, and media metadata.
 */
export async function exportData() {
  const [timelineEvents, letters, media] = await Promise.all([
    prisma.timelineEvent.findMany({
      select: timelineExportSelect,
      orderBy: { date: "asc" },
    }),
    prisma.letter.findMany({
      select: letterExportSelect,
      orderBy: { createdAt: "asc" },
    }),
    prisma.media.findMany({
      select: mediaExportSelect,
      orderBy: { createdAt: "asc" },
    }),
  ])

  return {
    exportedAt: new Date().toISOString(),
    timelineEvents,
    letters,
    media,
  }
}
