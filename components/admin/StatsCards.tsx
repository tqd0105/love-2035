"use client"

import { motion } from "framer-motion"
import {
  IconCalendarEvent,
  IconPhoto,
  IconMessage,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { useAdminEvents } from "@/hooks/useAdminEvents"
import { useAdminMedia } from "@/hooks/useAdminMedia"
import { useAdminWishes } from "@/hooks/useAdminWishes"

export function StatsCards() {
  const { data: eventsData, isLoading: le } = useAdminEvents()
  const { data: mediaData, isLoading: lm } = useAdminMedia()
  const { data: wishesData, isLoading: lw } = useAdminWishes()

  const stats = [
    {
      label: "Events",
      value: eventsData?.events.length ?? 0,
      icon: IconCalendarEvent,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
    {
      label: "Photos",
      value:
        mediaData?.media.filter((m) => m.mediaType === "IMAGE").length ?? 0,
      icon: IconPhoto,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Guest Wishes",
      value: wishesData?.wishes.length ?? 0,
      icon: IconMessage,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ] as const

  const loading = le || lm || lw

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" as const }}
        >
          <Card className="border-border/40">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="text-2xl font-semibold tabular-nums">
                  {loading ? "–" : value}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
