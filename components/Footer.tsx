import { IconHeart } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto">
      <Separator className="opacity-40" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center sm:px-6">
        <IconHeart size={16} className="fill-primary/60 text-primary/60" />
        <p className="text-sm text-muted-foreground">
          Built with love &mdash; {year}
        </p>
      </div>
    </footer>
  )
}
