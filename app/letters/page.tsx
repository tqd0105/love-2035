import type { Metadata } from "next"
import { LettersGuarded } from "@/components/letters/LettersGuarded"

export const metadata: Metadata = {
  title: "Letters | Love 2035",
  description: "Love letters — moments captured in words.",
}

export default function LettersPage() {
  return <LettersGuarded />
}
