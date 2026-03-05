import type { Role, MediaType, Visibility } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { visibilityWhereClause } from "@/src/services/visibility.service"

// ── Types ───────────────────────────────────────────────────────────

export interface UploadMediaInput {
  url: string
  mediaType: MediaType
  visibility: Visibility
  uploadedBy: string
  blurDataUrl?: string
  width?: number
  height?: number
}

// ── Select fragment ─────────────────────────────────────────────────

const mediaSelect = {
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

// ── Allowed MIME types ──────────────────────────────────────────────

const ALLOWED_MIME_TYPES: Record<string, MediaType> = {
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/gif": "IMAGE",
  "image/webp": "IMAGE",
  "image/avif": "IMAGE",
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "audio/mpeg": "AUDIO",
  "audio/wav": "AUDIO",
  "audio/ogg": "AUDIO",
}

/** Max file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024

// ── Service functions ───────────────────────────────────────────────

/**
 * Validate an uploaded file's MIME type and size.
 * Returns the resolved MediaType enum value.
 */
export function validateFile(mimeType: string, size: number): MediaType {
  const mediaType = ALLOWED_MIME_TYPES[mimeType]
  if (!mediaType) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `Unsupported file type: ${mimeType}. Allowed: ${Object.keys(ALLOWED_MIME_TYPES).join(", ")}`,
      400,
    )
  }

  if (size > MAX_FILE_SIZE) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
      400,
    )
  }

  return mediaType
}

/**
 * Store media metadata in the database.
 * Actual file storage is handled by the route/upload layer.
 */
export async function uploadMedia(input: UploadMediaInput) {
  return prisma.media.create({
    data: {
      url: input.url,
      mediaType: input.mediaType,
      visibility: input.visibility,
      blurDataUrl: input.blurDataUrl,
      width: input.width,
      height: input.height,
      uploadedBy: input.uploadedBy,
    },
    select: mediaSelect,
  })
}

/**
 * Get a single media item by ID.
 * Does NOT apply visibility check — caller is responsible.
 */
export async function getMediaById(id: string) {
  const media = await prisma.media.findUnique({
    where: { id },
    select: mediaSelect,
  })

  if (!media) {
    throw new AppError(ErrorCode.NOT_FOUND, "Media not found", 404)
  }

  return media
}

/**
 * List all media visible to the given role.
 * Sorted by createdAt descending (newest first).
 */
export async function listMedia(role: Role) {
  return prisma.media.findMany({
    where: visibilityWhereClause(role),
    select: mediaSelect,
    orderBy: { createdAt: "desc" },
  })
}

/**
 * List media uploaded by a specific user, visible to the given role.
 */
export async function getMediaByUploader(role: Role, uploadedBy: string) {
  return prisma.media.findMany({
    where: {
      uploadedBy,
      ...visibilityWhereClause(role),
    },
    select: mediaSelect,
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Delete a media item by ID.
 * Throws NOT_FOUND if the media does not exist.
 * Note: actual file deletion from storage should be handled separately.
 */
export async function deleteMedia(id: string) {
  await getMediaById(id) // ensure it exists

  await prisma.media.delete({
    where: { id },
  })
}
