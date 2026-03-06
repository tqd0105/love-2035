"use client"

import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad, IconPhotoOff } from "@tabler/icons-react"
import { useMedia } from "@/hooks/useMedia"
import { PhotoGrid } from "./PhotoGrid"

export function GalleryContainer() {
  const { data, isLoading, isError } = useMedia()

  if (isLoading) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-pink-400" />
        </motion.div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể tải ảnh. Vui lòng thử lại sau.
        </p>
      </section>
    )
  }

  const images = data.media.filter((m) => m.mediaType === "IMAGE")

  if (images.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconPhotoOff size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có ảnh nào được tải lên.
        </p>
      </section>
    )
  }

  return (
    <section className="pb-20">
      <PhotoGrid media={images} />
    </section>
  )
}
