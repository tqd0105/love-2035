"use client"

import { type ReactNode } from "react"
import { motion } from "framer-motion"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Delay in seconds before animation starts */
  delay?: number
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut" as const,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
