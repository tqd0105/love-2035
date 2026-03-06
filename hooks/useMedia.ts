"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface MediaItem {
  id: string
  url: string
  mediaType: "IMAGE" | "VIDEO" | "AUDIO"
}

interface MediaListResponse {
  media: MediaItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useMedia(page = 1, limit = 50) {
  return useQuery<MediaListResponse>({
    queryKey: ["media", page, limit],
    queryFn: () =>
      apiClient.get(`/api/media/list?page=${page}&limit=${limit}`),
    staleTime: 60_000,
  })
}
