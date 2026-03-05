import bcrypt from "bcrypt"
import type { VaultContentType } from "@/generated/prisma/client"
import { prisma } from "@/src/lib/prisma"
import { AppError, ErrorCode } from "@/src/lib/errors"

// ── Types ───────────────────────────────────────────────────────────

export interface CreateVaultItemInput {
  title: string
  contentEncrypted: string
  vaultType: VaultContentType
  unlockAt?: Date
  requiresPassword?: boolean
  password?: string
}

export interface UpdateVaultItemInput {
  title?: string
  contentEncrypted?: string
  vaultType?: VaultContentType
  unlockAt?: Date
  requiresPassword?: boolean
  password?: string
}

const SALT_ROUNDS = 12

// ── Select fragments ────────────────────────────────────────────────

/** Full item — returned after unlock checks pass. Never includes passwordHash. */
const vaultItemSelect = {
  id: true,
  title: true,
  contentEncrypted: true,
  vaultType: true,
  unlockAt: true,
  requiresPassword: true,
  createdAt: true,
  updatedAt: true,
} as const

/** Summary for list views — no content. */
const vaultSummarySelect = {
  id: true,
  title: true,
  vaultType: true,
  unlockAt: true,
  requiresPassword: true,
  createdAt: true,
  updatedAt: true,
} as const

/** Lock info for access checks. */
const vaultLockSelect = {
  unlockAt: true,
  requiresPassword: true,
  passwordHash: true,
} as const

// ── Service functions ───────────────────────────────────────────────

/**
 * Create a new vault item.
 * If requiresPassword is true, password is required and will be hashed.
 * If vaultType is TIME_CAPSULE, unlockAt is required.
 */
export async function createVaultItem(input: CreateVaultItemInput) {
  if (input.vaultType === "TIME_CAPSULE" && !input.unlockAt) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      "unlockAt is required for TIME_CAPSULE items",
      400,
    )
  }

  if (input.requiresPassword && !input.password) {
    throw new AppError(
      ErrorCode.VALIDATION_ERROR,
      "Password is required when requiresPassword is true",
      400,
    )
  }

  const passwordHash = input.password
    ? await bcrypt.hash(input.password, SALT_ROUNDS)
    : undefined

  return prisma.vaultItem.create({
    data: {
      title: input.title,
      contentEncrypted: input.contentEncrypted,
      vaultType: input.vaultType,
      unlockAt: input.unlockAt,
      requiresPassword: input.requiresPassword ?? false,
      passwordHash,
    },
    select: vaultItemSelect,
  })
}

/**
 * Update an existing vault item.
 * Throws NOT_FOUND if item does not exist.
 */
export async function updateVaultItem(id: string, input: UpdateVaultItemInput) {
  await getVaultItemById(id) // ensure exists

  const passwordHash = input.password
    ? await bcrypt.hash(input.password, SALT_ROUNDS)
    : undefined

  return prisma.vaultItem.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.contentEncrypted !== undefined && { contentEncrypted: input.contentEncrypted }),
      ...(input.vaultType !== undefined && { vaultType: input.vaultType }),
      ...(input.unlockAt !== undefined && { unlockAt: input.unlockAt }),
      ...(input.requiresPassword !== undefined && { requiresPassword: input.requiresPassword }),
      ...(passwordHash !== undefined && { passwordHash }),
    },
    select: vaultItemSelect,
  })
}

/**
 * Get a vault item by ID (full content).
 * Does NOT apply lock checks — caller is responsible.
 * Never returns passwordHash.
 */
export async function getVaultItemById(id: string) {
  const item = await prisma.vaultItem.findUnique({
    where: { id },
    select: vaultItemSelect,
  })

  if (!item) {
    throw new AppError(ErrorCode.NOT_FOUND, "Vault item not found", 404)
  }

  return item
}

/**
 * Get lock info for access checks.
 */
export async function getVaultLockInfo(id: string) {
  const item = await prisma.vaultItem.findUnique({
    where: { id },
    select: vaultLockSelect,
  })

  if (!item) {
    throw new AppError(ErrorCode.NOT_FOUND, "Vault item not found", 404)
  }

  return item
}

/**
 * Check if a vault item is time-locked.
 */
export function isTimeLocked(unlockAt: Date | null): boolean {
  if (!unlockAt) return false
  return new Date() < unlockAt
}

/**
 * Assert that a vault item is not time-locked.
 */
export function assertNotTimeLocked(unlockAt: Date | null): void {
  if (isTimeLocked(unlockAt)) {
    throw new AppError(
      ErrorCode.LOCKED,
      `This vault item is locked until ${unlockAt!.toISOString()}`,
      423,
    )
  }
}

/**
 * Verify a vault item's password.
 */
export async function verifyVaultPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

/**
 * List all vault items (summary only, no content).
 * Sorted by createdAt descending.
 */
export async function listVaultItems() {
  return prisma.vaultItem.findMany({
    select: vaultSummarySelect,
    orderBy: { createdAt: "desc" },
  })
}

/**
 * Delete a vault item by ID.
 * Throws NOT_FOUND if it does not exist.
 */
export async function deleteVaultItem(id: string) {
  await getVaultItemById(id)

  await prisma.vaultItem.delete({
    where: { id },
  })
}
