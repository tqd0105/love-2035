"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconPhoto, IconX } from "@tabler/icons-react"

const photos = [
  { id: 1, alt: "Kỷ niệm 1", color: "from-rose-300 to-pink-400" },
  { id: 2, alt: "Kỷ niệm 2", color: "from-pink-300 to-purple-400" },
  { id: 3, alt: "Kỷ niệm 3", color: "from-purple-300 to-indigo-400" },
  { id: 4, alt: "Kỷ niệm 4", color: "from-amber-300 to-orange-400" },
  { id: 5, alt: "Kỷ niệm 5", color: "from-rose-300 to-rose-400" },
  { id: 6, alt: "Kỷ niệm 6", color: "from-pink-300 to-rose-400" },
] as const

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
}

export function PhotoHighlights() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-pink-400">
          Khoảnh khắc đẹp
        </p>
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Bộ sưu tập ảnh
          </span>
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        {photos.map((photo) => (
          <motion.button
            key={photo.id}
            variants={item}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(photo.id)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
          >
            {/* Placeholder gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${photo.color}`}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
              <IconPhoto
                size={32}
                className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-2xl ring-0 ring-white/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-white/40" />
          </motion.button>
        ))}
      </motion.div>

      {/* Modal preview */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Placeholder for actual image */}
              <div
                className={`aspect-square w-full bg-gradient-to-br ${photos.find((p) => p.id === selected)?.color ?? "from-rose-300 to-pink-400"}`}
              >
                <div className="flex h-full items-center justify-center">
                  <IconPhoto size={64} className="text-white/60" />
                </div>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <IconX size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
