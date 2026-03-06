# UI Architecture

## Overview

Frontend for Project 2035 is built using:

- NextJS App Router
- TailwindCSS
- TanStack Query

The UI must remain lightweight, responsive, and maintainable.

---

## UI Libraries

### Component Libraries

- **shadcn/ui** — Base UI primitives (Button, Card, Dialog, Sheet, etc.). Built on Radix UI. Installed via `npx shadcn@latest add <component>`. Components live in `components/ui/`.
- **Magic UI** — Animated, ready-made components for landing pages and hero sections (animated text, counters, shimmer effects, etc.).
- **Aceternity UI** — Premium animated components for visual storytelling (spotlight cards, parallax scroll, glowing borders, etc.).

### Animation

- **Framer Motion** — The only animation library allowed. All animations must use Framer Motion. Do not use CSS animations, CSS transitions, or other animation libraries.

Allowed animation patterns:

- fade in
- slide up
- card hover
- stagger children
- page transitions

Avoid heavy animations that affect performance.

### Smooth Scrolling

- **Lenis** — Used for smooth scroll behaviour. Wrap the app or specific scroll containers with Lenis. Do not use native `scroll-behavior: smooth`.

### Icons

- **Tabler Icons** (`@tabler/icons-react`) — The only icon library allowed. All icons must come from Tabler Icons. Do not use Lucide, Heroicons, or other icon libraries.

Usage:

```tsx
import { IconHeart, IconCalendar } from "@tabler/icons-react"

<IconHeart size={20} />
```

---

## Directory Structure

app/
components/
components/ui/
hooks/
lib/
styles/

Explanation:

app → route pages  
components → reusable components  
components/ui → base UI primitives (shadcn)  
hooks → reusable React hooks  
lib → API clients / utilities  

---

## Layering Rules

UI layer order:

Pages → Feature Components → UI Components

Pages should never contain complex logic.

Example:

Page
↓
Timeline Component
↓
EventCard Component
↓
Card UI primitive

---

## Data Fetching

Use TanStack Query for API calls.

Rules:

- Fetch data in page or hooks
- Do not fetch inside UI primitives

Example:

hooks/useTimeline.ts

---

## Animations

All animations must use Framer Motion. This is mandatory — no exceptions.

Do not use:

- CSS `@keyframes` or `animation` properties
- CSS `transition` for interactive motion
- Other animation libraries (GSAP, anime.js, etc.)

Example:

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
  {children}
</motion.div>
```

---

## Styling

Use TailwindCSS utility classes.

Do not create custom CSS files unless necessary.

Global styles:

styles/globals.css