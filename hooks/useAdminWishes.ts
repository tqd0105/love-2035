"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface AdminWish {
  id: string
  name: string
  message: string
  photoUrl: string | null
  createdAt: string
}

interface AdminWishesResponse {
  wishes: AdminWish[]
}

export function useAdminWishes() {
  return useQuery<AdminWishesResponse>({
    queryKey: ["admin", "wishes"],
    queryFn: () => apiClient.get("/api/admin/wishes"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useDeleteWish() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ message: string }>("/api/admin/wishes", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "wishes"] }),
  })
}
