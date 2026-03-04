File: 01_docs/architecture/backup-and-recovery-plan.md

# Backup and Recovery Plan

## 1. Purpose

Ensure data survivability beyond single server lifecycle.

---

## 2. Backup Strategy

Production database must:

- Perform daily automated backups
- Retain at least 30 days
- Store offsite

---

## 3. Media Backup

If using local storage:

- Weekly media snapshot
- Offsite copy
- Integrity check

If using S3:

- Enable versioning
- Enable lifecycle policy

---

## 4. Recovery Drill

At least once per year:

- Restore backup to staging
- Validate data integrity

---

## 5. Disaster Recovery Principle

Code is replaceable.
Data is not.

Protect data above all.