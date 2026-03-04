import bcrypt from "bcrypt"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { createSessionToken, setSessionCookie } from "@/src/lib/auth"

const SALT_ROUNDS = 12

/**
 * Authenticate user by email and password.
 *
 * - Finds user by email
 * - Compares bcrypt hash
 * - Creates JWT session token
 * - Sets httpOnly cookie
 *
 * Returns { id, role } on success.
 * Throws AppError(INVALID_CREDENTIALS) on failure — never reveals whether
 * email or password was wrong (error-convention.md).
 */
export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true, role: true },
  })

  if (!user) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password", 401)
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw new AppError(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password", 401)
  }

  const token = await createSessionToken({ userId: user.id, role: user.role })
  await setSessionCookie(token)

  return { id: user.id, role: user.role }
}

/**
 * Hash a plain-text password using bcrypt.
 * Used by seed scripts and registration flows.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}
