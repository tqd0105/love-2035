"use client"

import { motion } from "framer-motion"
import {
  IconHeart,
  IconCoffee,
  IconPlane,
  IconDiamond,
} from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"

const milestones = [
  {
    title: "Lần đầu gặp nhau",
    date: "14/02/2024",
    description: "Một buổi chiều tình cờ, hai ánh mắt giao nhau...",
    icon: IconHeart,
    gradient: "from-rose-400 to-pink-500",
    glow: "bg-rose-400/20",
  },
  {
    title: "Buổi hẹn hò đầu tiên",
    date: "10/03/2024",
    description: "Cà phê, nụ cười, và những câu chuyện không dứt.",
    icon: IconCoffee,
    gradient: "from-pink-400 to-purple-500",
    glow: "bg-pink-400/20",
  },
  {
    title: "Chuyến du lịch đầu tiên",
    date: "15/08/2024",
    description: "Cùng nhau khám phá thế giới, tay trong tay.",
    icon: IconPlane,
    gradient: "from-purple-400 to-indigo-500",
    glow: "bg-purple-400/20",
  },
  {
    title: "Cầu hôn",
    date: "01/06/2035",
    description: "Câu trả lời ngọt ngào nhất: 'Em đồng ý!'",
    icon: IconDiamond,
    gradient: "from-amber-400 to-yellow-500",
    glow: "bg-amber-400/20",
  },
] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
}

export function LoveStory() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
          Hành trình yêu thương
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            Câu chuyện tình yêu
          </span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        className="grid gap-6 sm:grid-cols-2"
      >
        {milestones.map(({ title, date, description, icon: Icon, gradient, glow }) => (
          <motion.div key={title} variants={item}>
            <Card className="group relative overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm">
              {/* Glow effect */}
              <div
                className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${glow} blur-[60px] transition-all duration-500 group-hover:scale-150`}
              />

              <CardContent className="relative flex gap-4 p-6">
                {/* Icon */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
                >
                  <Icon size={24} className="text-white" />
                </div>

                {/* Content */}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">{date}</p>
                  <h3 className="mt-0.5 font-serif text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
