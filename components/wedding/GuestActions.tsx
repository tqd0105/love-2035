"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { IconMessage, IconCamera, IconHeart, IconLogin, IconUserPlus } from "@tabler/icons-react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { WishFormDialog } from "./WishFormDialog"

export function GuestActions() {
  const { user } = useAuth()
  const [wishOpen, setWishOpen] = useState(false)
  const isLoggedIn = !!user

  return (
    <section id="guest-actions" className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
          Cùng tham gia
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
            Gửi yêu thương
          </span>
        </h2>
      </motion.div>

      {isLoggedIn ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
            {/* Gửi lời chúc — opens dialog */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            >
              <button onClick={() => setWishOpen(true)} className="group block w-full text-left">
                <ActionCard
                  icon={IconMessage}
                  label="Gửi lời chúc"
                  description="Viết những lời yêu thương"
                  gradient="from-rose-400 to-pink-500"
                  glow="rose-500/30"
                />
              </button>
            </motion.div>

            {/* Chia sẻ ảnh — links to gallery */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link href="/gallery" className="group block">
                <ActionCard
                  icon={IconCamera}
                  label="Chia sẻ ảnh"
                  description="Lưu giữ khoảnh khắc"
                  gradient="from-pink-400 to-purple-500"
                  glow="pink-500/30"
                />
              </Link>
            </motion.div>

            {/* Xem Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/timeline" className="group block">
                <ActionCard
                  icon={IconHeart}
                  label="Xem Timeline"
                  description="Hành trình tình yêu"
                  gradient="from-purple-400 to-indigo-500"
                  glow="purple-500/30"
                />
              </Link>
            </motion.div>
          </div>

          <WishFormDialog open={wishOpen} onOpenChange={setWishOpen} />
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5  }}
          className="mx-auto max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/70 p-8 text-center backdrop-blur-sm">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-400/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-400/10 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-purple-500 shadow-lg shadow-rose-500/25">
                <IconHeart size={28} className="fill-white text-white" />
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                Tham gia cùng chúng mình!
              </h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Đăng nhập để gửi lời chúc, chia sẻ ảnh và xem những khoảnh khắc đáng nhớ.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link href="/login">
                  <Button className="w-full gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 px-6 text-white shadow-lg shadow-rose-500/25 sm:w-auto">
                    <IconLogin size={18} />
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/request-access">
                  <Button
                    variant="outline"
                    className="w-full gap-2 rounded-full border-rose-300/50 px-6 text-rose-600 hover:bg-rose-50/50 sm:w-auto"
                  >
                    <IconUserPlus size={18} />
                    Đăng ký tham dự
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  )
}

function ActionCard({
  icon: Icon,
  label,
  description,
  gradient,
  glow,
}: {
  icon: React.ComponentType<{ size: number; className?: string }>
  label: string
  description: string
  gradient: string
  glow: string
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div
        className={`absolute -inset-1 bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40`}
      />
      <div className="relative flex flex-col items-center gap-4 rounded-3xl border border-white/30 bg-white/70 p-8 backdrop-blur-sm transition-all duration-300 group-hover:border-white/50 group-hover:bg-white/80">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg shadow-${glow} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon size={28} className="text-white" />
        </div>
        <div className="text-center">
          <p className="mb-1 font-serif text-lg font-semibold">{label}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
