"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

type Role = "ADMIN" | "COUPLE" | "APPROVED_GUEST"

export function useRoleGuard(allowedRoles: Role[]) {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!user || !allowedRoles.includes(user.role)) {
      router.replace("/login")
    }
  }, [user, isLoading, allowedRoles, router])

  return { user, isLoading, isAuthorized: !!user && allowedRoles.includes(user.role) }
}
