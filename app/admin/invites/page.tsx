"use client"

import { useRoleGuard } from "@/hooks/useRoleGuard"
import { InvitesTable } from "@/components/admin/InvitesTable"

export default function AdminInvitesPage() {
  const { isLoading, isAuthorized } = useRoleGuard(["ADMIN"])

  if (isLoading || !isAuthorized) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Invite Links</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and manage invitation links for guest access
        </p>
      </div>

      <InvitesTable />
    </div>
  )
}
