import { NextRequest } from "next/server"
import { randomUUID } from "crypto"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import type { Visibility } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { validateFile, uploadMedia } from "@/src/services/media.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_VISIBILITIES: Visibility[] = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"]
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

/**
 * POST /api/media/upload
 *
 * Upload a media file.
 *
 * Flow: Auth → Mode guard (CREATE_MEDIA) → validate → store file → save metadata
 *
 * Accepts multipart/form-data with:
 *   - file: the uploaded file
 *   - visibility: PUBLIC | APPROVED_GUEST | COUPLE | PASSWORD_LOCKED
 *
 * Storage v1: local filesystem (public/uploads/).
 * Future: replace with S3/cloud storage.
 */
const handler = withModeGuard("CREATE_MEDIA")(async (request, context) => {
  try {
    // Only COUPLE or ADMIN can upload
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can upload media", 403),
      )
    }

    const formData = await request.formData().catch(() => null)
    if (!formData) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Multipart form data is required", 400)
    }

    const file = formData.get("file")
    if (!file || !(file instanceof File)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "File is required", 400)
    }

    const visibility = (formData.get("visibility") as string) ?? "COUPLE"
    if (!VALID_VISIBILITIES.includes(visibility as Visibility)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `visibility must be one of: ${VALID_VISIBILITIES.join(", ")}`,
        400,
      )
    }

    // Validate file type and size
    const mediaType = validateFile(file.type, file.size)

    // Generate unique filename (never use original name)
    const ext = file.name.split(".").pop() ?? "bin"
    const uniqueName = `${randomUUID()}.${ext}`

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true })

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer())
    const filePath = path.join(UPLOAD_DIR, uniqueName)
    await writeFile(filePath, buffer)

    // Save metadata to database
    const media = await uploadMedia({
      url: `/uploads/${uniqueName}`,
      mediaType,
      visibility: visibility as Visibility,
      uploadedBy: context.session.userId,
    })

    return successResponse({ media }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
