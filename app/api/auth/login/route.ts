import { NextRequest } from "next/server"
import { login } from "@/src/services/auth.service"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { rateLimit } from "@/src/lib/rate-limit"
import { checkPayloadSize } from "@/src/lib/payload-guard"
import { logger } from "@/src/lib/logger"
import { loginSchema, validateBody } from "@/src/lib/validations"

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

  let emailInput: string | undefined

  try {
    const body = await request.json().catch(() => null)
    const { email, password } = validateBody(loginSchema, body)
    emailInput = email

    const user = await login(email, password)

    logger.info({ endpoint: "/api/auth/login", userId: user.id, role: user.role }, "User logged in")

    return successResponse({ user })
  } catch (err) {
    if (err instanceof AppError && err.code === ErrorCode.INVALID_CREDENTIALS) {
      logger.warn({ endpoint: "/api/auth/login", email: emailInput }, "Failed login attempt")
    }
    return handleError(err)
  }
}
