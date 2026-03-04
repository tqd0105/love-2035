File: 01_docs/conventions/development-flow-specification.md

# Development Flow Specification

## 1. Purpose

Define the exact process for adding new features without breaking architecture.

All contributors (human or AI) must follow this flow.

No direct coding without following steps.

---

## 2. Feature Addition Protocol

When adding a new feature:

1. Identify system owner (Auth, Event, Timeline, etc.)
2. Update corresponding system documentation in:
   01_docs/systems/
3. Update API contract in:
   01_docs/api/api-contracts.md
4. Update Prisma schema in:
   prisma/schema.prisma
5. Create task file in:
   02_tasks/
6. Implement service layer in:
   services/
7. Implement route handler in:
   app/api/
8. Apply middleware guards in:
   middleware/
9. Validate response format using:
   01_docs/conventions/error-convention.md
10. Update roadmap if scope expands:
   01_docs/roadmap/

Skipping documentation step is forbidden.

---

## 3. Layer Order Rule

New feature must respect layer order:

Schema → Service → Middleware → Route → UI

Never:

UI → Service → Fix schema later

Schema is always first.

---

## 4. Adding a New Enum

If adding:

- New Role
- New Visibility
- New EventType
- New Mode

Must update:

- prisma/schema.prisma
- 01_docs/systems/*
- 01_docs/api/api-contracts.md
- Migration

No magic string allowed.

---

## 5. Adding a New Route

When adding route:

- Define request & response in:
  01_docs/api/api-contracts.md
- Define service in:
  services/
- Apply middleware from:
  middleware/
- Return standard response shape
- Validate role explicitly

---

## 6. Mode-Sensitive Feature Rule

If feature depends on Mode:

- Check Mode in service or middleware
- Update:
  01_docs/systems/mode-system.md
- Test RELATIONSHIP + WEDDING + ARCHIVE

---

## 7. Visibility-Sensitive Feature Rule

If feature returns content:

- Apply visibility middleware
- Never filter only in UI
- Respect Role vs Visibility matrix

---

## 8. Security Review Checklist

Before marking feature complete:

- Role validation applied
- Visibility enforced
- No sensitive data exposed
- No plaintext password stored
- No direct Prisma calls inside route
- No business logic in UI layer

---

## 9. Refactor Rule

If feature modifies:

- More than 2 systems
- More than 3 enums
- More than 3 tables

Then:

- Update:
  01_docs/architecture/core-architecture.md
- Record reasoning in ADR (future)

---

## 10. Technical Debt Rule

Temporary workaround must include:

- TODO with explanation
- Expiration condition
- Linked task in 02_tasks/

No silent hacks allowed.

---

## 11. AI Collaboration Rules

When using AI (Copilot):

Always provide:

- System doc path
- API contract path
- Schema path
- Response format spec

Never prompt AI with:
"Build feature X" without context.

---

## 12. Feature Lifecycle

Feature states:

Proposed  
→ Documented  
→ Task Created  
→ Implemented  
→ Reviewed  
→ Merged  

Documentation step is mandatory.

---

## 13. Archive-Safe Rule

If feature affects:

- Timeline
- Letter
- Vault
- Media

Must verify behavior in:

Mode = ARCHIVE

ARCHIVE must disable editing.

---

## 14. Wedding-Safe Rule

If feature affects:

- Guest access
- Public content
- Event behavior

Must test in:

RELATIONSHIP mode  
WEDDING mode  

---

## 15. Documentation Authority

If code conflicts with documentation:

Documentation must be updated  
or code must be reverted.