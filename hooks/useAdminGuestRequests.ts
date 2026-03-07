"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface AdminGuestRequest {
  id: string
  name: string
  email: string
  relationship: string
  message: string | null
  status: string
  createdAt: string
}

interface AdminGuestRequestsResponse {
  requests: AdminGuestRequest[]
}

export function useAdminGuestRequests() {
  return useQuery<AdminGuestRequestsResponse>({
    queryKey: ["admin", "guest-requests"],
    queryFn: () => apiClient.get("/api/admin/guest-requests"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useApproveGuestRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<{ message: string }>("/api/guest-request/approve", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guest-requests"] }),
  })
}

export function useRejectGuestRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.post<{ message: string }>("/api/guest-request/reject", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "guest-requests"] }),
  })
}
