File: 01_docs/architecture/versioning-strategy.md

# Versioning Strategy

## 1. Purpose

Ensure the system can evolve without breaking existing data or API contracts.

---

## 2. Versioning Layers

The system maintains versioning at 3 levels:

- Database schema version (Prisma migrations)
- API version (if public endpoints expand)
- Documentation version

---

## 3. Database Versioning

Rules:

- Every schema change must use Prisma migration.
- Never edit database manually in production.
- Never delete column without deprecation phase.
- Add → migrate → backfill → remove.

---

## 4. Deprecation Policy

If removing a field:

1. Mark as deprecated in documentation.
2. Stop using in services.
3. Deploy.
4. Remove in next migration.

---

## 5. API Stability Rule

Internal API may evolve.
If public-facing API expands in wedding phase:

Introduce:

/api/v1/
/api/v2/

Never silently change response shape.

---

## 6. Documentation Version Tag

Major architectural change must increment:

Architecture Version in core-architecture.md