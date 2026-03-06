"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface TimelineEvent {
  id: string
  eventId: string | null
  title: string
  timelineType: string
  date: string
  visibility: string
  description: string | null
  isHighlighted: boolean
  createdAt: string
  updatedAt: string
}

interface TimelineListResponse {
  events: TimelineEvent[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export function useTimeline(page = 1, limit = 50) {
  return useQuery<TimelineListResponse>({
    queryKey: ["timeline", page, limit],
    queryFn: () =>
      apiClient.get(`/api/timeline/list?page=${page}&limit=${limit}`),
    staleTime: 60_000,
  })
}
