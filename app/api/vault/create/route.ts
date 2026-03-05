import { NextRequest } from "next/server"
import type { VaultContentType } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createVaultItem } from "@/src/services/vault.service"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_VAULT_TYPES: VaultContentType[] = [
  "SECRET_LETTER", "PRIVATE_MEMORY", "TIME_CAPSULE", "PRIVATE_MEDIA",
]

/**
 * POST /api/vault/create
 *
 * Create a new vault item.
 *
 * Flow: Auth → Mode guard (CREATE_VAULT_ITEM) → role check → validate → service
 *
 * Only COUPLE or ADMIN can create vault items.
 * ARCHIVE mode blocks creation.
 * WEDDING mode blocks creation.
 */
const handler = withModeGuard("CREATE_VAULT_ITEM")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can create vault items", 403),
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { title, contentEncrypted, vaultType, unlockAt, requiresPassword, password } = body

    if (!title || typeof title !== "string" || !title.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title is required", 400)
    }

    if (!contentEncrypted || typeof contentEncrypted !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "contentEncrypted is required", 400)
    }

    if (!vaultType || !VALID_VAULT_TYPES.includes(vaultType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `vaultType must be one of: ${VALID_VAULT_TYPES.join(", ")}`,
        400,
      )
    }

    if (unlockAt && isNaN(Date.parse(unlockAt))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid unlockAt date format", 400)
    }

    const item = await createVaultItem({
      title: title.trim(),
      contentEncrypted,
      vaultType: vaultType as VaultContentType,
      unlockAt: unlockAt ? new Date(unlockAt) : undefined,
      requiresPassword: requiresPassword ?? false,
      password,
    })

    return successResponse({ item }, 201)
  } catch (err) {
    return handleError(err)
  }
})

export function POST(request: NextRequest) {
  return handler(request)
}
