---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: high
system: visibility-system
---

Related Doc: [[visibility-system]]

# Implement Visibility System

## Description

Implement centralized visibility middleware and role vs visibility matrix.

---

## Acceptance Criteria

- [ ] Visibility enum implemented
- [ ] Visibility middleware implemented
- [ ] Role vs visibility matrix enforced
- [ ] PASSWORD_LOCKED logic implemented
- [ ] 403 response on unauthorized access
- [ ] No visibility logic in UI layer

---

## Implementation Plan

1. Implement visibility middleware
2. Implement role comparison logic
3. Implement password unlock flow
4. Integrate into routes

---

## Implementation Notes

- Always validate server-side
- Avoid duplicating checks