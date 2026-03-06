import type { Metadata } from "next"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { CoupleSection } from "@/components/profile/CoupleSection"
import { RelationshipStory } from "@/components/profile/RelationshipStory"
import { RelationshipInfo } from "@/components/profile/RelationshipInfo"
import { ScrollReveal } from "@/components/ui/ScrollReveal"

export const metadata: Metadata = {
  title: "Profile | Love 2035",
  description: "Hồ sơ đôi – câu chuyện của chúng mình",
}

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <ProfileHeader />
      <ScrollReveal>
        <CoupleSection />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <RelationshipStory />
      </ScrollReveal>
      <ScrollReveal delay={0.15}>
        <RelationshipInfo />
      </ScrollReveal>
    </main>
  )
}
