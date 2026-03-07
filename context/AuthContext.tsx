"use client"

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api/client"

type Role = "ADMIN" | "COUPLE" | "APPROVED_GUEST"

interface User {
  id: string
  email: string
  role: Role
}

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: user = null, isLoading } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await apiClient.get<User>("/api/auth/me")
      } catch {
        return null
      }
    },
    retry: false,
    staleTime: 30_000,
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const { user } = await apiClient.post<{ user: { id: string; role: string } }>(
        "/api/auth/login",
        { email, password },
      )
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] })

      const redirectMap: Record<string, string> = {
        ADMIN: "/admin",
        COUPLE: "/profile",
        APPROVED_GUEST: "/gallery",
      }
      router.push(redirectMap[user.role] ?? "/")
    },
    [queryClient, router],
  )

  const logout = useCallback(async () => {
    await apiClient.post("/api/auth/logout")
    queryClient.setQueryData(["auth", "me"], null)
    router.push("/")
  }, [queryClient, router])

  return (
    <AuthContext value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
