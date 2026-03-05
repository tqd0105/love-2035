import type { Mode } from "@/generated/prisma/client"

/**
 * Mode permission rules.
 *
 * From 01_docs/systems/mode-system.md:
 *
 * RELATIONSHIP → full content creation
 * WEDDING     → restricted editing, guest features enabled
 * ARCHIVE     → read-only, no new content
 */

// ── Action definitions ──────────────────────────────────────────────

/**
 * All mode-gated actions in the system.
 * Add new actions here as features grow.
 */
export type ModeAction =
  | "CREATE_TIMELINE"
  | "EDIT_TIMELINE"
  | "CREATE_LETTER"
  | "EDIT_LETTER"
  | "CREATE_MEDIA"
  | "CREATE_EVENT"
  | "EDIT_EVENT"
  | "CREATE_VAULT_ITEM"
  | "EDIT_PROFILE"
  | "GUEST_INTERACTION"
  | "GUEST_REQUEST"

// ── Permission matrix ───────────────────────────────────────────────

/**
 * Which actions are allowed in each mode.
 *
 * RELATIONSHIP: full creation & editing
 * WEDDING:      reading + guest features, restricted editing
 * ARCHIVE:      read-only, no creation or editing
 */
const MODE_PERMISSIONS: Record<Mode, Set<ModeAction>> = {
  RELATIONSHIP: new Set([
    "CREATE_TIMELINE",
    "EDIT_TIMELINE",
    "CREATE_LETTER",
    "EDIT_LETTER",
    "CREATE_MEDIA",
    "CREATE_EVENT",
    "EDIT_EVENT",
    "CREATE_VAULT_ITEM",
    "EDIT_PROFILE",
  ]),
  WEDDING: new Set([
    "EDIT_TIMELINE",
    "CREATE_MEDIA",
    "CREATE_EVENT",
    "EDIT_EVENT",
    "GUEST_INTERACTION",
    "GUEST_REQUEST",
    "EDIT_PROFILE",
  ]),
  ARCHIVE: new Set<ModeAction>([
    // Read-only — no actions allowed
  ]),
}

// ── Guard functions ─────────────────────────────────────────────────

/**
 * Check if a given action is permitted in the current mode.
 */
export function isModeActionAllowed(mode: Mode, action: ModeAction): boolean {
  return MODE_PERMISSIONS[mode]?.has(action) ?? false
}

/**
 * Check if timeline creation is allowed in the current mode.
 */
export function canCreateTimeline(mode: Mode): boolean {
  return isModeActionAllowed(mode, "CREATE_TIMELINE")
}

/**
 * Check if timeline editing is allowed in the current mode.
 */
export function canEditTimeline(mode: Mode): boolean {
  return isModeActionAllowed(mode, "EDIT_TIMELINE")
}

/**
 * Check if letter creation is allowed in the current mode.
 */
export function canCreateLetter(mode: Mode): boolean {
  return isModeActionAllowed(mode, "CREATE_LETTER")
}

/**
 * Check if media upload is allowed in the current mode.
 */
export function canCreateMedia(mode: Mode): boolean {
  return isModeActionAllowed(mode, "CREATE_MEDIA")
}

/**
 * Check if vault item creation is allowed in the current mode.
 */
export function canCreateVaultItem(mode: Mode): boolean {
  return isModeActionAllowed(mode, "CREATE_VAULT_ITEM")
}

/**
 * Check if guest interactions are allowed in the current mode.
 */
export function canGuestInteract(mode: Mode): boolean {
  return isModeActionAllowed(mode, "GUEST_INTERACTION")
}

/**
 * Check if the system is in read-only mode.
 */
export function isReadOnly(mode: Mode): boolean {
  return mode === "ARCHIVE"
}

/**
 * Get the human-readable description of a mode's restrictions.
 */
export function getModeDescription(mode: Mode): string {
  switch (mode) {
    case "RELATIONSHIP":
      return "Full access — content creation and editing allowed"
    case "WEDDING":
      return "Wedding mode — guest features enabled, some editing restricted"
    case "ARCHIVE":
      return "Archive mode — read-only, no new content creation"
  }
}
