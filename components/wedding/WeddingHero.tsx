"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconHeart, IconTimeline, IconMessage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { FloatingHearts } from "@/components/effects/FloatingHearts"
import { SparkleParticles } from "@/components/effects/SparkleParticles"

export function WeddingHero() {
  return (
    <section className="relative -mx-4 -mt-8 overflow-hidden sm:-mx-6">
      {/* Aurora gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-300/15 to-purple-400/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-rose-400/20 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-400/15 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/20 blur-[80px]" />

      {/* Romantic particle effects */}
      <FloatingHearts />
      <SparkleParticles />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center px-4 py-28 text-center sm:py-36 lg:py-44">
        {/* Couple photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-60 blur-lg" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-pink-400 ring-4 ring-white/50 sm:h-40 sm:w-40">
              <IconHeart size={48} className="fill-white/90 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-rose-400"
        >
          Together Since 2022
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Story
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-4 max-w-lg text-lg text-muted-foreground sm:text-xl"
        >
          Hai trái tim, một hành trình tuyệt đẹp — được lưu giữ mãi mãi.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link href="/timeline">
            <Button
              size="lg"
              className="gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-8 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30"
            >
              <IconTimeline size={20} />
              Xem Timeline
            </Button>
          </Link>
          <Link href="#guest-actions">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full border-rose-300/50 px-8 text-rose-600 backdrop-blur-sm hover:bg-rose-50/50"
            >
              <IconMessage size={20} />
              Gửi lời chúc
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
