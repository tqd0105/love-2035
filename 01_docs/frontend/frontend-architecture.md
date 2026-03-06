# Frontend Architecture

## Overview

Frontend follows a layered architecture.

UI must remain clean and separated from data logic.

Layers:

Page
↓
Feature Component
↓
Hook
↓
API Client
↓
Backend API

Pages must never call backend APIs directly.

All data fetching must go through hooks.

---

## Directory Structure

app/
components/
components/ui/
hooks/
lib/api/
types/

Explanation:

app → route pages

components → reusable feature components

components/ui → base UI primitives (shadcn)

hooks → data hooks (TanStack Query)

lib/api → API client

types → shared TypeScript types

---

## Rules

Pages:

- render layout
- call hooks

Components:

- display data

Hooks:

- fetch data

API client:

- perform fetch calls

This separation is mandatory.