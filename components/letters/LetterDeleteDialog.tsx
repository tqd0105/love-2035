"use client"

import { IconLoader2 } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LetterDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isPending: boolean
}

export function LetterDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: LetterDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/30 bg-gradient-to-br from-rose-50/95 via-white/95 to-amber-50/95 shadow-xl backdrop-blur-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg">
            Xóa lá thư?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác. Lá thư sẽ bị xóa vĩnh viễn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-full"
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            className="gap-2 rounded-full"
          >
            {isPending && <IconLoader2 size={16} className="animate-spin" />}
            Xóa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
