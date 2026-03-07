"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad, IconPencil } from "@tabler/icons-react"
import { useEvent } from "@/hooks/useEvent"
import { useUpdateEvent } from "@/hooks/useAdminEvents"
import { useCapabilities } from "@/hooks/useCapabilities"
import { EventHeader } from "@/components/event/EventHeader"
import { EventStory } from "@/components/event/EventStory"
import { EventGallery } from "@/components/event/EventGallery"
import { EventNavigation } from "@/components/event/EventNavigation"
import { EventFormDialog } from "@/components/timeline/EventFormDialog"
import { Button } from "@/components/ui/button"
import type { EventFormData } from "@/components/timeline/TimelineContainer"

export function EventDetailView() {
  const params = useParams<{ id: string }>()
  const { data, isLoading, isError } = useEvent(params.id)
  const { can } = useCapabilities()
  const updateEvent = useUpdateEvent()
  const [editOpen, setEditOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-pink-400" />
        </motion.div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể tải sự kiện. Vui lòng thử lại sau.
        </p>
        <EventNavigation />
      </div>
    )
  }

  const { event } = data
  const canEdit = can("edit_event")

  function handleEdit(formData: EventFormData) {
    updateEvent.mutate(
      {
        id: event.id,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: new Date(formData.date).toISOString(),
      },
      { onSuccess: () => setEditOpen(false) },
    )
  }

  return (
    <div className="flex flex-col">
      <EventHeader event={event} />

      {canEdit && (
        <div className="flex justify-center py-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => setEditOpen(true)}
          >
            <IconPencil size={16} className="mr-1.5" />
            Edit Event
          </Button>
        </div>
      )}

      <EventStory description={event.description} />
      <EventGallery />
      <EventNavigation />

      {canEdit && (
        <EventFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          title="Edit Event"
          defaultValues={{
            title: event.title,
            description: event.description ?? "",
            eventType: event.eventType,
            date: new Date(event.date).toISOString().slice(0, 10),
            visibility: event.visibility,
          }}
          onSubmit={handleEdit}
          isPending={updateEvent.isPending}
        />
      )}
    </div>
  )
}
