# Coding Guidelines

## Naming

- Services end with `.service.ts`
- Middleware end with `.middleware.ts`
- Enums must match Prisma enums
- No magic strings for roles or visibility

---

## Security Rules

- Never trust client input
- Always validate role server-side
- Always apply visibility middleware
- Never expose encrypted content

---

## Performance Rules

- Do not fetch unnecessary fields
- Use select when possible
- Avoid N+1 queries

---

## Mode Rules

- Never check mode in component
- Always inject mode via middleware