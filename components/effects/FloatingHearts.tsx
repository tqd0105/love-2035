"use client"

import { motion } from "framer-motion"
import { IconHeart } from "@tabler/icons-react"

const hearts = [
  { left: "8%",  top: "18%", size: 12, delay: 0,   dur: 7   },
  { left: "88%", top: "12%", size: 10, delay: 1.4,  dur: 6.5 },
  { left: "15%", top: "72%", size: 14, delay: 2.2,  dur: 8   },
  { left: "78%", top: "60%", size: 11, delay: 0.6,  dur: 7.5 },
  { left: "45%", top: "8%",  size: 9,  delay: 3,    dur: 6   },
  { left: "92%", top: "40%", size: 10, delay: 1.8,  dur: 7   },
  { left: "30%", top: "85%", size: 13, delay: 0.4,  dur: 8.5 },
  { left: "65%", top: "22%", size: 8,  delay: 2.6,  dur: 6.5 },
]

export function FloatingHearts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-300/30"
          style={{ left: h.left, top: h.top }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration: h.dur,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <IconHeart size={h.size} className="fill-current" />
        </motion.div>
      ))}
    </div>
  )
}
