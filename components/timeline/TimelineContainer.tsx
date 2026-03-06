"use client"

import { motion } from "framer-motion"
import { IconMoodSad, IconLoader2 } from "@tabler/icons-react"
import { useTimeline } from "@/hooks/useTimeline"
import { TimelineEventCard } from "./TimelineEventCard"

export function TimelineContainer() {
  const { data, isLoading, isError } = useTimeline()

  if (isLoading) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-pink-400" />
        </motion.div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể tải timeline. Vui lòng thử lại sau.
        </p>
      </section>
    )
  }

  const events = data.events

  if (events.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có sự kiện nào trong timeline.
        </p>
      </section>
    )
  }

  return (
    <section className="relative py-12">
      {/* Central vertical line — md+ */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-pink-300/30 to-transparent md:block" />

      <div className="flex flex-col gap-12 md:gap-16">
        {events.map((event, i) => (
          <TimelineEventCard key={event.id} event={event} index={i} />
        ))}
      </div>

      {/* End flourish */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 flex justify-center"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/25">
          <span className="text-sm text-white">♥</span>
        </div>
      </motion.div>
    </section>
  )
}
