"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { IconLoader2, IconMoodSad, IconMailOff } from "@tabler/icons-react"
import { useLetters } from "@/hooks/useLetters"
import { LetterCard } from "./LetterCard"
import { LetterDetail } from "./LetterDetail"

export function LettersContainer() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isLoading, isError } = useLetters()

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

  if (data.letters.length === 0) {
    return (
      <section className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <IconMailOff size={40} className="text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Chưa có lá thư nào.
        </p>
      </section>
    )
  }

  /* Show detail view when a letter is selected */
  if (selectedId) {
    return <LetterDetail letterId={selectedId} onBack={() => setSelectedId(null)} />
  }

  return (
    <section className="pb-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.letters.map((letter, i) => (
          <LetterCard
            key={letter.id}
            letter={letter}
            index={i}
            onSelect={setSelectedId}
          />
        ))}
      </div>
    </section>
  )
}
