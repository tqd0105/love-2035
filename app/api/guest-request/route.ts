import { NextRequest } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/src/lib/prisma"
import { successResponse, handleError } from "@/src/lib/response"
import { rateLimit } from "@/src/lib/rate-limit"
import { checkPayloadSize } from "@/src/lib/payload-guard"
import { logger } from "@/src/lib/logger"
import { guestRequestSchema, validateBody } from "@/src/lib/validations"

const SALT_ROUNDS = 12

const checkRateLimit = rateLimit("guest-request", 5, 60_000) // 5 req/min per IP

/**
 * POST /api/guest-request
 *
 * Request:  { name, email, relationship, message? }
 * Response: { success: true, data: { id } }
 *
 * Rate-limited to 5 requests per minute per IP.
 */
export async function POST(request: NextRequest) {
  const tooLarge = checkPayloadSize(request)
  if (tooLarge) return tooLarge

  const rateLimited = checkRateLimit(request)
  if (rateLimited) return rateLimited

  try {
    const body = await request.json().catch(() => null)
    const { password, ...data } = validateBody(guestRequestSchema, body)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

    const guestRequest = await prisma.guestRequest.create({
      data: {
        ...data,
        passwordHash,
        status: "PENDING",
      },
    })

    logger.info(
      { endpoint: "/api/guest-request", id: guestRequest.id },
      "Guest access request created",
    )

    return successResponse({ id: guestRequest.id }, 201)
  } catch (err) {
    return handleError(err)
  }
}
