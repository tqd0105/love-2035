"use client"

import { useAuth } from "@/context/AuthContext"

type Role = "ADMIN" | "COUPLE" | "APPROVED_GUEST"

export type Capability =
  | "create_event"
  | "edit_event"
  | "delete_event"
  | "create_timeline"
  | "edit_timeline"
  | "create_letter"
  | "edit_letter"
  | "create_media"
  | "create_vault_item"
  | "edit_profile"
  | "manage_guests"
  | "manage_invites"
  | "manage_mode"
  | "view_admin"
  | "guest_interaction"

const ROLE_CAPABILITIES: Record<Role, Set<Capability>> = {
  ADMIN: new Set([
    "create_event",
    "edit_event",
    "delete_event",
    "create_timeline",
    "edit_timeline",
    "create_letter",
    "edit_letter",
    "create_media",
    "create_vault_item",
    "edit_profile",
    "manage_guests",
    "manage_invites",
    "manage_mode",
    "view_admin",
    "guest_interaction",
  ]),
  COUPLE: new Set([
    "create_event",
    "edit_event",
    "delete_event",
    "create_timeline",
    "edit_timeline",
    "create_letter",
    "edit_letter",
    "create_media",
    "create_vault_item",
    "edit_profile",
  ]),
  APPROVED_GUEST: new Set([
    "guest_interaction",
  ]),
}

export function useCapabilities() {
  const { user } = useAuth()

  function can(capability: Capability): boolean {
    if (!user) return false
    return ROLE_CAPABILITIES[user.role]?.has(capability) ?? false
  }

  function canAny(...capabilities: Capability[]): boolean {
    return capabilities.some(can)
  }

  function canAll(...capabilities: Capability[]): boolean {
    return capabilities.every(can)
  }

  return { can, canAny, canAll }
}
