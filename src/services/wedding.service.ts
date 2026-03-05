import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"

// ── Types ───────────────────────────────────────────────────────────

export interface CreateWishInput {
  name: string
  message: string
  photoUrl?: string
}

// ── Select fragment ─────────────────────────────────────────────────

const wishSelect = {
  id: true,
  name: true,
  message: true,
  photoUrl: true,
  createdAt: true,
} as const

// ── Service functions ───────────────────────────────────────────────

/**
 * Create a new wedding wish.
 * Available to any authenticated user when mode = WEDDING.
 * Mode guard is enforced by middleware.
 */
export async function createWish(input: CreateWishInput) {
  return prisma.weddingWish.create({
    data: {
      name: input.name,
      message: input.message,
      photoUrl: input.photoUrl,
    },
    select: wishSelect,
  })
}

/**
 * List all wedding wishes.
 * Sorted by createdAt descending (newest first).
 * Wishes are PUBLIC — no visibility filter needed.
 */
export async function listWishes() {
  return prisma.weddingWish.findMany({
    select: wishSelect,
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Delete a wedding wish by ID.
 * Only ADMIN or COUPLE should call this (enforced by route).
 */
export async function deleteWish(id: string) {
  const wish = await prisma.weddingWish.findUnique({
    where: { id },
    select: { id: true },
  })

  if (!wish) {
    throw new AppError(ErrorCode.NOT_FOUND, "Wedding wish not found", 404)
  }

  await prisma.weddingWish.delete({ where: { id } })
}
