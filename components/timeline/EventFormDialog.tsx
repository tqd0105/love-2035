"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import type { EventFormData } from "./TimelineContainer"

const EVENT_TYPES = ["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"] as const
const VISIBILITIES = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"] as const

const emptyForm: EventFormData = {
  title: "",
  description: "",
  eventType: "CUSTOM",
  date: new Date().toISOString().slice(0, 10),
  visibility: "PUBLIC",
}

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  defaultValues?: EventFormData
  onSubmit: (data: EventFormData) => void
  isPending: boolean
}

export function EventFormDialog({
  open,
  onOpenChange,
  title,
  defaultValues,
  onSubmit,
  isPending,
}: EventFormDialogProps) {
  const [form, setForm] = useState<EventFormData>(defaultValues ?? emptyForm)

  useEffect(() => {
    if (open) {
      setForm(defaultValues ?? emptyForm)
    }
  }, [open, defaultValues])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Update the event details below."
              : "Fill in the details to create a new event."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="event-title">Title</Label>
            <Input
              id="event-title"
              placeholder="Event title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Optional description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-date">Date</Label>
            <Input
              id="event-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Event Type</Label>
            <Select
              value={form.eventType}
              onValueChange={(v) => setForm({ ...form, eventType: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Visibility</Label>
            <Select
              value={form.visibility}
              onValueChange={(v) => setForm({ ...form, visibility: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VISIBILITIES.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={isPending || !form.title.trim()}
          >
            {isPending
              ? "Saving…"
              : defaultValues
                ? "Save Changes"
                : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
