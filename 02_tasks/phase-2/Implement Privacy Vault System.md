---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: medium
system: privacy-vault-system
---

Related Doc: [[privacy-vault-system]]

# Implement Privacy Vault System

## Description

Implement secure vault for highly private content (COUPLE only).

---

## Acceptance Criteria

- [ ] VaultItem CRUD implemented
- [ ] COUPLE-only access enforced
- [ ] Time-lock supported
- [ ] Password-lock supported
- [ ] Content encryption supported (basic)
- [ ] Vault isolated from timeline/search

---

## Implementation Plan

1. Implement Vault schema
2. Implement CRUD endpoints
3. Add unlock logic
4. Apply role guard
5. Integrate media support

---

## Implementation Notes

- Never expose encrypted content before unlock
- Hash password
- Do not reuse timeline APIs