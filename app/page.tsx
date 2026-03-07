import { HomeHero } from "@/components/home/HomeHero"
import { RelationshipCounter } from "@/components/relationship/RelationshipCounter"
import { CoupleIntro } from "@/components/home/CoupleIntro"
import { StoryPreview } from "@/components/home/StoryPreview"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomeHero />
      <ScrollReveal>
        <RelationshipCounter />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <CoupleIntro />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <StoryPreview />
      </ScrollReveal>
    </div>
  )
}
