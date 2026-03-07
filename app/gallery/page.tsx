import type { Metadata } from "next"
import { GalleryGuarded } from "@/components/gallery/GalleryGuarded"

export const metadata: Metadata = {
  title: "Gallery | Love 2035",
  description: "Our photo memories — every moment captured in love.",
}

export default function GalleryPage() {
  return <GalleryGuarded />
}
