import { NextRequest } from "next/server"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { deleteWish } from "@/src/services/wedding.service"
import { getSystemMode } from "@/src/services/mode.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * Extract wish ID from pathname: /api/wedding/wishes/[id]
 */
function extractId(request: NextRequest): string {
  const segments = request.nextUrl.pathname.split("/")
  return segments[segments.length - 1]!
}

/**
 * DELETE /api/wedding/wishes/[id]
 *
 * Delete a wedding wish. Only ADMIN or COUPLE can delete.
 * Only available in WEDDING mode.
 */
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN" && session.role !== "COUPLE") {
        return errorResponse(ErrorCode.FORBIDDEN, "Only ADMIN or COUPLE can delete wishes", 403)
      }

      const mode = await getSystemMode()
      if (mode !== "WEDDING") {
        return errorResponse(
          ErrorCode.FORBIDDEN,
          "Wedding wishes are only available in WEDDING mode",
          403,
        )
      }

      const id = extractId(req)
      await deleteWish(id)

      return successResponse({ message: "Wish deleted" })
    } catch (err) {
      return handleError(err)
    }
  })
}
