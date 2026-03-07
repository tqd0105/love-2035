"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad, IconPhotoOff, IconUpload } from "@tabler/icons-react"
import { useMedia } from "@/hooks/useMedia"
import { useUploadMedia } from "@/hooks/useUploadMedia"
import { useCapabilities } from "@/hooks/useCapabilities"
import { Button } from "@/components/ui/button"
import { PhotoGrid } from "./PhotoGrid"

export function GalleryContainer() {
  const { data, isLoading, isError } = useMedia()
  const { can } = useCapabilities()
  const { isUploading, progress, error, upload, reset } = useUploadMedia()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canUpload = can("create_media")

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      upload(file)
      e.target.value = ""
    }
  }

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

  const uploadSection = canUpload && (
    <div className="mb-8 flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-6 text-white shadow-lg shadow-pink-500/25 transition-all hover:shadow-xl hover:shadow-pink-500/30"
      >
        {isUploading ? (
          <IconLoader2 size={18} className="animate-spin" />
        ) : (
          <IconUpload size={18} />
        )}
        {isUploading ? `Đang tải... ${progress}%` : "Upload Photo"}
      </Button>

      {isUploading && (
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-pink-100/20">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-400">
          {error}{" "}
          <button onClick={reset} className="underline hover:text-red-300">
            Thử lại
          </button>
        </p>
      )}
    </div>
  )

  if (images.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        {uploadSection}
        <IconPhotoOff size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có ảnh nào được tải lên.
        </p>
      </section>
    )
  }

  return (
    <section className="pb-20">
      {uploadSection}
      <PhotoGrid media={images} />
    </section>
  )
}
