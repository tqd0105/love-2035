File: 01_docs/architecture/staging-and-deployment-strategy.md

# Staging and Deployment Strategy

## 1. Purpose

Prevent production failure due to unsafe deployments.

---

## 2. Environments

Development  
Staging  
Production  

Never deploy directly from development to production.

---

## 3. Deployment Flow

1. Develop feature
2. Run tests locally
3. Deploy to staging
4. Run manual critical checklist
5. Backup production database
6. Deploy to production
7. Monitor logs

---

## 4. Migration Rule

Before applying migration in production:

- Backup database
- Review destructive changes
- Confirm no data loss

---

## 5. Rollback Plan

If deployment fails:

- Revert to previous build
- Restore database backup if necessary
- Review logs

---

## 6. Health Endpoint

Add:

/api/health

Returns:

{
  "status": "ok",
  "mode": "RELATIONSHIP",
  "db": "connected"
}

Used for uptime monitoring.