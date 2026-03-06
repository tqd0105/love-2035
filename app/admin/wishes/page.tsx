"use client"

import { WishesList } from "@/components/admin/WishesList"

export default function AdminWishesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Guest Wishes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage guest messages and remove spam
        </p>
      </div>

      <WishesList />
    </div>
  )
}
