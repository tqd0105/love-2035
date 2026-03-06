"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad } from "@tabler/icons-react"
import { useEvent } from "@/hooks/useEvent"
import { EventHeader } from "@/components/event/EventHeader"
import { EventStory } from "@/components/event/EventStory"
import { EventGallery } from "@/components/event/EventGallery"
import { EventNavigation } from "@/components/event/EventNavigation"

export function EventDetailView() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError } = useEvent(params.id)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-pink-400" />
        </motion.div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể tải sự kiện. Vui lòng thử lại sau.
        </p>
        <EventNavigation />
      </div>
    )
  }

  const { event } = data

  return (
    <div className="flex flex-col">
      <EventHeader event={event} />
      <EventStory description={event.description} />
      <EventGallery />
      <EventNavigation />
    </div>
  )
}
