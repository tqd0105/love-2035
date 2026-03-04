import { NextResponse } from "next/server"
import { AppError, ErrorCode } from "@/src/lib/errors"

/**
 * Standard API success response.
 *
 * Shape: { success: true, data: T }
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

/**
 * Standard API error response.
 *
 * Shape: { success: false, error: { code, message } }
 */
export function errorResponse(code: ErrorCode, message: string, status: number) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message },
    },
    { status },
  )
}

/**
 * Handle unknown errors consistently.
 * If AppError → use its code/message.
 * Otherwise → return INTERNAL_ERROR without exposing details.
 */
export function handleError(err: unknown) {
  if (err instanceof AppError) {
    return errorResponse(err.code, err.message, err.statusCode)
  }

  console.error("Unhandled error:", err)
  return errorResponse(ErrorCode.INTERNAL_ERROR, "Internal server error", 500)
}
