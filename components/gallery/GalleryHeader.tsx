"use client"

import { motion } from "framer-motion"
import { IconCamera } from "@tabler/icons-react"

export function GalleryHeader() {
  return (
    <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-20">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 h-[380px] w-[380px] rounded-full bg-rose-400/15 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 h-[320px] w-[320px] rounded-full bg-purple-400/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/10 blur-3xl" />
      </div>

      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg shadow-pink-500/25"
        >
          <IconCamera size={30} className="text-white" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-pink-400"
        >
          Khoảnh khắc đáng nhớ
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-4 font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 bg-clip-text text-transparent">
            Our Moments
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto max-w-md text-base text-muted-foreground sm:text-lg"
        >
          Những bức ảnh lưu giữ tình yêu qua từng mùa
        </motion.p>
      </div>
    </section>
  )
}
