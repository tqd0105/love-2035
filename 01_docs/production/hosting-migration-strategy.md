File: 01_docs/production/hosting-migration-strategy.md

# Hosting Migration Strategy

## 1. Purpose

Ensure ability to move infrastructure without losing data.

---

## 2. Portability Rules

- No provider-specific APIs
- Use standard PostgreSQL
- Store media via abstraction layer
- No hardcoded server paths

---

## 3. Migration Steps

1. Backup production database
2. Export media files
3. Setup new environment
4. Restore database
5. Upload media
6. Update DNS
7. Test health endpoint

---

## 4. DNS Migration Rule

Before switching DNS:

- Reduce TTL to 5 minutes
- Wait propagation
- Switch A/CNAME record
- Monitor traffic

---

## 5. Downtime Minimization

Goal:

Downtime < 10 minutes

Use staging test before production migration.