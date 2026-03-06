"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconPhoto, IconX } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import type { MediaItem } from "@/hooks/useMedia"

/* ── Placeholder gradient palette (until real images) ── */
const gradients = [
  "from-rose-200 to-pink-300",
  "from-pink-200 to-purple-300",
  "from-purple-200 to-indigo-300",
  "from-amber-200 to-orange-300",
  "from-rose-300 to-rose-400",
  "from-pink-300 to-rose-400",
  "from-indigo-200 to-purple-300",
  "from-orange-200 to-amber-300",
] as const

interface PhotoGridProps {
  media: MediaItem[]
}

export function PhotoGrid({ media }: PhotoGridProps) {
  const [selected, setSelected] = useState<MediaItem | null>(null)

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {media.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}

            whileHover={{ scale: 1.06, y: -6 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              duration: 0.5,
              delay: (i % 8) * 0.06,
              ease: "easeOut" as const,
              scale: { type: "spring", stiffness: 260, damping: 20 },
              y: { type: "spring", stiffness: 260, damping: 20 },
            }}
            onClick={() => setSelected(item)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl"
          >
            {/* Placeholder gradient — replace with <Image> when real urls */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} transition-transform duration-500 ease-out group-hover:scale-110`}
            />

            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/15">
              <IconPhoto
                size={28}
                className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>

            {/* Soft glow ring on hover */}
            <div className="absolute -inset-px rounded-2xl ring-0 ring-white/0 transition-all duration-500 ease-out group-hover:ring-2 group-hover:ring-pink-300/60 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]" />
          </motion.button>
        ))}
      </div>

      {/* Dialog modal */}
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null)
        }}
      >
        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Photo preview</DialogTitle>

          {selected && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="relative overflow-hidden rounded-3xl"
            >
              {/* Placeholder — replace with <Image> when real urls */}
              <div
                className={`aspect-square w-full bg-gradient-to-br ${gradients[media.indexOf(selected) % gradients.length]}`}
              >
                <div className="flex h-full items-center justify-center">
                  <IconPhoto size={64} className="text-white/50" />
                </div>
              </div>

              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                <p className="text-sm text-white/80">
                  {selected.mediaType === "IMAGE" ? "Ảnh" : selected.mediaType === "VIDEO" ? "Video" : "Âm thanh"}
                </p>
              </div>

              <DialogClose asChild>
                <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60">
                  <IconX size={18} />
                </button>
              </DialogClose>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
