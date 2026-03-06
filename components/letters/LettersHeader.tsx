"use client"

import { motion } from "framer-motion"
import { IconMail } from "@tabler/icons-react"

export function LettersHeader() {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-[380px] w-[380px] rounded-full bg-rose-400/15 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[320px] w-[320px] rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl" />
      </div>

      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-amber-500 shadow-lg shadow-rose-500/25"
        >
          <IconMail size={30} className="text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-rose-400"
        >
          Từ trái tim
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-4 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
            Love Letters
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto max-w-md text-base text-muted-foreground sm:text-lg"
        >
          Những khoảnh khắc được gói ghém trong từng con chữ
        </motion.p>
      </div>
    </section>
  )
}
