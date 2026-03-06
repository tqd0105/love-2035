"use client"

import { motion } from "framer-motion"
import { IconCheck } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  useAdminMode,
  useSetMode,
  type SystemMode,
} from "@/hooks/useAdminMode"

const modes: { value: SystemMode; label: string; description: string }[] = [
  {
    value: "RELATIONSHIP",
    label: "Relationship",
    description: "Default mode — couples can manage events, letters, and memories.",
  },
  {
    value: "WEDDING",
    label: "Wedding",
    description: "Enables wedding portal, guest wishes, and RSVP features.",
  },
  {
    value: "ARCHIVE",
    label: "Archive",
    description: "Read-only archive mode — content creation is disabled.",
  },
]

export function SystemModeControl() {
  const { data, isLoading, error } = useAdminMode()
  const setMode = useSetMode()

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
        Failed to load system config.
      </p>
    )
  }

  const current = data?.mode ?? "RELATIONSHIP"

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {modes.map(({ value, label, description }, i) => {
        const active = current === value
        return (
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" as const }}
          >
            <Card
              className={`cursor-pointer border-2 transition-colors ${
                active
                  ? "border-rose-400 bg-rose-50/50"
                  : "border-border/40 hover:border-border"
              }`}
              onClick={() => {
                if (!active && !setMode.isPending) setMode.mutate(value)
              }}
            >
              <CardContent className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{label}</h3>
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500"
                    >
                      <IconCheck size={12} className="text-white" />
                    </motion.div>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {setMode.isPending && (
        <p className="col-span-full text-center text-xs text-muted-foreground">
          Switching mode…
        </p>
      )}
    </div>
  )
}
