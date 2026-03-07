"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IconCheck, IconX } from "@tabler/icons-react"
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
import {
  useAdminGuestRequests,
  useApproveGuestRequest,
  useRejectGuestRequest,
} from "@/hooks/useAdminGuestRequests"

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
}

export function GuestRequestsTable() {
  const { data, isLoading, error } = useAdminGuestRequests()
  const approveRequest = useApproveGuestRequest()
  const rejectRequest = useRejectGuestRequest()
  const [confirmAction, setConfirmAction] = useState<{
    id: string
    type: "approve" | "reject"
    name: string
  } | null>(null)

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
        Failed to load guest requests.
      </p>
    )
  }

  const requests = data?.requests ?? []

  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No guest requests yet.
      </p>
    )
  }

  function handleConfirm() {
    if (!confirmAction) return
    if (confirmAction.type === "approve") {
      approveRequest.mutate(confirmAction.id, {
        onSettled: () => setConfirmAction(null),
      })
    } else {
      rejectRequest.mutate(confirmAction.id, {
        onSettled: () => setConfirmAction(null),
      })
    }
  }

  const isPending = approveRequest.isPending || rejectRequest.isPending

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/40">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Relationship</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {requests.map((req) => (
                <motion.tr
                  key={req.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-border/30 last:border-0"
                >
                  <TableCell className="font-medium">{req.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {req.email}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {req.relationship}
                  </TableCell>
                  <TableCell className="max-w-48 truncate text-sm text-muted-foreground">
                    {req.message || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[req.status] ?? "outline"}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {req.status === "PENDING" && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() =>
                            setConfirmAction({
                              id: req.id,
                              type: "approve",
                              name: req.name,
                            })
                          }
                        >
                          <IconCheck size={16} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-red-50 hover:text-red-700"
                          onClick={() =>
                            setConfirmAction({
                              id: req.id,
                              type: "reject",
                              name: req.name,
                            })
                          }
                        >
                          <IconX size={16} />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!confirmAction}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction?.type === "approve"
                ? "Approve Request"
                : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction?.type === "approve"
                ? `Approve access for ${confirmAction.name}? A guest account will be created.`
                : `Reject the request from ${confirmAction?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmAction(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant={
                confirmAction?.type === "approve" ? "default" : "destructive"
              }
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending
                ? "Processing…"
                : confirmAction?.type === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
