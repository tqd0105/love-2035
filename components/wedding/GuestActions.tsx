"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconMessage, IconCamera, IconHeart } from "@tabler/icons-react"

const actions = [
  {
    href: "/wishes",
    icon: IconMessage,
    label: "Gửi lời chúc",
    description: "Viết những lời yêu thương",
    gradient: "from-rose-400 to-pink-500",
    glow: "rose-500/30",
  },
  {
    href: "/upload",
    icon: IconCamera,
    label: "Chia sẻ ảnh",
    description: "Lưu giữ khoảnh khắc",
    gradient: "from-pink-400 to-purple-500",
    glow: "pink-500/30",
  },
  {
    href: "/timeline",
    icon: IconHeart,
    label: "Xem Timeline",
    description: "Hành trình tình yêu",
    gradient: "from-purple-400 to-indigo-500",
    glow: "purple-500/30",
  },
] as const

export function GuestActions() {
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
          Cùng tham gia
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            Gửi yêu thương
          </span>
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
        {actions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link href={action.href} className="group block">
              <div className="relative overflow-hidden rounded-3xl">
                {/* Glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br ${action.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40`}
                />

                <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/30 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/80">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg shadow-${action.glow} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <action.icon size={28} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="mb-1 font-serif text-lg font-semibold">
                      {action.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
