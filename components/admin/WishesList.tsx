"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTrash } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAdminWishes, useDeleteWish } from "@/hooks/useAdminWishes"

export function WishesList() {
  const { data, isLoading, error } = useAdminWishes()
  const deleteWish = useDeleteWish()
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
        Failed to load wishes.
      </p>
    )
  }

  const wishes = data?.wishes ?? []

  if (wishes.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No guest wishes yet.
      </p>
    )
  }

  function handleDelete() {
    if (!confirmId) return
    deleteWish.mutate(confirmId, { onSettled: () => setConfirmId(null) })
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {wishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-border/40">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{wish.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(wish.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {wish.message}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setConfirmId(wish.id)}
                  >
                    <IconTrash size={16} />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove wish?</DialogTitle>
            <DialogDescription>
              This will permanently remove this guest message.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteWish.isPending}
            >
              {deleteWish.isPending ? "Removing…" : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
