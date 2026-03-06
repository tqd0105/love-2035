"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

const WEDDING_DATE = "2035-10-20T10:00:00+07:00"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, new Date(WEDDING_DATE).getTime() - Date.now())
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTimeLeft(calcTimeLeft())
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!timeLeft) return null

  const units = [
    { label: "Ngày", value: timeLeft.days },
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ] as const

  return (
    <section className="flex justify-center py-12">
      <div className="w-full max-w-lg text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 font-serif text-2xl font-semibold"
        >
          Đếm ngược
        </motion.h2>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-4 gap-3 sm:gap-4"
        >
          {units.map(({ label, value }) => (
            <motion.div key={label} variants={item}>
              <Card className="border-border/40 bg-card/80 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-1 p-4 sm:p-6">
                  <span className="font-serif text-3xl font-bold text-primary sm:text-4xl">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    {label}
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
