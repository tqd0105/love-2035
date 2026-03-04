import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie, verifySessionToken, type SessionPayload } from "@/src/lib/auth"
import { errorResponse } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import type { Role } from "@/generated/prisma/client"

/**
 * Verify the session cookie and attach user info to request headers.
 * Returns an error response if not authenticated.
 */
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, session: SessionPayload) => Promise<NextResponse>,
): Promise<NextResponse> {
  const token = await getSessionCookie()
  if (!token) {
    return errorResponse(ErrorCode.UNAUTHORIZED, "Authentication required", 401)
  }

  const session = await verifySessionToken(token)
  if (!session) {
    return errorResponse(ErrorCode.UNAUTHORIZED, "Invalid or expired session", 401)
  }

  return handler(request, session)
}

/**
 * Require specific roles to access a route.
 * Must be used after withAuth.
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (
    request: NextRequest,
    handler: (request: NextRequest, session: SessionPayload) => Promise<NextResponse>,
  ): Promise<NextResponse> => {
    return withAuth(request, async (req, session) => {
      if (!allowedRoles.includes(session.role)) {
        return errorResponse(ErrorCode.FORBIDDEN, "Insufficient permissions", 403)
      }
      return handler(req, session)
    })
  }
}
