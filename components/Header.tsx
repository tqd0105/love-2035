"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  IconHeart,
  IconMenu2,
  IconTimeline,
  IconPhoto,
  IconMail,
  IconConfetti,
  IconUser,
  IconHome,
  IconSettings,
  IconLogin,
  IconLogout,
  IconUserPlus,
} from "@tabler/icons-react"
import { useAuth } from "@/context/AuthContext"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useState } from "react"

type NavLink = { href: string; label: string; icon: typeof IconHeart }

function getNavLinks(role: string | undefined): NavLink[] {
  switch (role) {
    case "ADMIN":
      return [
        { href: "/admin", label: "Admin", icon: IconSettings },
        { href: "/timeline", label: "Timeline", icon: IconTimeline },
        { href: "/gallery", label: "Gallery", icon: IconPhoto },
      ]
    case "COUPLE":
      return [
        { href: "/timeline", label: "Timeline", icon: IconTimeline },
        { href: "/gallery", label: "Gallery", icon: IconPhoto },
        { href: "/letters", label: "Letters", icon: IconMail },
        { href: "/profile", label: "Profile", icon: IconUser },
      ]
    case "APPROVED_GUEST":
      return [
        { href: "/timeline", label: "Timeline", icon: IconTimeline },
        { href: "/gallery", label: "Gallery", icon: IconPhoto },
        { href: "/wedding", label: "Wedding", icon: IconConfetti },
      ]
    default:
      return [
        { href: "/", label: "Home", icon: IconHome },
        { href: "/wedding", label: "Wedding", icon: IconConfetti },
        { href: "/timeline", label: "Timeline", icon: IconTimeline },
        { href: "/request-access", label: "Request Access", icon: IconUserPlus },
      ]
  }
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navLinks = getNavLinks(user?.role)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <IconHeart className="h-5 w-5 fill-primary text-primary" />
          <span className="font-serif text-lg font-semibold tracking-tight">
            Love 2035
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-muted-foreground transition-colors hover:text-foreground",
                  pathname === href &&
                    "bg-primary/10 text-primary hover:text-primary",
                )}
              >
                <Icon size={16} />
                {label}
              </Button>
            </Link>
          ))}

          <Separator orientation="vertical" className="mx-1 h-5" />

          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => logout()}
            >
              <IconLogout size={16} />
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-muted-foreground hover:text-foreground",
                  pathname === "/login" && "bg-primary/10 text-primary hover:text-primary",
                )}
              >
                <IconLogin size={16} />
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <IconMenu2 size={20} />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-64">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 font-serif">
                <IconHeart className="h-4 w-4 fill-primary text-primary" />
                Love 2035
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
                      pathname === href &&
                        "bg-primary/10 text-primary hover:text-primary",
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Button>
                </Link>
              ))}

              <Separator className="my-2" />

              {user ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
                  onClick={() => { logout(); setOpen(false) }}
                >
                  <IconLogout size={16} />
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-muted-foreground hover:text-foreground",
                      pathname === "/login" && "bg-primary/10 text-primary hover:text-primary",
                    )}
                  >
                    <IconLogin size={16} />
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
