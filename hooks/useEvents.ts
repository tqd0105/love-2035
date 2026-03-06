"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

interface Event {
  id: string
  title: string
  eventType: string
  date: string
  visibility: string
  description?: string | null
  isRecurring: boolean
  createdAt: string
}

export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ["events"],
    queryFn: () => apiClient.get("/api/events/list"),
    staleTime: 60_000,
  })
}
