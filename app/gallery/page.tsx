import type { Metadata } from "next"
import { GalleryHeader } from "@/components/gallery/GalleryHeader"
import { GalleryContainer } from "@/components/gallery/GalleryContainer"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export const metadata: Metadata = {
  title: "Gallery | Love 2035",
  description: "Our photo memories — every moment captured in love.",
}

export default function GalleryPage() {
  return (
    <div className="flex flex-col">
      <GalleryHeader />
      <ScrollReveal>
        <GalleryContainer />
      </ScrollReveal>
    </div>
  )
}
