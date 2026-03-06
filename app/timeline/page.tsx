import type { Metadata } from "next"
import { TimelineIntro } from "@/components/timeline/TimelineIntro"
import { TimelineContainer } from "@/components/timeline/TimelineContainer"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export const metadata: Metadata = {
  title: "Timeline | Love 2035",
  description: "Our relationship journey — every chapter of our love story.",
}

export default function TimelinePage() {
  return (
    <div className="flex flex-col">
      <TimelineIntro />
      <ScrollReveal>
        <TimelineContainer />
      </ScrollReveal>
    </div>
  )
}
