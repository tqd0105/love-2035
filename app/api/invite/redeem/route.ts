import { NextRequest } from "next/server"
import bcrypt from "bcrypt"
import { successResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { prisma } from "@/src/lib/prisma"
import { rateLimit } from "@/src/lib/rate-limit"
import { logger } from "@/src/lib/logger"

const SALT_ROUNDS = 12
const checkRateLimit = rateLimit("invite-redeem", 10, 60_000)

/**
 * POST /api/invite/redeem
 *
 * Body: { token: string, email: string, name: string }
 *
 * Validates the invite token and creates an APPROVED_GUEST account.
 */
export async function POST(request: NextRequest) {
  const rateLimited = checkRateLimit(request)
  if (rateLimited) return rateLimited

  try {
    const body = await request.json().catch(() => null)
    if (!body) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Request body is required", 400)
    }

    const { token, email, name, password } = body
    if (!token || typeof token !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Invite token is required", 400)
    }
    if (!email || typeof email !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Email is required", 400)
    }
    if (!name || typeof name !== "string") {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Name is required", 400)
    }
    if (!password || typeof password !== "string" || password.length < 8) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "Password must be at least 8 characters", 400)
    }

    const invite = await prisma.inviteToken.findUnique({
      where: { token },
    })

    if (!invite) {
      throw new AppError(ErrorCode.NOT_FOUND, "Invalid or expired invite link", 404)
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "This invite link has expired", 400)
    }

    if (invite.usedCount >= invite.maxUses) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "This invite link has reached its usage limit", 400)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existingUser) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, "An account with this email already exists", 400)
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    // Transaction: create user + increment usedCount
    await prisma.$transaction([
      prisma.user.create({
        data: {
          email: email.trim().toLowerCase(),
          passwordHash,
          role: "APPROVED_GUEST",
        },
      }),
      prisma.inviteToken.update({
        where: { id: invite.id },
        data: { usedCount: { increment: 1 } },
      }),
    ])

    logger.info(
      { endpoint: "/api/invite/redeem", inviteId: invite.id, email },
      "Invite redeemed — guest account created",
    )

    return successResponse({ message: "Account created successfully" }, 201)
  } catch (err) {
    return handleError(err)
  }
}
