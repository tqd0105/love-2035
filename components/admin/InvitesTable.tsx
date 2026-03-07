"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconTrash, IconCopy, IconCheck, IconPlus } from "@tabler/icons-react"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  useAdminInvites,
  useCreateInvite,
  useDeleteInvite,
  type AdminInvite,
} from "@/hooks/useAdminInvites"

function getInviteStatus(invite: AdminInvite) {
  if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) return "EXPIRED"
  if (invite.usedCount >= invite.maxUses) return "USED"
  return "ACTIVE"
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  USED: "secondary",
  EXPIRED: "destructive",
}

export function InvitesTable() {
  const { data, isLoading, error } = useAdminInvites()
  const createInvite = useCreateInvite()
  const deleteInvite = useDeleteInvite()

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [maxUses, setMaxUses] = useState("1")
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

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
        Failed to load invites.
      </p>
    )
  }

  const invites = data?.invites ?? []

  function handleCopy(token: string) {
    const url = `${window.location.origin}/invite/${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  function handleCreate() {
    createInvite.mutate(
      {
        label: label.trim() || undefined,
        maxUses: parseInt(maxUses, 10) || 1,
      },
      {
        onSuccess: () => {
          setCreateOpen(false)
          setLabel("")
          setMaxUses("1")
        },
      },
    )
  }

  function handleDelete() {
    if (!deleteId) return
    deleteInvite.mutate(deleteId, { onSettled: () => setDeleteId(null) })
  }

  return (
    <>
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <IconPlus size={16} className="mr-1.5" />
              Generate Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Invite Link</DialogTitle>
              <DialogDescription>
                Create a new invitation link for guest access.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-label">
                  Label <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="invite-label"
                  placeholder='e.g. "For Sarah"'
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="invite-max-uses">Max Uses</Label>
                <Input
                  id="invite-max-uses"
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={createInvite.isPending}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createInvite.isPending}>
                {createInvite.isPending ? "Generating…" : "Generate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {invites.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No invite links yet. Generate one above.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {invites.map((invite) => {
                  const status = getInviteStatus(invite)
                  return (
                    <motion.tr
                      key={invite.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-b border-border/30 last:border-0"
                    >
                      <TableCell className="font-medium">
                        {invite.label || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <code className="max-w-40 truncate rounded bg-muted px-1.5 py-0.5 text-xs">
                            /invite/{invite.token.slice(0, 12)}…
                          </code>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleCopy(invite.token)}
                          >
                            {copiedToken === invite.token ? (
                              <IconCheck size={14} className="text-emerald-600" />
                            ) : (
                              <IconCopy size={14} />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invite.usedCount} / {invite.maxUses}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[status] ?? "secondary"}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-700"
                          onClick={() => setDeleteId(invite.id)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </TableCell>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Invite</DialogTitle>
            <DialogDescription>
              This invite link will no longer work. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              disabled={deleteInvite.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteInvite.isPending}
            >
              {deleteInvite.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
