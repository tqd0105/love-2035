import { NextRequest, NextResponse } from "next/server"
import type { Mode } from "@/generated/prisma/client"
import type { SessionPayload } from "@/src/lib/auth"
import { errorResponse, handleError } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"
import { getSystemMode } from "@/src/services/mode.service"
import { isModeActionAllowed, type ModeAction } from "@/src/lib/mode-guard"
import { withAuth } from "@/src/middleware/auth.middleware"

/**
 * Context passed to route handlers after mode resolution.
 */
export interface ModeContext {
  session: SessionPayload
  mode: Mode
}

/**
 * Middleware that loads the current system mode and injects it into context.
 *
 * Flow (from core-architecture.md):
 *   Auth Middleware → Mode Middleware → Route Handler
 *
 * Does NOT block any request — just resolves the mode.
 * Use `withModeGuard` to enforce action restrictions.
 */
export function withMode(
  handler: (request: NextRequest, context: ModeContext) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return withAuth(request, async (req, session) => {
      try {
        const mode = await getSystemMode()
        return handler(req, { session, mode })
      } catch (err) {
        return handleError(err)
      }
    })
  }
}

/**
 * Middleware that loads mode AND enforces that a specific action is allowed.
 *
 * Flow:
 *   Auth Middleware → Mode resolution → Action check → Route Handler
 *
 * Returns 403 FORBIDDEN if action is not allowed in the current mode.
 *
 * @param action - The ModeAction to check against the current mode.
 */
export function withModeGuard(action: ModeAction) {
  return (
    handler: (request: NextRequest, context: ModeContext) => Promise<NextResponse>,
  ) => {
    return withMode(async (req, context) => {
      if (!isModeActionAllowed(context.mode, action)) {
        return errorResponse(
          ErrorCode.FORBIDDEN,
          `Action "${action}" is not allowed in ${context.mode} mode`,
          403,
        )
      }
      return handler(req, context)
    })
  }
}
