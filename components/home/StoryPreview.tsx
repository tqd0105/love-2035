"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconHeart, IconCalendar, IconDiamond, IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

const milestones = [
  {
    icon: IconHeart,
    title: "Lần đầu gặp nhau",
    date: "Tháng 1, 2022",
    description: "Một cuộc gặp gỡ tưởng chừng tình cờ nhưng lại là khởi đầu cho tất cả.",
    gradient: "from-rose-400 to-pink-500",
    glow: "rose-500/20",
  },
  {
    icon: IconCalendar,
    title: "Buổi hẹn hò đầu tiên",
    date: "Tháng 2, 2022",
    description: "Ly cà phê đầu tiên, nụ cười đầu tiên — và trái tim bắt đầu rung động.",
    gradient: "from-pink-400 to-purple-500",
    glow: "pink-500/20",
  },
  {
    icon: IconDiamond,
    title: "Lời hẹn ước 2035",
    date: "Tháng 12, 2024",
    description: "Một lời hứa cho tương lai — cùng nhau xây dựng mãi mãi.",
    gradient: "from-purple-400 to-indigo-500",
    glow: "purple-500/20",
  },
] as const

export function StoryPreview() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-purple-400">
          Những cột mốc
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Milestones
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-3">
        {milestones.map(({ icon: Icon, title, date, description, gradient, glow }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" as const }}
            whileHover={{ y: -6 }}
            className="group relative"
          >
            <div
              className={`absolute -inset-1 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25`}
            />

            <div className="relative flex h-full flex-col rounded-2xl border border-white/40 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/80 group-hover:shadow-xl sm:p-7">
              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-${glow}`}
              >
                <Icon size={22} className="text-white" />
              </div>

              <time className="mb-1 text-xs font-medium text-muted-foreground">
                {date}
              </time>
              <h3 className="mb-2 font-serif text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA to full timeline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 flex justify-center"
      >
        <Link href="/timeline">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-pink-300/50 px-6 text-pink-600 hover:bg-pink-50/50"
          >
            Xem toàn bộ timeline
            <IconArrowRight size={16} />
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}
