"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

export interface CreateLetterInput {
  title: string
  content: string
  visibility: string
  openAt?: string
}

export function useCreateLetter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateLetterInput) =>
      apiClient.post("/api/letters/create", {
        title: input.title,
        content: input.content,
        visibility: input.visibility,
        letterType: input.openAt ? "TIME_LOCKED" : "REGULAR",
        unlockAt: input.openAt ? new Date(input.openAt).toISOString() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] })
    },
  })
}

export interface UpdateLetterInput {
  id: string
  title?: string
  content?: string
  visibility?: string
  openAt?: string
}

export function useUpdateLetter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, openAt, ...data }: UpdateLetterInput) =>
      apiClient.put(`/api/letters/${encodeURIComponent(id)}`, {
        ...data,
        ...(openAt !== undefined && {
          letterType: "TIME_LOCKED",
          unlockAt: new Date(openAt).toISOString(),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] })
      queryClient.invalidateQueries({ queryKey: ["letter"] })
    },
  })
}

export function useDeleteLetter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/api/letters/${encodeURIComponent(id)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["letters"] })
    },
  })
}
