"use client"

import { MediaGrid } from "@/components/admin/MediaGrid"

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage uploaded photos and media
        </p>
      </div>

      <MediaGrid />
    </div>
  )
}
