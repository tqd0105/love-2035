"use client"

import { useState } from "react"
import { IconLoader2, IconCheck } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateWish } from "@/hooks/useWeddingWishes"

interface WishFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WishFormDialog({ open, onOpenChange }: WishFormDialogProps) {
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const createWish = useCreateWish()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    createWish.mutate(
      { name: name.trim(), message: message.trim() },
      {
        onSuccess: () => {
          setSent(true)
          setTimeout(() => {
            onOpenChange(false)
            setSent(false)
            setName("")
            setMessage("")
          }, 1500)
        },
      },
    )
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setName("")
      setMessage("")
      setSent(false)
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md border-white/30 bg-gradient-to-br from-rose-50/95 via-white/95 to-purple-50/95 shadow-xl backdrop-blur-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            <span className="bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              Gửi lời chúc
            </span>
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <IconCheck size={28} className="text-white" />
            </div>
            <p className="font-serif text-lg font-medium text-foreground">
              Cảm ơn bạn!
            </p>
            <p className="text-sm text-muted-foreground">
              Lời chúc đã được gửi thành công.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wish-name">Tên của bạn</Label>
              <Input
                id="wish-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wish-message">Lời chúc</Label>
              <Textarea
                id="wish-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Viết lời chúc phúc cho đôi uyên&nbsp;ương..."
                rows={5}
                required
                className="resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={createWish.isPending}
                className="rounded-full"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createWish.isPending || !name.trim() || !message.trim()}
                className="gap-2 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl"
              >
                {createWish.isPending && (
                  <IconLoader2 size={16} className="animate-spin" />
                )}
                Gửi lời chúc
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
