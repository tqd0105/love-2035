import bcrypt from "bcrypt"
import type { Role, Visibility } from "@/generated/prisma/client"
import { AppError, ErrorCode } from "@/src/lib/errors"
import {
  ROLE_LEVEL,
  VISIBILITY_REQUIRED_LEVEL,
  ROLE_ALLOWED_VISIBILITIES,
} from "@/src/lib/visibility"

/**
 * Check if a role can access content with the given visibility.
 *
 * Role vs Visibility matrix (from content-visibility-system.md §5.2):
 *
 * | Role            | PUBLIC | APPROVED_GUEST | COUPLE | PASSWORD_LOCKED |
 * |-----------------|--------|----------------|--------|-----------------|
 * | ADMIN           | ✓      | ✓              | ✓      | ✓ (override)    |
 * | COUPLE          | ✓      | ✓              | ✓      | ✓ (unlock)      |
 * | APPROVED_GUEST  | ✓      | ✓              | ✗      | ✗               |
 * | PUBLIC_VISITOR  | ✓      | ✗              | ✗      | ✗               |
 *
 * PASSWORD_LOCKED: only ADMIN auto-accesses; COUPLE needs password unlock.
 */
export function canAccessVisibility(role: Role, visibility: Visibility): boolean {
  return ROLE_LEVEL[role] >= VISIBILITY_REQUIRED_LEVEL[visibility]
}

/**
 * Assert that a role can access content with the given visibility.
 * Throws AppError(FORBIDDEN) if denied.
 * Throws AppError(LOCKED) if PASSWORD_LOCKED and role is not ADMIN.
 */
export function assertAccess(role: Role, visibility: Visibility): void {
  if (visibility === "PASSWORD_LOCKED" && role !== "ADMIN") {
    throw new AppError(ErrorCode.LOCKED, "This content requires a password to unlock", 423)
  }

  if (!canAccessVisibility(role, visibility)) {
    throw new AppError(ErrorCode.FORBIDDEN, "You do not have access to this content", 403)
  }
}

/**
 * Verify password for PASSWORD_LOCKED content.
 * Returns true if password matches the hash.
 */
export async function verifyContentPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash)
}

/**
 * Assert that the provided password unlocks PASSWORD_LOCKED content.
 * Throws AppError(LOCKED) if password is missing or incorrect.
 */
export async function assertPasswordUnlock(
  password: string | undefined,
  passwordHash: string | null | undefined,
): Promise<void> {
  if (!password) {
    throw new AppError(ErrorCode.LOCKED, "Password is required to unlock this content", 423)
  }

  if (!passwordHash) {
    throw new AppError(ErrorCode.INTERNAL_ERROR, "Content is locked but has no password hash", 500)
  }

  const valid = await verifyContentPassword(password, passwordHash)
  if (!valid) {
    throw new AppError(ErrorCode.LOCKED, "Incorrect password", 423)
  }
}

/**
 * Filter a list of content items by visibility for a given role.
 * PASSWORD_LOCKED items are excluded unless role is ADMIN.
 *
 * Use this when returning lists (e.g. GET /api/timeline, GET /api/letter).
 */
export function filterByVisibility<T extends { visibility: Visibility }>(
  items: T[],
  role: Role,
): T[] {
  return items.filter((item) => canAccessVisibility(role, item.visibility))
}

/**
 * Build a Prisma `where` clause fragment that limits results to
 * visibilities the given role can see.
 *
 * Usage:
 *   prisma.timelineEvent.findMany({
 *     where: { ...visibilityWhere(role) }
 *   })
 */
export function visibilityWhereClause(role: Role): { visibility: { in: Visibility[] } } {
  const allowed = ROLE_ALLOWED_VISIBILITIES[role] ?? []
  return { visibility: { in: [...allowed] } }
}
