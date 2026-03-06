"use client"

import { SystemModeControl } from "@/components/admin/SystemModeControl"

export default function AdminModePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">System Mode</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Switch between relationship, wedding, and archive modes
        </p>
      </div>

      <SystemModeControl />
    </div>
  )
}
