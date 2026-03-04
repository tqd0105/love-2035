File: 01_docs/architecture/observability-and-logging-strategy.md

# Observability and Logging Strategy

## 1. Purpose

Ensure system health can be monitored, debugged, and audited long-term.

Without observability, bugs accumulate silently.

---

## 2. Logging Principles

- All errors must be logged server-side.
- Never log passwords.
- Never log full tokens.
- Log role and route on sensitive actions.

---

## 3. Log Levels

- INFO → normal flow
- WARN → suspicious but non-breaking
- ERROR → failed request
- SECURITY → unauthorized attempt, lock bypass, etc.

---

## 4. What Must Be Logged

- Login attempts (success & fail)
- Mode switch
- Guest approval
- Vault unlock attempts
- Schema migration
- Archive activation

---

## 5. Structured Logging

Logs must use structured format:

{
  "level": "ERROR",
  "route": "/api/letter/123",
  "userId": "uuid",
  "role": "COUPLE",
  "message": "Unlock failed"
}

Avoid console.log noise.

---

## 6. Long-Term Storage

Production logs should:

- Rotate daily
- Retain at least 30 days
- Be exportable

---

## 7. Monitoring

Future extension:

- Uptime monitoring
- Error alert threshold
- Health endpoint (/api/health)

---

## 8. Audit Sensitivity

For vault & wedding:

Store minimal audit trail for:

- Unlock attempt
- Mode change
- Role change

Privacy must be balanced with traceability.