import type { Metadata } from "next"
import { EventDetailView } from "@/components/event/EventDetailView"

export const metadata: Metadata = {
  title: "Event | Love 2035",
  description: "Relive a special moment in our love story.",
}

export default function EventPage() {
  return <EventDetailView />
}
