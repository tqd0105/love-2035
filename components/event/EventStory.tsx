"use client"

import { motion } from "framer-motion"

interface EventStoryProps {
  description: string | null
}

export function EventStory({ description }: EventStoryProps) {
  if (!description) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-white/30 bg-white/60 p-8 shadow-lg backdrop-blur-sm sm:p-10">
          <h2 className="mb-6 text-center font-serif text-2xl font-semibold sm:text-3xl">
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Câu chuyện
            </span>
          </h2>

          <div className="space-y-4 text-center text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
