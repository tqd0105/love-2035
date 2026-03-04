File: 01_docs/architecture/data-migration-policy.md

# Data Migration Policy

## 1. Purpose

Ensure data integrity during long-term evolution.

---

## 2. Migration Rules

- All schema changes must use Prisma migration.
- Migration must be reversible if possible.
- Never run destructive migration without backup.

---

## 3. Backfill Strategy

If adding required field:

1. Add as optional.
2. Backfill via script.
3. Change to required in next migration.

---

## 4. Enum Expansion Rule

When adding enum value:

- Update Prisma
- Update system docs
- Update visibility matrix if required
- Test legacy data compatibility

---

## 5. Archive Safety

Migration must not modify archived data without explicit review.

Archived data is immutable by default.