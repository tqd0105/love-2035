"use client"

import { useRoleGuard } from "@/hooks/useRoleGuard"
import { EventsTable } from "@/components/admin/EventsTable"

export default function AdminEventsPage() {
  const { isLoading, isAuthorized } = useRoleGuard(["ADMIN"])

  if (isLoading || !isAuthorized) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage all events in the system
        </p>
      </div>

      <EventsTable />
    </div>
  )
}
