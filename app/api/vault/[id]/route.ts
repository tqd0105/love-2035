import { NextRequest } from "next/server"
import type { VaultContentType } from "@/generated/prisma/client"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import {
  getVaultItemById,
  getVaultLockInfo,
  updateVaultItem,
  deleteVaultItem,
  assertNotTimeLocked,
  verifyVaultPassword,
} from "@/src/services/vault.service"
import { withAuth } from "@/src/middleware/auth.middleware"
import { withModeGuard } from "@/src/middleware/mode.middleware"

const VALID_VAULT_TYPES: VaultContentType[] = [
  "SECRET_LETTER", "PRIVATE_MEMORY", "TIME_CAPSULE", "PRIVATE_MEDIA",
]

/**
 * Extract vault item ID from pathname: /api/vault/[id]
 */
function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/")
  return segments[segments.length - 1]!
}

/**
 * GET /api/vault/[id]
 *
 * Get a single vault item with full lock checks:
 *   1. Auth + COUPLE/ADMIN role check
 *   2. Time-lock check (ADMIN bypasses)
 *   3. Password check if requiresPassword (ADMIN bypasses)
 *
 * Query params:
 *   ?password=xxx — for password-protected items
 */
const getHandler = async (request: NextRequest) => {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "COUPLE" && session.role !== "ADMIN") {
        return handleError(
          new AppError(ErrorCode.FORBIDDEN, "Vault is accessible only to COUPLE or ADMIN", 403),
        )
      }

      const id = extractId(request)
      const lockInfo = await getVaultLockInfo(id)

      // Time-lock check (ADMIN bypasses)
      if (session.role !== "ADMIN") {
        assertNotTimeLocked(lockInfo.unlockAt)
      }

      // Password check (ADMIN bypasses)
      if (lockInfo.requiresPassword && lockInfo.passwordHash && session.role !== "ADMIN") {
        const password = request.nextUrl.searchParams.get("password")
        if (!password) {
          throw new AppError(ErrorCode.LOCKED, "This vault item requires a password", 423)
        }
        const valid = await verifyVaultPassword(password, lockInfo.passwordHash)
        if (!valid) {
          throw new AppError(ErrorCode.LOCKED, "Incorrect password", 423)
        }
      }

      const item = await getVaultItemById(id)
      return successResponse({ item })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * PUT /api/vault/[id]
 *
 * Update a vault item.
 *
 * Only COUPLE or ADMIN. Only in RELATIONSHIP mode.
 */
const putHandler = withModeGuard("CREATE_VAULT_ITEM")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can update vault items", 403),
      )
    }

    const id = extractId(request)
    const body = await request.json().catch(() => null)

    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { title, contentEncrypted, vaultType, unlockAt, requiresPassword, password } = body

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Title must be a non-empty string", 400)
    }

    if (vaultType !== undefined && !VALID_VAULT_TYPES.includes(vaultType)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `vaultType must be one of: ${VALID_VAULT_TYPES.join(", ")}`,
        400,
      )
    }

    if (unlockAt !== undefined && unlockAt !== null && isNaN(Date.parse(unlockAt))) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid unlockAt date format", 400)
    }

    const item = await updateVaultItem(id, {
      title: title?.trim(),
      contentEncrypted,
      vaultType: vaultType as VaultContentType | undefined,
      unlockAt: unlockAt ? new Date(unlockAt) : undefined,
      requiresPassword,
      password,
    })

    return successResponse({ item })
  } catch (err) {
    return handleError(err)
  }
})

/**
 * DELETE /api/vault/[id]
 *
 * Delete a vault item.
 *
 * Only COUPLE or ADMIN. Only in RELATIONSHIP mode.
 */
const deleteHandler = withModeGuard("CREATE_VAULT_ITEM")(async (request, context) => {
  try {
    if (context.session.role !== "COUPLE" && context.session.role !== "ADMIN") {
      return handleError(
        new AppError(ErrorCode.FORBIDDEN, "Only COUPLE or ADMIN can delete vault items", 403),
      )
    }

    const id = extractId(request)
    await deleteVaultItem(id)

    return successResponse({ message: "Vault item deleted successfully" })
  } catch (err) {
    return handleError(err)
  }
})

export { getHandler as GET, putHandler as PUT, deleteHandler as DELETE }
