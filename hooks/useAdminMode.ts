"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export type SystemMode = "RELATIONSHIP" | "WEDDING" | "ARCHIVE"

export interface SystemConfig {
  mode: SystemMode
  weddingEnabled: boolean
  archiveEnabled: boolean
  updatedAt: string
}

export function useAdminMode() {
  return useQuery<SystemConfig>({
    queryKey: ["admin", "mode"],
    queryFn: () => apiClient.get("/api/admin/mode"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useSetMode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mode: SystemMode) =>
      apiClient.put<{ mode: SystemMode }>("/api/admin/mode", { mode }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "mode"] }),
  })
}
