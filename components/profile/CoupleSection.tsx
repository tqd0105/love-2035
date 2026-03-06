"use client"

import { motion } from "framer-motion"
import { IconUser } from "@tabler/icons-react"

interface PersonCardProps {
  name: string
  bio: string
  gradient: string
  accentGradient: string
  delay: number
}

function PersonCard({ name, bio, gradient, accentGradient, delay }: PersonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: "easeOut" as const }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* Glow */}
      <div
        className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${accentGradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30`}
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/80 group-hover:shadow-xl sm:p-10">
        {/* Avatar placeholder */}
        <div className="mb-6 flex justify-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${gradient} shadow-lg ring-4 ring-white/80`}
          >
            <IconUser size={40} className="text-white/80" />
          </div>
        </div>

        {/* Name */}
        <h3 className="mb-3 text-center font-serif text-2xl font-bold">
          <span className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
            {name}
          </span>
        </h3>

        {/* Bio */}
        <p className="text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {bio}
        </p>
      </div>
    </motion.div>
  )
}

export function CoupleSection() {
  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-pink-400">
          Hai nửa yêu thương
        </p>
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
          <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            Đôi mình
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        <PersonCard
          name="Trần Quang Dũng"
          bio="Một chàng trai yêu công nghệ, thích viết code và luôn mơ về một tương lai cùng người mình yêu 💕"
          gradient="from-rose-300 to-pink-400"
          accentGradient="from-rose-400 to-pink-500"
          delay={0}
        />
        <PersonCard
          name="My Love"
          bio="Nửa còn lại của câu chuyện tình yêu — người khiến mỗi ngày trở nên đặc biệt hơn ✨"
          gradient="from-purple-300 to-pink-400"
          accentGradient="from-purple-400 to-pink-500"
          delay={0.12}
        />
      </div>
    </section>
  )
}
