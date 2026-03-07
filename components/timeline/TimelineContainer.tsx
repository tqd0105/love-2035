"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconMoodSad, IconLoader2, IconPlus } from "@tabler/icons-react"
import { useTimeline } from "@/hooks/useTimeline"
import { useCapabilities } from "@/hooks/useCapabilities"
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/useAdminEvents"
import { TimelineEventCard } from "./TimelineEventCard"
import { EventFormDialog } from "./EventFormDialog"
import { EventDeleteDialog } from "./EventDeleteDialog"
import { Button } from "@/components/ui/button"

export interface EventFormData {
  title: string
  description: string
  eventType: string
  date: string
  visibility: string
}

export function TimelineContainer() {
  const { data, isLoading, isError } = useTimeline()
  const { can } = useCapabilities()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  const [createOpen, setCreateOpen] = useState(false)
  const [editEvent, setEditEvent] = useState<{ id: string } & EventFormData | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const canCreate = can("create_event")
  const canEdit = can("edit_event")
  const canDelete = can("delete_event")

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
          Không thể tải timeline. Vui lòng thử lại sau.
        </p>
      </section>
    )
  }

  const events = data.events

  if (events.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          Chưa có sự kiện nào trong timeline.
        </p>
      </section>
    )
  }

  function handleCreate(formData: EventFormData) {
    createEvent.mutate(
      {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: new Date(formData.date).toISOString(),
      },
      { onSuccess: () => setCreateOpen(false) },
    )
  }

  function handleEdit(formData: EventFormData) {
    if (!editEvent) return
    updateEvent.mutate(
      {
        id: editEvent.id,
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: new Date(formData.date).toISOString(),
      },
      { onSuccess: () => setEditEvent(null) },
    )
  }

  function handleDelete() {
    if (!deleteId) return
    deleteEvent.mutate(deleteId, { onSettled: () => setDeleteId(null) })
  }

  return (
    <section className="relative py-12">
      {canCreate && (
        <div className="mb-8 flex justify-center">
          <Button
            onClick={() => setCreateOpen(true)}
            className="rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 shadow-lg shadow-rose-500/25 hover:from-rose-600 hover:to-pink-600"
          >
            <IconPlus size={18} className="mr-1.5" />
            Add Event
          </Button>
        </div>
      )}

      {/* Central vertical line — md+ */}
      <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-pink-300/30 to-transparent md:block" />

      <div className="flex flex-col gap-12 md:gap-16">
        {events.map((event, i) => (
          <TimelineEventCard
            key={event.id}
            event={event}
            index={i}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={() =>
              setEditEvent({
                id: event.eventId ?? event.id,
                title: event.title,
                description: event.description ?? "",
                eventType: "CUSTOM",
                date: new Date(event.date).toISOString().slice(0, 10),
                visibility: event.visibility,
              })
            }
            onDelete={() => setDeleteId(event.eventId ?? event.id)}
          />
        ))}
      </div>

      {/* End flourish */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 flex justify-center"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-lg shadow-rose-500/25">
          <span className="text-sm text-white">♥</span>
        </div>
      </motion.div>

      {/* Create Dialog */}
      <EventFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add Event"
        onSubmit={handleCreate}
        isPending={createEvent.isPending}
      />

      {/* Edit Dialog */}
      <EventFormDialog
        open={!!editEvent}
        onOpenChange={(open) => !open && setEditEvent(null)}
        title="Edit Event"
        defaultValues={editEvent ?? undefined}
        onSubmit={handleEdit}
        isPending={updateEvent.isPending}
      />

      {/* Delete Dialog */}
      <EventDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={deleteEvent.isPending}
      />
    </section>
  )
}
