import { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { exportData } from "@/src/services/admin.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * GET /api/admin/export
 *
 * Export all data as JSON. ADMIN only.
 * Returns timeline events, letters, and media metadata.
 *
 * Response includes Content-Disposition header for file download.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const data = await exportData()

      return new NextResponse(JSON.stringify(data, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="love-2035-export-${data.exportedAt.slice(0, 10)}.json"`,
        },
      })
    } catch (err) {
      return handleError(err)
    }
  })
}
