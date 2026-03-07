"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconHeart, IconTimeline, IconHeartHandshake } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { FloatingHearts } from "@/components/effects/FloatingHearts"
import { SparkleParticles } from "@/components/effects/SparkleParticles"

export function HomeHero() {
  return (
    <section className="relative -mx-4 -mt-8 overflow-hidden sm:-mx-6">
      {/* Aurora background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 via-pink-300/15 to-purple-400/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-rose-400/20 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-400/15 blur-[120px]" />
      <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/20 blur-3xl" />

      {/* Particle effects */}
      <FloatingHearts />
      <SparkleParticles />

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center px-4 py-32 text-center sm:py-40 lg:py-48">
        {/* Couple photo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="mb-10"
        >
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 opacity-50 blur-xl" />
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-rose-300 to-pink-400 ring-4 ring-white/60 sm:h-44 sm:w-44">
              <IconHeart size={52} className="fill-white/90 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-rose-400"
        >
          Since 2022
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="font-serif text-5xl font-bold tracking-tight sm:text-6xl lg:text-8xl"
        >
          <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
            Our Love Story
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-5 max-w-lg text-lg text-muted-foreground sm:text-xl"
        >
          Hai trái tim, một hành trình — mỗi khoảnh khắc đều là mãi mãi.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Link href="/wedding">
            <Button
              size="lg"
              className="gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-8 text-white shadow-lg shadow-rose-500/25 transition-shadow hover:shadow-xl hover:shadow-rose-500/30"
            >
              <IconHeartHandshake size={20} />
              Enter Wedding Portal
            </Button>
          </Link>
          <Link href="/timeline">
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full border-rose-300/50 px-8 text-rose-600 backdrop-blur-sm hover:bg-rose-50/50"
            >
              <IconTimeline size={20} />
              View Timeline
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
