---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: medium
system: letter-system
---

Related Doc: [[letter-system]]

# Implement Letter System

## Description

Implement letters with time-lock, password-lock, and read tracking.

---

## Acceptance Criteria

- [ ] Letter CRUD
- [ ] Time-lock logic
- [ ] Password-lock logic
- [ ] Read tracking
- [ ] Music override support
- [ ] Visibility enforced

---

## Implementation Plan

1. Implement letter schema
2. Add lock logic
3. Add read tracking
4. Integrate media

---

## Implementation Notes

- Validate unlockAt server-side
- Hash password