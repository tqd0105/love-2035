File: 01_docs/architecture/adr-001-database-choice.md

# ADR-001: Database Choice
Architecture Decision Records
## Status
Accepted

## Context

Project 2035 requires:

- Strong relational consistency
- Role-based access control
- Visibility matrix
- Mode switching (RELATIONSHIP, WEDDING, ARCHIVE)
- Long-term maintainability (multi-year evolution)

The system contains multiple related entities:

User ↔ Letter ↔ Media ↔ Event ↔ Timeline ↔ Vault

Relational integrity is critical.

---

## Decision

Use:

PostgreSQL + Prisma ORM

---

## Rationale

- Strong relational model
- ACID guarantees
- Mature migration system
- Enum support
- Good long-term maintainability
- Excellent TypeScript integration

MongoDB was rejected due to:

- Weak relational enforcement
- Complex access control modeling

Drizzle was rejected due to:

- Smaller ecosystem
- Lower migration tooling maturity

---

## Consequences

Positive:

- Schema-first workflow
- Strong type safety
- Clear migration history

Negative:

- Slight performance overhead compared to raw SQL
- Requires migration discipline