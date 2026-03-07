"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface AdminInvite {
  id: string
  token: string
  label: string | null
  maxUses: number
  usedCount: number
  expiresAt: string | null
  createdAt: string
}

interface AdminInvitesResponse {
  invites: AdminInvite[]
}

interface CreateInviteInput {
  label?: string
  maxUses?: number
  expiresAt?: string
}

export function useAdminInvites() {
  return useQuery<AdminInvitesResponse>({
    queryKey: ["admin", "invites"],
    queryFn: () => apiClient.get("/api/admin/invites"),
    staleTime: 30_000,
    retry: false,
  })
}

export function useCreateInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateInviteInput) =>
      apiClient.post<{ invite: AdminInvite }>("/api/admin/invites", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "invites"] }),
  })
}

export function useDeleteInvite() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete<{ message: string }>("/api/admin/invites", { id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "invites"] }),
  })
}
