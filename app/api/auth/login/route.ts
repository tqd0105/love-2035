import { NextRequest } from "next/server"
import { login } from "@/src/services/auth.service"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { rateLimit } from "@/src/lib/rate-limit"
import { checkPayloadSize } from "@/src/lib/payload-guard"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const checkRateLimit = rateLimit("auth-login", 10, 60_000) // 10 req/min per IP

/**
 * POST /api/auth/login
 *
 * Request:  { email: string, password: string }
 * Response: { success: true, data: { user: { id, role } } }
 *
 * Rate-limited to 10 requests per minute per IP.
 * Sets httpOnly session cookie on success.
 */
export async function POST(request: NextRequest) {
  const tooLarge = checkPayloadSize(request)
  if (tooLarge) return tooLarge

  const rateLimited = checkRateLimit(request)
  if (rateLimited) return rateLimited

  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Email and password are required", 400)
    }

    const { email, password } = body

    if (!email.trim() || !password.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Email and password cannot be empty", 400)
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid email format", 400)
    }

    const user = await login(email.trim(), password)

    return successResponse({ user })
  } catch (err) {
    return handleError(err)
  }
}
