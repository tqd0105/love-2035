import bcrypt from "bcrypt"
import type { Role, LetterType, Visibility } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"
import { visibilityWhereClause } from "@/src/services/visibility.service"

// ── Types ───────────────────────────────────────────────────────────

export interface CreateLetterInput {
  title: string
  content: string
  letterType: LetterType
  visibility: Visibility
  unlockAt?: Date
  password?: string
  moodTags?: string[]
  musicUrl?: string
  isReadTracking?: boolean
}

export interface UpdateLetterInput {
  title?: string
  content?: string
  letterType?: LetterType
  visibility?: Visibility
  unlockAt?: Date
  password?: string
  moodTags?: string[]
  musicUrl?: string
  isReadTracking?: boolean
}

const SALT_ROUNDS = 12

// ── Select fragment ─────────────────────────────────────────────────

/** Fields returned to clients. Never includes passwordHash. */
const letterSelect = {
  id: true,
  title: true,
  content: true,
  letterType: true,
  visibility: true,
  unlockAt: true,
  moodTags: true,
  musicUrl: true,
  isReadTracking: true,
  createdAt: true,
  updatedAt: true,
} as const

/** Summary for list views — no content. */
const letterSummarySelect = {
  id: true,
  title: true,
  letterType: true,
  visibility: true,
  unlockAt: true,
  moodTags: true,
  isReadTracking: true,
  createdAt: true,
  updatedAt: true,
} as const

// ── Service functions ───────────────────────────────────────────────

/**
 * Create a new letter.
 * If letterType is PASSWORD_LOCKED, password is required and will be hashed.
 * If letterType is TIME_LOCKED or FUTURE_MESSAGE, unlockAt is required.
 */
export async function createLetter(input: CreateLetterInput) {
  // Validate time-lock types require unlockAt
  if (
    (input.letterType === "TIME_LOCKED" || input.letterType === "FUTURE_MESSAGE") &&
    !input.unlockAt
  ) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      `unlockAt is required for ${input.letterType} letters`,
      400,
    )
  }

  // Validate password-locked type requires password
  if (input.letterType === "PASSWORD_LOCKED" && !input.password) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      "Password is required for PASSWORD_LOCKED letters",
      400,
    )
  }

  const passwordHash = input.password
    ? await bcrypt.hash(input.password, SALT_ROUNDS)
    : undefined

  return prisma.letter.create({
    data: {
      title: input.title,
      content: input.content,
      letterType: input.letterType,
      visibility: input.visibility,
      unlockAt: input.unlockAt,
      passwordHash,
      moodTags: input.moodTags ?? [],
      musicUrl: input.musicUrl,
      isReadTracking: input.isReadTracking ?? false,
    },
    select: letterSelect,
  })
}

/**
 * Update an existing letter.
 * Throws NOT_FOUND if letter does not exist.
 */
export async function updateLetter(id: string, input: UpdateLetterInput) {
  await getLetterById(id) // ensure exists

  const passwordHash = input.password
    ? await bcrypt.hash(input.password, SALT_ROUNDS)
    : undefined

  return prisma.letter.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.letterType !== undefined && { letterType: input.letterType }),
      ...(input.visibility !== undefined && { visibility: input.visibility }),
      ...(input.unlockAt !== undefined && { unlockAt: input.unlockAt }),
      ...(passwordHash !== undefined && { passwordHash }),
      ...(input.moodTags !== undefined && { moodTags: input.moodTags }),
      ...(input.musicUrl !== undefined && { musicUrl: input.musicUrl }),
      ...(input.isReadTracking !== undefined && { isReadTracking: input.isReadTracking }),
    },
    select: letterSelect,
  })
}

/**
 * Get a letter by ID (internal — no visibility/lock checks).
 * Never returns passwordHash.
 */
export async function getLetterById(id: string) {
  const letter = await prisma.letter.findUnique({
    where: { id },
    select: letterSelect,
  })

  if (!letter) {
    throw new AppError(ErrorCode.NOT_FOUND, "Letter not found", 404)
  }

  return letter
}

/**
 * Get a letter by ID with full lock data (for middleware checks).
 * Returns visibility + passwordHash + unlockAt.
 */
export async function getLetterLockInfo(id: string) {
  const letter = await prisma.letter.findUnique({
    where: { id },
    select: {
      visibility: true,
      passwordHash: true,
      unlockAt: true,
      letterType: true,
    },
  })

  if (!letter) {
    throw new AppError(ErrorCode.NOT_FOUND, "Letter not found", 404)
  }

  return letter
}

/**
 * Check if a letter is time-locked (unlockAt is in the future).
 */
export function isTimeLocked(unlockAt: Date | null): boolean {
  if (!unlockAt) return false
  return new Date() < unlockAt
}

/**
 * Assert that a letter is not time-locked.
 * Throws LOCKED (423) if the letter cannot be opened yet.
 */
export function assertNotTimeLocked(unlockAt: Date | null): void {
  if (isTimeLocked(unlockAt)) {
    throw new AppError(
      ErrorCode.LOCKED,
      `This letter is locked until ${unlockAt!.toISOString()}`,
      423,
    )
  }
}

/**
 * Verify a letter's password.
 */
export async function verifyLetterPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

/**
 * List all letters visible to the given role (summary only, no content).
 * Sorted by createdAt descending.
 */
export async function listLetters(role: Role) {
  return prisma.letter.findMany({
    where: visibilityWhereClause(role),
    select: letterSummarySelect,
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Delete a letter by ID.
 * Throws NOT_FOUND if letter does not exist.
 */
export async function deleteLetter(id: string) {
  await getLetterById(id)

  await prisma.letter.delete({
    where: { id },
  })
}

/**
 * Record a letter read (if read tracking is enabled).
 */
export async function trackLetterRead(letterId: string, userId: string) {
  const letter = await prisma.letter.findUnique({
    where: { id: letterId },
    select: { isReadTracking: true },
  })

  if (!letter?.isReadTracking) return

  await prisma.letterRead.upsert({
    where: {
      letterId_userId: { letterId, userId },
    },
    update: { readAt: new Date() },
    create: { letterId, userId },
  })
}
