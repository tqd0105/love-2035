"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { IconArrowLeft } from "@tabler/icons-react"

export function EventNavigation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex justify-center py-12"
    >
      <Link
        href="/timeline"
        className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/70 px-6 py-3 text-sm font-medium text-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:border-pink-300/50 hover:bg-white/90 hover:shadow-lg"
      >
        <IconArrowLeft
          size={18}
          className="text-pink-400 transition-transform duration-300 group-hover:-translate-x-1"
        />
        Quay lại Timeline
      </Link>
    </motion.div>
  )
}
