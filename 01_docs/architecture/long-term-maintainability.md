File: 01_docs/architecture/long-term-maintainability.md

# Long-Term Maintainability

## 1. Purpose

Define rules to keep project stable until 2035.

---

## 2. Dependency Management

- Update dependencies quarterly.
- Never jump multiple major versions at once.
- Test in staging before production update.

---

## 3. Technical Debt Policy

All technical debt must:

- Be documented
- Have expiration condition
- Be linked to a task

---

## 4. Complexity Budget

If a feature requires:

- New system
- New enum
- More than 3 new tables

Architecture review is mandatory.

---

## 5. Documentation Discipline

Every major change must update:

- System docs
- API contracts
- Development flow spec

---

## 6. Simplicity Rule

When in doubt:

Prefer simpler solution.

Longevity beats cleverness.