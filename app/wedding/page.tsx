import type { Metadata } from "next"
import { WeddingHero } from "@/components/wedding/WeddingHero"
import { LoveStory } from "@/components/wedding/TimelinePreview"
import { PhotoHighlights } from "@/components/wedding/PhotoHighlights"
import { WeddingEvent } from "@/components/wedding/WeddingDate"
import { GuestActions } from "@/components/wedding/GuestActions"

export const metadata: Metadata = {
  title: "Wedding | Love 2035",
  description: "Celebrate our special day with us.",
}

export default function WeddingPage() {
  return (
    <div className="flex flex-col">
      <WeddingHero />
      <LoveStory />
      <PhotoHighlights />
      <WeddingEvent />
      <GuestActions />
    </div>
  )
}
