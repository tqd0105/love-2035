import type { Role, Visibility } from "@/generated/prisma/client"

/**
 * Role hierarchy level — higher number = more access.
 *
 * From 01_docs/systems/content-visibility-system.md §3:
 *   ADMIN > COUPLE > APPROVED_GUEST > PUBLIC_VISITOR
 */
export const ROLE_LEVEL: Record<Role, number> = {
  PUBLIC_VISITOR: 0,
  APPROVED_GUEST: 1,
  COUPLE: 2,
  ADMIN: 3,
} as const

/**
 * Minimum role level required for each visibility.
 *
 * PASSWORD_LOCKED is special — handled separately in service layer.
 */
export const VISIBILITY_REQUIRED_LEVEL: Record<Visibility, number> = {
  PUBLIC: 0,
  APPROVED_GUEST: 1,
  COUPLE: 2,
  PASSWORD_LOCKED: 3, // Only ADMIN auto-access; COUPLE needs password
} as const

/**
 * All visibilities a given role can access (excluding PASSWORD_LOCKED).
 * Used to build Prisma where clauses for list queries.
 */
export const ROLE_ALLOWED_VISIBILITIES: Record<Role, Visibility[]> = {
  ADMIN: ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"],
  COUPLE: ["PUBLIC", "APPROVED_GUEST", "COUPLE"],
  APPROVED_GUEST: ["PUBLIC", "APPROVED_GUEST"],
  PUBLIC_VISITOR: ["PUBLIC"],
} as const

/**
 * Check if roleA has equal or higher privilege than roleB.
 */
export function isRoleAtLeast(role: Role, minimumRole: Role): boolean {
  return ROLE_LEVEL[role] >= ROLE_LEVEL[minimumRole]
}

/**
 * Get the access level of a role.
 */
export function getRoleLevel(role: Role): number {
  return ROLE_LEVEL[role]
}

/**
 * Get the minimum access level required for a visibility.
 */
export function getVisibilityLevel(visibility: Visibility): number {
  return VISIBILITY_REQUIRED_LEVEL[visibility]
}
