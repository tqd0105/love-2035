"use client"

import { useRoleGuard } from "@/hooks/useRoleGuard"
import { GuestRequestsTable } from "@/components/admin/GuestRequestsTable"

export default function AdminGuestRequestsPage() {
  const { isLoading, isAuthorized } = useRoleGuard(["ADMIN"])

  if (isLoading || !isAuthorized) return null

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Guest Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage guest access requests
        </p>
      </div>

      <GuestRequestsTable />
    </div>
  )
}
