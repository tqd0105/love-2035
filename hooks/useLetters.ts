"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface LetterSummary {
  id: string
  title: string
  letterType: "REGULAR" | "TIME_LOCKED" | "PASSWORD_LOCKED" | "FUTURE_MESSAGE"
  visibility: string
  unlockAt: string | null
  moodTags: string[]
  isReadTracking: boolean
  createdAt: string
  updatedAt: string
}

export interface LetterDetail extends LetterSummary {
  content: string
  musicUrl: string | null
}

interface LettersListResponse {
  letters: LetterSummary[]
}

interface LetterDetailResponse {
  letter: LetterDetail
}

export function useLetters() {
  return useQuery<LettersListResponse>({
    queryKey: ["letters"],
    queryFn: () => apiClient.get("/api/letters/list"),
    staleTime: 60_000,
  })
}

export function useLetter(id: string) {
  return useQuery<LetterDetailResponse>({
    queryKey: ["letter", id],
    queryFn: () => apiClient.get(`/api/letters/${encodeURIComponent(id)}`),
    staleTime: 60_000,
    enabled: !!id,
  })
}
