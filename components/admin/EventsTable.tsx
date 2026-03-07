"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconPlus, IconPencil, IconTrash } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  useAdminEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  type AdminEvent,
  type CreateEventInput,
} from "@/hooks/useAdminEvents"

const EVENT_TYPES = ["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"] as const
const VISIBILITIES = ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"] as const

const visibilityVariant: Record<string, "default" | "secondary" | "outline"> = {
  PUBLIC: "default",
  APPROVED_GUEST: "secondary",
  COUPLE: "outline",
  PASSWORD_LOCKED: "outline",
}

function toDateInputValue(iso: string) {
  return new Date(iso).toISOString().slice(0, 10)
}

const emptyForm: CreateEventInput = {
  title: "",
  description: "",
  eventType: "CUSTOM",
  date: new Date().toISOString().slice(0, 10),
  visibility: "PUBLIC",
}

export function EventsTable() {
  const { data, isLoading, error } = useAdminEvents()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null)
  const [form, setForm] = useState<CreateEventInput>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

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
        Failed to load events.
      </p>
    )
  }

  const events = data?.events ?? []

  function openCreate() {
    setEditingEvent(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(event: AdminEvent) {
    setEditingEvent(event)
    setForm({
      title: event.title,
      description: event.description ?? "",
      eventType: event.eventType,
      date: toDateInputValue(event.date),
      visibility: event.visibility,
    })
    setFormOpen(true)
  }

  function handleSubmit() {
    if (!form.title.trim()) return

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description?.trim() || undefined,
      date: new Date(form.date).toISOString(),
    }

    if (editingEvent) {
      updateEvent.mutate(
        { id: editingEvent.id, ...payload },
        { onSuccess: () => setFormOpen(false) },
      )
    } else {
      createEvent.mutate(payload, {
        onSuccess: () => setFormOpen(false),
      })
    }
  }

  function handleDelete() {
    if (!deleteId) return
    deleteEvent.mutate(deleteId, { onSettled: () => setDeleteId(null) })
  }

  const isMutating =
    createEvent.isPending || updateEvent.isPending || deleteEvent.isPending

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <IconPlus size={16} className="mr-1.5" />
          Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No events yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {events.map((event) => (
                  <motion.tr
                    key={event.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-border/30 last:border-0"
                  >
                    <TableCell className="font-medium">
                      {event.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          visibilityVariant[event.visibility] ?? "outline"
                        }
                      >
                        {event.visibility}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => openEdit(event)}
                        >
                          <IconPencil size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-700"
                          onClick={() => setDeleteId(event.id)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={formOpen}
        onOpenChange={(open) => !open && setFormOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEvent ? "Edit Event" : "Create Event"}
            </DialogTitle>
            <DialogDescription>
              {editingEvent
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
                value={form.description ?? ""}
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
              onClick={() => setFormOpen(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating}>
              {isMutating
                ? "Saving…"
                : editingEvent
                  ? "Save Changes"
                  : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteEvent.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
