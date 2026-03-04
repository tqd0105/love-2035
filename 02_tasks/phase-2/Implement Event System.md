---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: medium
system: event-system
---

Related Doc: [[event-system]]

# Implement Event System

## Description

Implement event CRUD, recurring logic, and countdown calculation.

---

## Acceptance Criteria

- [ ] Event CRUD endpoints
- [ ] Recurrence logic implemented
- [ ] Countdown calculation implemented
- [ ] Wedding event supported
- [ ] Visibility enforced

---

## Implementation Plan

1. Implement event schema
2. Implement CRUD APIs
3. Add recurrence logic
4. Add countdown utility

---

## Implementation Notes

- Validate recurrence rule
- Do not compute sensitive logic on client