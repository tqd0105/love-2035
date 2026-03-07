"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad, IconMailOff, IconPencil } from "@tabler/icons-react"
import { useLetters, useCreateLetter, useUpdateLetter, useDeleteLetter } from "@/hooks/useLetters"
import type { LetterSummary } from "@/hooks/useLetters"
import { useCapabilities } from "@/hooks/useCapabilities"
import { Button } from "@/components/ui/button"
import { LetterCard } from "./LetterCard"
import { LetterDetail } from "./LetterDetail"
import { LetterFormDialog } from "./LetterFormDialog"
import { LetterDeleteDialog } from "./LetterDeleteDialog"
import type { LetterFormData } from "./LetterFormDialog"

export function LettersContainer() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editLetter, setEditLetter] = useState<LetterSummary | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { data, isLoading, isError } = useLetters()
  const { can } = useCapabilities()
  const createLetter = useCreateLetter()
  const updateLetter = useUpdateLetter()
  const deleteLetter = useDeleteLetter()

  const canCreate = can("create_letter")
  const canEdit = can("edit_letter")
  const canDelete = can("edit_letter")

  function handleCreate(formData: LetterFormData) {
    createLetter.mutate(formData, {
      onSuccess: () => setFormOpen(false),
    })
  }

  function handleEdit(formData: LetterFormData) {
    if (!editLetter) return
    updateLetter.mutate(
      { id: editLetter.id, ...formData },
      { onSuccess: () => setEditLetter(null) },
    )
  }

  function handleDelete() {
    if (!deleteId) return
    deleteLetter.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    })
  }

  if (isLoading) {
    return (
      <section className="flex min-h-[40vh] items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <IconLoader2 size={32} className="text-rose-400" />
        </motion.div>
      </section>
    )
  }

  if (isError || !data) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMoodSad size={40} className="text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">
          Không thể tải thư. Vui lòng thử lại sau.
        </p>
      </section>
    )
  }

  const writeButton = canCreate && (
    <Button
      onClick={() => setFormOpen(true)}
      className="gap-2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 px-6 text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
    >
      <IconPencil size={18} />
      Write Letter
    </Button>
  )

  const formDialog = canCreate && (
    <LetterFormDialog
      open={formOpen}
      onOpenChange={setFormOpen}
      onSubmit={handleCreate}
      isPending={createLetter.isPending}
    />
  )

  const editDialog = canEdit && (
    <LetterFormDialog
      open={!!editLetter}
      onOpenChange={(open) => { if (!open) setEditLetter(null) }}
      defaultValues={
        editLetter
          ? {
              title: editLetter.title,
              content: "",
              visibility: editLetter.visibility,
              openAt: editLetter.unlockAt
                ? new Date(editLetter.unlockAt).toISOString().slice(0, 16)
                : undefined,
            }
          : undefined
      }
      onSubmit={handleEdit}
      isPending={updateLetter.isPending}
    />
  )

  const deleteDialog = canDelete && (
    <LetterDeleteDialog
      open={!!deleteId}
      onOpenChange={(open) => { if (!open) setDeleteId(null) }}
      onConfirm={handleDelete}
      isPending={deleteLetter.isPending}
    />
  )

  if (data.letters.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMailOff size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có lá thư nào.
        </p>
        {writeButton}
        {formDialog}
        {editDialog}
        {deleteDialog}
      </section>
    )
  }

  /* Show detail view when a letter is selected */
  if (selectedId) {
    return <LetterDetail letterId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <section className="pb-20">
      {canCreate && (
        <div className="mb-8 flex justify-center">
          {writeButton}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.letters.map((letter, i) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            index={i}
            onSelect={setSelectedId}
            canEdit={canEdit}
            canDelete={canDelete}
            onEdit={setEditLetter}
            onDelete={setDeleteId}
          />
        ))}
      </div>
      {formDialog}
      {editDialog}
      {deleteDialog}
    </section>
  )
}
