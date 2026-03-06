"use client"

import { StatsCards } from "@/components/admin/StatsCards"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your system
        </p>
      </div>

      <StatsCards />
    </div>
  )
}
