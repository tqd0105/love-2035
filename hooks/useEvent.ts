"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface EventDetail {
  id: string
  title: string
  description: string | null
  eventType: string
  date: string
  isRecurring: boolean
  recurrence: string | null
  visibility: string
  createdAt: string
  updatedAt: string
}

interface EventResponse {
  event: EventDetail
}

export function useEvent(id: string) {
  return useQuery<EventResponse>({
    queryKey: ["event", id],
    queryFn: () => apiClient.get(`/api/events/${encodeURIComponent(id)}`),
    staleTime: 60_000,
    enabled: !!id,
  })
}
