"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface ProfilePerson {
  id: string
  owner: "PERSON_A" | "PERSON_B"
  displayName: string
  bio: string | null
  avatarId: string | null
}

export interface ProfileData {
  profiles: ProfilePerson[]
}

/**
 * Fetch couple profiles from /api/profile.
 *
 * Falls back gracefully — the page renders placeholder data
 * while the API is not yet implemented.
 */
export function useProfile() {
  return useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => apiClient.get("/api/profile"),
    staleTime: 5 * 60_000,
    retry: false,
  })
}
