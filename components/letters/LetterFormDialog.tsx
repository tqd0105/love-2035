"use client"

import { useState, useEffect } from "react"
import { IconLoader2 } from "@tabler/icons-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const VISIBILITIES = [
  { value: "PUBLIC", label: "Công khai" },
  { value: "APPROVED_GUEST", label: "Khách được duyệt" },
  { value: "COUPLE", label: "Chỉ đôi mình" },
  { value: "PASSWORD_LOCKED", label: "Khóa mật khẩu" },
] as const

export interface LetterFormData {
  title: string
  content: string
  visibility: string
  openAt?: string
}

interface LetterFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  defaultValues?: LetterFormData
  onSubmit: (data: LetterFormData) => void
  isPending: boolean
}

export function LetterFormDialog({
  open,
  onOpenChange,
  title: dialogTitle,
  defaultValues,
  onSubmit,
  isPending,
}: LetterFormDialogProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState("COUPLE")
  const [openAt, setOpenAt] = useState("")

  const isEdit = !!defaultValues

  useEffect(() => {
    if (open && defaultValues) {
      setTitle(defaultValues.title)
      setContent(defaultValues.content)
      setVisibility(defaultValues.visibility)
      setOpenAt(defaultValues.openAt ?? "")
    }
  }, [open, defaultValues])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      visibility,
      openAt: openAt || undefined,
    })
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      setTitle("")
      setContent("")
      setVisibility("COUPLE")
      setOpenAt("")
    }
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg border-white/30 bg-gradient-to-br from-rose-50/95 via-white/95 to-amber-50/95 shadow-xl backdrop-blur-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
              {dialogTitle ?? (isEdit ? "Chỉnh sửa lá thư" : "Viết lá thư mới")}
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="letter-title">Tiêu đề</Label>
            <Input
              id="letter-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tiêu đề lá thư..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter-content">Nội dung</Label>
            <Textarea
              id="letter-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết những lời yêu thương..."
              rows={8}
              required
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Hiển thị</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITIES.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="letter-openAt">Mở vào ngày (tùy chọn)</Label>
            <Input
              id="letter-openAt"
              type="datetime-local"
              value={openAt}
              onChange={(e) => setOpenAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Để trống nếu muốn đọc ngay. Chọn ngày trong tương lai để khóa thư.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              className="rounded-full"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || !title.trim() || !content.trim()}
              className="gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl"
            >
              {isPending && <IconLoader2 size={16} className="animate-spin" />}
              {isEdit ? "Lưu" : "Gửi thư"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
