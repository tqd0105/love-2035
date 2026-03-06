"use client"

import { motion } from "framer-motion"
import { IconCalendar, IconSparkles } from "@tabler/icons-react"
import type { EventDetail } from "@/hooks/useEvent"

const typeLabels: Record<string, string> = {
  ANNIVERSARY: "Kỷ niệm",
  MILESTONE: "Cột mốc",
  WEDDING: "Đám cưới",
  CUSTOM: "Sự kiện",
}

interface EventHeaderProps {
  event: EventDetail
}

export function EventHeader({ event }: EventHeaderProps) {
  const formatted = new Date(event.date).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const label = typeLabels[event.eventType] ?? "Sự kiện"

  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/4 h-[350px] w-[350px] rounded-full bg-rose-400/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-[300px] w-[300px] rounded-full bg-purple-400/15 blur-3xl" />
      </div>

      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100 to-pink-100 px-4 py-1.5 text-xs font-medium text-rose-600"
        >
          <IconSparkles size={14} />
          {label}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mb-5 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
        >
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            {event.title}
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground sm:text-base"
        >
          <IconCalendar size={18} className="text-pink-400" />
          <time>{formatted}</time>
        </motion.div>
      </div>
    </section>
  )
}
