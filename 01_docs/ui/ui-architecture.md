# UI Architecture

## Overview

Frontend for Project 2035 is built using:

- NextJS App Router
- TailwindCSS
- shadcn/ui
- Radix UI
- TanStack Query
- Framer Motion

The UI must remain lightweight, responsive, and maintainable.

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

Use Framer Motion.

Allowed animations:

- fade in
- slide up
- card hover

Avoid heavy animations that affect performance.

---

## Styling

Use TailwindCSS utility classes.

Do not create custom CSS files unless necessary.

Global styles:

styles/globals.css