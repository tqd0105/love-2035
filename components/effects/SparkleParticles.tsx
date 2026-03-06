"use client"

import { motion } from "framer-motion"

const sparkles = [
  { left: "12%", top: "25%", delay: 0,   dur: 4   },
  { left: "82%", top: "18%", delay: 1.2, dur: 3.5 },
  { left: "25%", top: "65%", delay: 2,   dur: 4.5 },
  { left: "70%", top: "55%", delay: 0.5, dur: 3.8 },
  { left: "55%", top: "12%", delay: 2.8, dur: 4.2 },
  { left: "90%", top: "35%", delay: 1.6, dur: 3.6 },
  { left: "38%", top: "80%", delay: 0.8, dur: 4   },
  { left: "60%", top: "72%", delay: 3.2, dur: 3.4 },
  { left: "5%",  top: "50%", delay: 1,   dur: 4.4 },
  { left: "48%", top: "38%", delay: 2.4, dur: 3.2 },
]

export function SparkleParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ left: s.left, top: s.top }}
          animate={{
            opacity: [0, 0.7, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}
