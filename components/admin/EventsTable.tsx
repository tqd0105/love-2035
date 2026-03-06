"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTrash } from "@tabler/icons-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAdminEvents, useDeleteEvent } from "@/hooks/useAdminEvents"

const visibilityVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PUBLIC: "default",
  APPROVED_GUEST: "secondary",
  COUPLE: "outline",
  PASSWORD_LOCKED: "destructive",
}

export function EventsTable() {
  const { data, isLoading, error } = useAdminEvents()
  const deleteEvent = useDeleteEvent()
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
        Failed to load events.
      </p>
    )
  }

  const events = data?.events ?? []

  if (events.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No events yet.
      </p>
    )
  }

  function handleDelete() {
    if (!confirmId) return
    deleteEvent.mutate(confirmId, { onSettled: () => setConfirmId(null) })
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="w-16" />
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
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge variant={visibilityVariant[event.visibility] ?? "outline"}>
                      {event.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setConfirmId(event.id)}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!confirmId} onOpenChange={() => setConfirmId(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete event?</DialogTitle>
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
