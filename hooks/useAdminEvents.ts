"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface AdminEvent {
  id: string
  title: string
  description: string | null
  eventType: "ANNIVERSARY" | "MILESTONE" | "WEDDING" | "CUSTOM"
  date: string
  isRecurring: boolean
  recurrence: string | null
  visibility: "PUBLIC" | "APPROVED_GUEST" | "COUPLE" | "PASSWORD_LOCKED"
  createdAt: string
  updatedAt: string
}

interface AdminEventsResponse {
  events: AdminEvent[]
}

export function useAdminEvents() {
  return useQuery<AdminEventsResponse>({
    queryKey: ["admin", "events"],
    queryFn: () => apiClient.get("/api/admin/events"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ message: string }>("/api/admin/events", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "events"] }),
  })
}
