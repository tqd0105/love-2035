"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTrash } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAdminMedia, useDeleteMedia } from "@/hooks/useAdminMedia"

export function MediaGrid() {
  const { data, isLoading, error } = useAdminMedia()
  const deleteMedia = useDeleteMedia()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-300 border-t-transparent" />
      </div>
    )
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Failed to load media.
      </p>
    )
  }

  const media = data?.media ?? []

  if (media.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No media uploaded yet.
      </p>
    )
  }

  function handleDelete() {
    if (!confirmId) return
    deleteMedia.mutate(confirmId, { onSettled: () => setConfirmId(null) })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence>
          {media.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="group relative overflow-hidden rounded-lg border border-border/40 bg-muted/30"
            >
              {item.mediaType === "IMAGE" ? (
                <div className="aspect-square">
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center text-xs text-muted-foreground">
                  {item.mediaType}
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="flex justify-end p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-white/20 hover:text-white"
                    onClick={() => setConfirmId(item.id)}
                  >
                    <IconTrash size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 p-2">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.mediaType}
                  </Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete media?</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMedia.isPending}
            >
              {deleteMedia.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
