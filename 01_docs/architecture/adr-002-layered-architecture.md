File: 01_docs/architecture/adr-002-layered-architecture.md

# ADR-002: Layered Architecture

## Status
Accepted

## Context

Without strict layering:

- Business logic leaks into UI
- Security checks get duplicated
- Copilot generates inconsistent patterns
- Visibility and Mode rules become scattered

The project requires strict separation of concerns.

---

## Decision

Adopt layered architecture:

Schema → Service → Middleware → Route → UI

---

## Rules

- UI must not contain business logic
- Routes must not access Prisma directly
- Services must contain core logic
- Middleware must enforce guards
- No circular dependencies allowed

---

## Consequences

Positive:

- Clear AI guidance
- Predictable feature expansion
- Easier refactor

Negative:

- Slightly more boilerplate