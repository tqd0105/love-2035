"use client"

import { motion } from "framer-motion"
import {
  IconMail,
  IconLock,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react"
import type { LetterSummary } from "@/hooks/useLetters"

const cardGradients = [
  { bg: "from-rose-50 to-pink-50", accent: "from-rose-400 to-pink-500", glow: "rose-500/15" },
  { bg: "from-amber-50 to-orange-50", accent: "from-amber-400 to-orange-500", glow: "amber-500/15" },
  { bg: "from-pink-50 to-purple-50", accent: "from-pink-400 to-purple-500", glow: "pink-500/15" },
  { bg: "from-rose-50 to-amber-50", accent: "from-rose-400 to-amber-500", glow: "rose-500/15" },
] as const

function isLocked(letter: LetterSummary): boolean {
  if (
    (letter.letterType === "TIME_LOCKED" || letter.letterType === "FUTURE_MESSAGE") &&
    letter.unlockAt
  ) {
    return new Date(letter.unlockAt) > new Date()
  }
  return false
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

interface LetterCardProps {
  letter: LetterSummary
  index: number
  onSelect: (id: string) => void
}

export function LetterCard({ letter, index, onSelect }: LetterCardProps) {
  const palette = cardGradients[index % cardGradients.length]!
  const locked = isLocked(letter)
  const isPasswordLocked = letter.letterType === "PASSWORD_LOCKED"

  const icon = locked
    ? IconClock
    : isPasswordLocked
      ? IconLock
      : IconMail

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: "easeOut" as const }}
      whileHover={locked ? {} : { y: -4, scale: 1.02 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      onClick={() => {
        if (!locked) onSelect(letter.id)
      }}
      disabled={locked}
      className="group relative w-full text-left"
    >
      {/* Glow */}
      {!locked && (
        <div
          className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${palette.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30`}
        />
      )}

      <div
        className={`relative overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br ${palette.bg} p-6 shadow-md backdrop-blur-sm transition-all duration-300 ${
          locked
            ? "cursor-not-allowed opacity-60"
            : "group-hover:border-white/60 group-hover:shadow-lg"
        }`}
      >
        {/* Decorative envelope flap */}
        <div className="absolute -right-6 -top-6 h-16 w-16 rotate-45 bg-white/30" />

        <div className="relative">
          {/* Icon + date row */}
          <div className="mb-3 flex items-center gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${palette.accent} shadow-md shadow-${palette.glow}`}
            >
              {(() => {
                const Icon = icon
                return <Icon size={18} className="text-white" />
              })()}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconCalendar size={13} />
              <time>{formatDate(letter.createdAt)}</time>
            </div>
          </div>

          {/* Title */}
          <h3 className="mb-2 font-serif text-lg font-semibold leading-snug text-foreground">
            {letter.title}
          </h3>

          {/* Status */}
          {locked && letter.unlockAt && (
            <p className="flex items-center gap-1.5 text-xs text-amber-600">
              <IconClock size={13} />
              Mở vào {formatDate(letter.unlockAt)}
            </p>
          )}

          {isPasswordLocked && !locked && (
            <p className="flex items-center gap-1.5 text-xs text-rose-500">
              <IconLock size={13} />
              Cần mật khẩu
            </p>
          )}

          {letter.moodTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {letter.moodTags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}
