File: 01_docs/conventions/ai-prompting-standard.md

# AI Prompting Standard

## 1. Purpose

Ensure consistent AI output aligned with architecture.

Never ask AI without providing context.

---

## 2. Mandatory Prompt Structure

When requesting feature implementation, always provide:

1. System doc path
2. API contract reference
3. Schema reference (if relevant)
4. Layer constraint reminder

---

## 3. Prompt Format

Use this template:

---

Context:
- System: <system name>
- Docs: 01_docs/systems/<file>.md
- API Spec: 01_docs/api/api-contracts.md
- Schema: prisma/schema.prisma

Requirement:
<Describe feature clearly>

Constraints:
- Must follow layered architecture
- No business logic in route
- Apply visibility middleware
- Respect mode rules

---

Never use vague prompts like:
"Build feature X"

---

## 4. When AI Suggests Schema Change

Before accepting:

- Update system doc
- Update feature proposal
- Confirm migration plan
- Update API contract

Never change schema silently.

---

## 5. Response Format Rule

AI must return:

- Service layer code
- Route handler
- Required middleware
- Minimal explanation

Avoid mixing logic into UI.

---

## 6. Refactor Rule

If AI refactors:

- Must explain architectural reason
- Must update documentation reference
- Must not break existing API contract

---

## 7. Guardrails

Reject AI output if:

- Direct Prisma call inside route
- Visibility check only in UI
- Mode check only in client
- Missing role validation
- Response format inconsistent

Architecture discipline overrides convenience.