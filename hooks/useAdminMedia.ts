"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface AdminMedia {
  id: string
  url: string
  mediaType: "IMAGE" | "VIDEO" | "AUDIO"
  visibility: "PUBLIC" | "APPROVED_GUEST" | "COUPLE" | "PASSWORD_LOCKED"
  uploadedBy: string
  createdAt: string
}

interface AdminMediaResponse {
  media: AdminMedia[]
}

export function useAdminMedia() {
  return useQuery<AdminMediaResponse>({
    queryKey: ["admin", "media"],
    queryFn: () => apiClient.get("/api/admin/media"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ message: string }>("/api/admin/media", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "media"] }),
  })
}
