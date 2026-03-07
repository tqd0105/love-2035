"use client"

import { useRoleGuard } from "@/hooks/useRoleGuard"
import { GalleryHeader } from "@/components/gallery/GalleryHeader"
import { GalleryContainer } from "@/components/gallery/GalleryContainer"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export function GalleryGuarded() {
  const { isLoading, isAuthorized } = useRoleGuard(["ADMIN", "COUPLE", "APPROVED_GUEST"])

  if (isLoading || !isAuthorized) return null

  return (
    <div className="flex flex-col">
      <GalleryHeader />
      <ScrollReveal>
        <GalleryContainer />
      </ScrollReveal>
    </div>
  )
}
