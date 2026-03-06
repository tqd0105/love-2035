"use client"

import { motion } from "framer-motion"
import { IconHeart } from "@tabler/icons-react"
import { FloatingHearts } from "@/components/effects/FloatingHearts"
import { SparkleParticles } from "@/components/effects/SparkleParticles"

export function TimelineIntro() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-24">
      {/* Romantic particle effects */}
      <FloatingHearts />
      <SparkleParticles />

      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-rose-400/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-purple-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl" />
      </div>

      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/25"
        >
          <IconHeart size={32} className="text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-pink-400"
        >
          Together since 2022
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mb-4 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Journey
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mx-auto max-w-md text-base text-muted-foreground sm:text-lg"
        >
          Mỗi khoảnh khắc bên nhau đều là một trang truyện đáng nhớ
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto h-10 w-6 rounded-full border-2 border-pink-300/50"
          >
            <motion.div
              animate={{ y: [2, 16, 2] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto mt-1 h-2 w-1.5 rounded-full bg-pink-400/60"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
