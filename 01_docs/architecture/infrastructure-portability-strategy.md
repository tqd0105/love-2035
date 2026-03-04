File: 01_docs/architecture/infrastructure-portability-strategy.md

# Infrastructure Portability Strategy

## 1. Purpose

Ensure project is not locked into one hosting provider.

---

## 2. Principles

- No hardcoded server paths
- No platform-specific logic
- Environment variables for configuration

---

## 3. Database Portability

Use PostgreSQL standard features.

Avoid provider-specific extensions.

---

## 4. Media Storage Abstraction

Media service must:

- Abstract storage logic
- Support local storage (v1)
- Allow S3 or cloud storage (future)

---

## 5. Deployment Agnostic Design

System must be deployable on:

- VPS
- Docker
- Vercel
- Railway
- Cloud providers

---

## 6. Configuration Rule

All configuration via:

.env

Never hardcode:

- Database URL
- JWT secret
- Encryption keys

---

## 7. Containerization (Future)

Add Docker support to ensure reproducibility.

Dockerfile must:

- Install dependencies
- Run migration
- Start server