"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

export interface CreateWishInput {
  name: string
  message: string
}

export function useCreateWish() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateWishInput) =>
      apiClient.post("/api/wedding/wishes/create", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wedding-wishes"] })
    },
  })
}
