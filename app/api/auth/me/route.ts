import { getSessionCookie, verifySessionToken } from "@/src/lib/auth"
import { successResponse, errorResponse } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"

/**
 * GET /api/auth/me
 *
 * Returns the current authenticated user's session info.
 * Response: { success: true, data: { userId, role } }
 * Returns 401 if not authenticated.
 */
export async function GET() {
  const token = await getSessionCookie()
  if (!token) {
    return errorResponse(ErrorCode.UNAUTHORIZED, "Authentication required", 401)
  }

  const session = await verifySessionToken(token)
  if (!session) {
    return errorResponse(ErrorCode.UNAUTHORIZED, "Invalid or expired session", 401)
  }

  return successResponse({ userId: session.userId, role: session.role })
}
