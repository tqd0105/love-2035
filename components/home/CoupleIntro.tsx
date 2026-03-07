"use client"

import { motion } from "framer-motion"
import { IconUser } from "@tabler/icons-react"

const couple = [
  {
    name: "Trần Quang Dũng",
    role: "Anh ấy",
    bio: "Một chàng trai yêu công nghệ, thích viết code và luôn mơ về một tương lai cùng người mình yêu.",
    gradient: "from-rose-300 to-pink-400",
    accent: "from-rose-400 to-pink-500",
  },
  {
    name: "My Love",
    role: "Cô ấy",
    bio: "Nửa còn lại của câu chuyện tình yêu — người khiến mỗi ngày trở nên đặc biệt hơn.",
    gradient: "from-purple-300 to-pink-400",
    accent: "from-purple-400 to-pink-500",
  },
] as const

export function CoupleIntro() {
  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-pink-400">
          Hai nửa yêu thương
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            About Us
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {couple.map((person, i) => (
          <motion.div
            key={person.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" as const }}
            whileHover={{ y: -4 }}
            className="group relative"
          >
            <div
              className={`absolute -inset-2 rounded-3xl bg-gradient-to-br ${person.accent} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-25`}
            />

            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:border-white/60 group-hover:bg-white/80 group-hover:shadow-xl sm:p-10">
              {/* Avatar */}
              <div className="mb-5 flex justify-center">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${person.gradient} shadow-lg ring-4 ring-white/80`}
                >
                  <IconUser size={36} className="text-white/80" />
                </div>
              </div>

              <p className="mb-1 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {person.role}
              </p>
              <h3 className="mb-3 text-center font-serif text-xl font-bold">
                <span className={`bg-gradient-to-r ${person.accent} bg-clip-text text-transparent`}>
                  {person.name}
                </span>
              </h3>
              <p className="text-center text-sm leading-relaxed text-muted-foreground">
                {person.bio}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
