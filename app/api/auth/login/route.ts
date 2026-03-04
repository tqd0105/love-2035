import { NextRequest } from "next/server"
import { login } from "@/src/services/auth.service"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"

/**
 * POST /api/auth/login
 *
 * Request:  { email: string, password: string }
 * Response: { success: true, data: { user: { id, role } } }
 *
 * Sets httpOnly session cookie on success.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body.email !== "string" || typeof body.password !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Email and password are required", 400)
    }

    const { email, password } = body

    if (!email.trim() || !password.trim()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Email and password cannot be empty", 400)
    }

    const user = await login(email.trim(), password)

    return successResponse({ user })
  } catch (err) {
    return handleError(err)
  }
}
