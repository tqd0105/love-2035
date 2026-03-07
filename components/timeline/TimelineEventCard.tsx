"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  IconCalendar,
  IconStar,
  IconPhoto,
  IconX,
} from "@tabler/icons-react"
import { IconPencil, IconTrash } from "@tabler/icons-react"
import type { TimelineEvent } from "@/hooks/useTimeline"

/* ── Gradient palette rotated per card ── */
const cardGradients = [
  { border: "from-rose-300/40 to-pink-300/40", icon: "from-rose-400 to-pink-500", glow: "rose-500/20" },
  { border: "from-pink-300/40 to-purple-300/40", icon: "from-pink-400 to-purple-500", glow: "purple-500/20" },
  { border: "from-purple-300/40 to-indigo-300/40", icon: "from-purple-400 to-indigo-500", glow: "indigo-500/20" },
  { border: "from-amber-300/40 to-orange-300/40", icon: "from-amber-400 to-orange-500", glow: "amber-500/20" },
  { border: "from-rose-300/40 to-rose-300/40", icon: "from-rose-400 to-rose-500", glow: "rose-500/20" },
] as const

/* ── Placeholder images ── */
const placeholderImages = [
  "from-rose-200 to-pink-300",
  "from-pink-200 to-purple-300",
  "from-purple-200 to-indigo-300",
  "from-amber-200 to-orange-300",
] as const

interface TimelineEventCardProps {
  event: TimelineEvent
  index: number
  canEdit?: boolean
  canDelete?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function TimelineEventCard({ event, index, canEdit, canDelete, onEdit, onDelete }: TimelineEventCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const palette = cardGradients[index % cardGradients.length]!
  const imgGradient = placeholderImages[index % placeholderImages.length]!
  const isEven = index % 2 === 0

  const formatted = new Date(event.date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: isEven ? -60 : 60, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: "easeOut" as const }}
        className={`flex w-full items-start gap-6 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
      >
        {/* Card */}
        <div className="group relative min-w-0 flex-1">
          {/* Glow behind */}
          <div
            className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${palette.border} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60`}
          />

          <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/80 group-hover:shadow-xl">
            {/* Media preview */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              onClick={() => setModalOpen(true)}
              className="relative block aspect-[16/10] w-full cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${imgGradient}`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <IconPhoto size={40} className="text-white/50" />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm"
                >
                  Xem ảnh
                </motion.span>
              </div>
            </motion.button>

            {/* Content */}
            <div className="p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${palette.icon} shadow-md shadow-${palette.glow}`}
                >
                  {event.isHighlighted ? (
                    <IconStar size={16} className="text-white" />
                  ) : (
                    <IconCalendar size={16} className="text-white" />
                  )}
                </div>
                <time className="text-xs font-medium text-muted-foreground">
                  {formatted}
                </time>
              </div>

              <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-foreground sm:text-xl">
                {event.title}
              </h3>

              {event.description && (
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {event.description}
                </p>
              )}

              {event.isHighlighted && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-3 py-1 text-xs font-medium text-amber-700">
                  <IconStar size={12} />
                  Khoảnh khắc đặc biệt
                </div>
              )}

              {(canEdit || canDelete) && (
                <div className="mt-4 flex gap-2 border-t border-border/30 pt-3">
                  {canEdit && (
                    <button
                      onClick={onEdit}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <IconPencil size={14} />
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={onDelete}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                    >
                      <IconTrash size={14} />
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline connector dot — visible on md+ */}
        <div className="relative hidden w-px shrink-0 md:flex md:flex-col md:items-center">
          <div
            className={`h-5 w-5 rounded-full bg-gradient-to-br ${palette.icon} shadow-lg shadow-${palette.glow} ring-4 ring-white/80`}
          />
        </div>

        {/* Spacer for the opposite side */}
        <div className="hidden min-w-0 flex-1 md:block" />
      </motion.div>

      {/* Image modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="relative max-h-[80vh] w-full max-w-2xl overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`aspect-[16/10] w-full bg-gradient-to-br ${imgGradient}`}
              >
                <div className="flex h-full items-center justify-center">
                  <IconPhoto size={64} className="text-white/50" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="font-serif text-lg font-semibold text-white">
                  {event.title}
                </h3>
                <p className="text-sm text-white/70">{formatted}</p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <IconX size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
