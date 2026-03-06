import type { Metadata } from "next"
import { LettersHeader } from "@/components/letters/LettersHeader"
import { LettersContainer } from "@/components/letters/LettersContainer"

export const metadata: Metadata = {
  title: "Letters | Love 2035",
  description: "Love letters — moments captured in words.",
}

export default function LettersPage() {
  return (
    <div className="flex flex-col">
      <LettersHeader />
      <LettersContainer />
    </div>
  )
}
