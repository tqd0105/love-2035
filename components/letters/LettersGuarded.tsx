"use client"

import { useRoleGuard } from "@/hooks/useRoleGuard"
import { LettersHeader } from "@/components/letters/LettersHeader"
import { LettersContainer } from "@/components/letters/LettersContainer"

export function LettersGuarded() {
  const { isLoading, isAuthorized } = useRoleGuard(["ADMIN", "COUPLE"])

  if (isLoading || !isAuthorized) return null

  return (
    <div className="flex flex-col">
      <LettersHeader />
      <LettersContainer />
    </div>
  )
}
