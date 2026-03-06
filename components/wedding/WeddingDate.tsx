"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { IconCalendar, IconMapPin, IconClock } from "@tabler/icons-react"

const WEDDING_DATE = "2035-10-20T10:00:00+07:00"
const WEDDING_VENUE = "Ho Chi Minh City, Vietnam"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(WEDDING_DATE).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const units = [
  { label: "Ngày", gradient: "from-rose-400 to-pink-500" },
  { label: "Giờ", gradient: "from-pink-400 to-purple-500" },
  { label: "Phút", gradient: "from-purple-400 to-indigo-500" },
  { label: "Giây", gradient: "from-amber-400 to-orange-500" },
] as const

export function WeddingEvent() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  const date = new Date(WEDDING_DATE)
  const formatted = date.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    setTimeLeft(calcTimeLeft())
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  const values = timeLeft
    ? [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds]
    : [0, 0, 0, 0]

  return (
    <section className="relative py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-rose-400/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
          Save the Date
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Ngày trọng đại
          </span>
        </h2>
      </motion.div>

      {/* Date & venue card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mb-12 max-w-md rounded-3xl border border-white/20 bg-white/60 p-8 text-center shadow-lg backdrop-blur-sm"
      >
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg shadow-purple-500/25">
          <IconCalendar size={28} className="text-white" />
        </div>
        <p className="mb-2 font-serif text-xl font-semibold text-foreground">
          {formatted}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <IconMapPin size={16} className="text-pink-400" />
          <span>{WEDDING_VENUE}</span>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <IconClock size={16} className="text-purple-400" />
          <span>10:00 AM</span>
        </div>
      </motion.div>

      {/* Countdown */}
      <div className="mx-auto max-w-lg">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6 text-center text-sm font-medium uppercase tracking-[0.2em] text-pink-400"
        >
          Đếm ngược
        </motion.p>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {units.map(({ label, gradient }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              className="group relative"
            >
              {/* Glow behind card */}
              <div
                className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-30`}
              />

              <div className="relative flex flex-col items-center gap-1 rounded-2xl border border-white/30 bg-white/70 p-4 backdrop-blur-sm sm:p-6">
                <span
                  className={`bg-gradient-to-br ${gradient} bg-clip-text font-serif text-3xl font-bold text-transparent sm:text-4xl`}
                >
                  {String(values[i]).padStart(2, "0")}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
