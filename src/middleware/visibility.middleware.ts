import { NextRequest, NextResponse } from "next/server"
import type { Visibility } from "@/generated/prisma/client"
import type { SessionPayload } from "@/src/lib/auth"
import { errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { assertAccess, assertPasswordUnlock } from "@/src/services/visibility.service"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * Context passed to route handlers after visibility check.
 */
export interface VisibilityContext {
  session: SessionPayload
  unlocked: boolean
}

/**
 * Middleware that enforces visibility rules on a single content item.
 *
 * Flow (from core-architecture.md):
 *   Auth Middleware → Visibility Middleware → Route Handler
 *
 * - Checks role vs visibility using the access matrix
 * - For PASSWORD_LOCKED: if role is COUPLE, attempts password unlock
 *   from request body or query param
 * - ADMIN always passes (override)
 *
 * @param getVisibility - Function to resolve the content's visibility + passwordHash
 *                        from the request (e.g. fetch from DB by id).
 */
export function withVisibility(
  getVisibility: (
    request: NextRequest,
    session: SessionPayload,
  ) => Promise<{ visibility: Visibility; passwordHash?: string | null }>,
) {
  return (
    handler: (
      request: NextRequest,
      context: VisibilityContext,
    ) => Promise<NextResponse>,
  ) => {
    return async (request: NextRequest): Promise<NextResponse> => {
      return withAuth(request, async (req, session) => {
        try {
          const { visibility, passwordHash } = await getVisibility(req, session)

          // ADMIN overrides everything
          if (session.role === "ADMIN") {
            return handler(req, { session, unlocked: true })
          }

          // PASSWORD_LOCKED special handling
          if (visibility === "PASSWORD_LOCKED") {
            // COUPLE can unlock with password
            if (session.role === "COUPLE") {
              const password = await extractPassword(req)
              await assertPasswordUnlock(password, passwordHash)
              return handler(req, { session, unlocked: true })
            }

            // Other roles cannot access PASSWORD_LOCKED
            return errorResponse(ErrorCode.LOCKED, "This content requires a password to unlock", 423)
          }

          // Standard role vs visibility check
          assertAccess(session.role, visibility)
          return handler(req, { session, unlocked: false })
        } catch (err) {
          return handleError(err)
        }
      })
    }
  }
}

/**
 * Middleware that enforces visibility for list endpoints.
 *
 * Does NOT block the request — instead passes the session to the handler,
 * which should use `visibilityWhereClause(role)` or `filterByVisibility()`
 * from the visibility service to filter results.
 *
 * Use this for GET list routes (e.g. GET /api/timeline).
 */
export function withVisibilityFilter(
  handler: (
    request: NextRequest,
    session: SessionPayload,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return withAuth(request, handler)
  }
}

/**
 * Extract unlock password from request body or query param.
 */
async function extractPassword(request: NextRequest): Promise<string | undefined> {
  // Try query param first (for GET requests)
  const fromQuery = request.nextUrl.searchParams.get("password")
  if (fromQuery) return fromQuery

  // Try request body (for POST/PUT requests)
  try {
    const cloned = request.clone()
    const body = await cloned.json()
    return body?.password
  } catch {
    return undefined
  }
}
