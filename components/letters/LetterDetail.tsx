"use client"

import { motion } from "framer-motion"
import { IconArrowLeft, IconCalendar, IconLoader2, IconMoodSad } from "@tabler/icons-react"
import { useLetter } from "@/hooks/useLetters"

interface LetterDetailProps {
  letterId: string
  onBack: () => void
}

export function LetterDetail({ letterId, onBack }: LetterDetailProps) {
  const { data, isLoading, isError } = useLetter(letterId)

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-rose-400" />
        </motion.div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể mở lá thư này. Vui lòng thử lại sau.
        </p>
        <button
          onClick={onBack}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-rose-500 hover:text-rose-600"
        >
          <IconArrowLeft size={16} />
          Quay lại
        </button>
      </div>
    )
  }

  const { letter } = data
  const formatted = new Date(letter.createdAt).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="pb-20">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-5 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-rose-300/50 hover:bg-white/90 hover:shadow-md"
        >
          <IconArrowLeft
            size={16}
            className="text-rose-400 transition-transform duration-300 group-hover:-translate-x-1"
          />
          Tất cả lá thư
        </button>
      </motion.div>

      {/* Letter content */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-2xl"
      >
        <div className="overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-rose-50/80 via-white/90 to-amber-50/80 shadow-xl backdrop-blur-sm">
          {/* Header */}
          <div className="border-b border-white/40 px-8 py-8 text-center sm:px-10 sm:py-10">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-3 font-serif text-3xl font-bold sm:text-4xl"
            >
              <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                {letter.title}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <IconCalendar size={15} className="text-rose-400" />
              <time>{formatted}</time>
            </motion.div>

            {letter.moodTags.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mt-4 flex flex-wrap justify-center gap-2"
              >
                {letter.moodTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-rose-100/60 px-3 py-1 text-xs font-medium text-rose-600"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="px-8 py-8 sm:px-10 sm:py-10"
          >
            <div className="space-y-4 text-center font-serif text-base leading-relaxed text-foreground/85 sm:text-lg sm:leading-relaxed">
              {letter.content.split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.article>
    </div>
  )
}
