import { NextRequest } from "next/server"
import { randomBytes } from "crypto"
import { successResponse, errorResponse, handleError } from "@/src/lib/response"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { withAuth } from "@/src/middleware/auth.middleware"
import { prisma } from "@/src/lib/prisma"
import { logger } from "@/src/lib/logger"

/**
 * GET /api/admin/invites
 * List all invite tokens. ADMIN only.
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (_req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const invites = await prisma.inviteToken.findMany({
        select: {
          id: true,
          token: true,
          label: true,
          maxUses: true,
          usedCount: true,
          expiresAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return successResponse({ invites })
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * POST /api/admin/invites
 * Create a new invite token. ADMIN only.
 *
 * Body: { label?: string, maxUses?: number, expiresAt?: string }
 */
export async function POST(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const body = await req.json().catch(() => ({}))
      const label = typeof body.label === "string" ? body.label.trim() || null : null
      const maxUses = typeof body.maxUses === "number" && body.maxUses >= 1 ? body.maxUses : 1
      const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null

      if (expiresAt && isNaN(expiresAt.getTime())) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Invalid expiration date", 400)
      }

      const token = randomBytes(32)
        .toString("base64url")

      const invite = await prisma.inviteToken.create({
        data: {
          token,
          label,
          maxUses,
          expiresAt,
          createdBy: session.userId,
        },
        select: {
          id: true,
          token: true,
          label: true,
          maxUses: true,
          usedCount: true,
          expiresAt: true,
          createdAt: true,
        },
      })

      logger.info(
        { endpoint: "/api/admin/invites", inviteId: invite.id },
        "Invite token created",
      )

      return successResponse({ invite }, 201)
    } catch (err) {
      return handleError(err)
    }
  })
}

/**
 * DELETE /api/admin/invites
 * Delete an invite token. ADMIN only.
 *
 * Body: { id: string }
 */
export async function DELETE(request: NextRequest) {
  return withAuth(request, async (req, session) => {
    try {
      if (session.role !== "ADMIN") {
        return errorResponse(ErrorCode.FORBIDDEN, "Admin access required", 403)
      }

      const body = await req.json().catch(() => null)
      if (!body || !body.id || typeof body.id !== "string") {
        throw new AppError(ErrorCode.VALIDATION_ERROR, "Invite ID is required", 400)
      }

      await prisma.inviteToken.delete({ where: { id: body.id } })

      logger.info(
        { endpoint: "/api/admin/invites", inviteId: body.id },
        "Invite token deleted",
      )

      return successResponse({ message: "Invite deleted" })
    } catch (err) {
      return handleError(err)
    }
  })
}
