import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { listVaultItems } from "@/src/services/vault.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/vault/list
 *
 * List all vault items (summary only, no content).
 *
 * Only COUPLE or ADMIN can access vault.
 *
 * Flow: Auth → role check → service → respond
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "COUPLE" && session.role !== "ADMIN") {
        return handleError(
          new AppError(ErrorCode.FORBIDDEN, "Vault is accessible only to COUPLE or ADMIN", 403),
        )
      }

      const items = await listVaultItems()
      return successResponse({ items })
    } catch (err) {
      return handleError(err)
    }
  })
}
