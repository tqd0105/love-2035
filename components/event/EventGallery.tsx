"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconPhoto, IconX } from "@tabler/icons-react"

const placeholderPhotos = [
  { id: 1, gradient: "from-rose-200 to-pink-300" },
  { id: 2, gradient: "from-pink-200 to-purple-300" },
  { id: 3, gradient: "from-purple-200 to-indigo-300" },
  { id: 4, gradient: "from-amber-200 to-orange-300" },
  { id: 5, gradient: "from-rose-200 to-rose-300" },
  { id: 6, gradient: "from-pink-200 to-rose-300" },
] as const

export function EventGallery() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-pink-400">
          Khoảnh khắc
        </p>
        <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Bộ sưu tập ảnh
          </span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {placeholderPhotos.map((photo, i) => (
          <motion.button
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}

            whileHover={{ scale: 1.06, y: -6 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              duration: 0.5,
              delay: i * 0.07,
              ease: "easeOut" as const,
              scale: { type: "spring", stiffness: 260, damping: 20 },
              y: { type: "spring", stiffness: 260, damping: 20 },
            }}
            onClick={() => setSelected(photo.id)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${photo.gradient} transition-transform duration-500 ease-out group-hover:scale-110`}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/15">
              <IconPhoto
                size={28}
                className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            <div className="absolute -inset-px rounded-2xl ring-0 ring-white/0 transition-all duration-500 ease-out group-hover:ring-2 group-hover:ring-pink-300/60 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]" />
          </motion.button>
        ))}
      </div>

      {/* Modal */}
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
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`aspect-square w-full bg-gradient-to-br ${placeholderPhotos.find((p) => p.id === selected)?.gradient ?? "from-rose-200 to-pink-300"}`}
              >
                <div className="flex h-full items-center justify-center">
                  <IconPhoto size={56} className="text-white/50" />
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
