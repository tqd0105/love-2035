"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const START_DATE = new Date("2022-01-01T00:00:00")

function computeElapsed() {
  const diff = Date.now() - START_DATE.getTime()
  const minutes = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  return { days, hours, minutes }
}

const rows = [
  { key: "days", label: "days" },
  { key: "hours", label: "hours" },
  { key: "minutes", label: "minutes" },
] as const

export function RelationshipCounter() {
  const [elapsed, setElapsed] = useState(computeElapsed)

  useEffect(() => {
    const id = setInterval(() => setElapsed(computeElapsed()), 1_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative flex flex-col items-center justify-center py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400/15 blur-[100px]" />
        <div className="absolute left-1/3 top-1/3 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-500/10 blur-[80px]" />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" as const }}
        className="relative mb-10 text-sm font-medium uppercase tracking-[0.25em] text-rose-400"
      >
        Together for
      </motion.p>

      <div className="relative flex flex-col items-center gap-8">
        {rows.map(({ key, label }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.15 * i,
              ease: "easeOut" as const,
            }}
            className="flex flex-col items-center"
          >
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text font-serif text-5xl font-bold tabular-nums text-transparent sm:text-7xl">
              {elapsed[key].toLocaleString()}
            </span>
            <span className="mt-1 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
