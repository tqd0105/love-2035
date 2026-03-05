import { NextRequest } from "next/server"
import { errorResponse } from "@/src/lib/response"
import { ErrorCode } from "@/src/lib/errors"

/** Default max payload: 5 MB */
const DEFAULT_MAX_BYTES = 5 * 1024 * 1024

/**
 * Check Content-Length header against a max size.
 * Returns a 413 response if exceeded, null if allowed.
 */
export function checkPayloadSize(
  request: NextRequest,
  maxBytes = DEFAULT_MAX_BYTES,
) {
  const contentLength = request.headers.get("content-length")
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return errorResponse(
      ErrorCode.PAYLOAD_TOO_LARGE,
      `Payload too large. Maximum size is ${Math.round(maxBytes / (1024 * 1024))} MB`,
      413,
    )
  }
  return null
}
