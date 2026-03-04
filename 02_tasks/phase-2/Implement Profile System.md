---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: medium
system: profile-system
---

Related Doc: [[profile-system]]

# Implement Profile System

## Description

Implement structured profile system for both individuals.

---

## Acceptance Criteria

- [ ] Profile CRUD implemented
- [ ] ProfileSection CRUD implemented
- [ ] Section ordering supported
- [ ] Avatar media integration
- [ ] Visibility enforced per section
- [ ] Only ADMIN/COUPLE can edit

---

## Implementation Plan

1. Implement Profile schema
2. Implement ProfileSection schema
3. Add CRUD endpoints
4. Integrate media
5. Apply visibility middleware

---

## Implementation Notes

- Do not hardcode profile content
- Enforce role validation server-side