"use client"

import { motion } from "framer-motion"
import { IconCalendar, IconHeart, IconStar } from "@tabler/icons-react"

const START_DATE = "2022-01-01"

function yearsTogether(): number {
  const start = new Date(START_DATE)
  const now = new Date()
  const diff = now.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

const stats = [
  {
    icon: IconCalendar,
    label: "Bắt đầu",
    value: new Date(START_DATE).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    gradient: "from-rose-400 to-pink-500",
    glow: "rose-500/20",
  },
  {
    icon: IconHeart,
    label: "Bên nhau",
    value: `${yearsTogether()} năm`,
    gradient: "from-pink-400 to-purple-500",
    glow: "pink-500/20",
  },
  {
    icon: IconStar,
    label: "Cột mốc tiếp theo",
    value: "Đám cưới 2035",
    gradient: "from-purple-400 to-indigo-500",
    glow: "purple-500/20",
  },
] as const

export function RelationshipInfo() {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
          Con số yêu thương
        </p>
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Hành trình của chúng mình
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {stats.map(({ icon: Icon, label, value, gradient, glow }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" as const }}
            whileHover={{ y: -4 }}
            className="group relative"
          >
            {/* Glow */}
            <div
              className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-30`}
            />

            <div className="relative flex flex-col items-center gap-3 rounded-2xl border border-white/30 bg-white/70 p-6 text-center backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/80 sm:p-8">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-${glow}`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-serif text-lg font-semibold text-foreground">
                  {value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
