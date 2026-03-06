"use client"

import { motion } from "framer-motion"
import { IconUser } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"

export function CouplePhoto() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="flex justify-center py-12"
    >
      <Card className="w-full max-w-lg overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:justify-center">
          {/* Person A */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-rose-200 to-pink-300">
              <IconUser size={40} className="text-white/80" />
            </div>
            <span className="font-serif text-lg font-medium">Person A</span>
          </div>

          {/* Heart divider */}
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-serif text-3xl text-primary"
          >
            &amp;
          </motion.span>

          {/* Person B */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-pink-200 to-rose-300">
              <IconUser size={40} className="text-white/80" />
            </div>
            <span className="font-serif text-lg font-medium">Person B</span>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  )
}
