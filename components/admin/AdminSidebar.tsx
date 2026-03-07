"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  IconCalendarEvent,
  IconPhoto,
  IconMessage,
  IconMail,
  IconSettings,
  IconLayoutDashboard,
  IconUserPlus,
  IconLink,
} from "@tabler/icons-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: IconLayoutDashboard },
  { href: "/admin/events", label: "Events", icon: IconCalendarEvent },
  { href: "/admin/media", label: "Media", icon: IconPhoto },
  { href: "/admin/wishes", label: "Guest Wishes", icon: IconMessage },
  { href: "/admin/guest-requests", label: "Guest Requests", icon: IconUserPlus },
  { href: "/admin/invites", label: "Invite Links", icon: IconLink },
  { href: "/admin/mode", label: "System Mode", icon: IconSettings },
] as const

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-full flex-col gap-1 border-r border-border/40 pr-4 sm:w-56">
      <div className="mb-4 px-3 py-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Admin Panel
        </h2>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/60"
            >
              {active && (
                <motion.div
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-lg bg-muted"
                  transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                />
              )}
              <Icon size={18} className="relative z-10 shrink-0" />
              <span className="relative z-10">{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
