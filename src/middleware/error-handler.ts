import { NextRequest, NextResponse } from "next/server"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { logger } from "@/src/lib/logger"

/**
 * Wrap a route handler with automatic error catching.
 *
 * - AppError → returns its code/message/status
 * - Unknown errors → logs via pino, returns generic SERVER_ERROR 500
 *
 * Usage:
 *   export const GET = withErrorHandler(async (request) => { ... })
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (err) {
      if (err instanceof AppError) {
        return NextResponse.json(
          { success: false, error: { code: err.code, message: err.message } },
          { status: err.statusCode },
        )
      }

      logger.error(
        { err, endpoint: request.nextUrl.pathname, method: request.method },
        "Unexpected error",
      )

      return NextResponse.json(
        { success: false, error: { code: "SERVER_ERROR", message: "Unexpected error" } },
        { status: 500 },
      )
    }
  }
}
