---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: high
system: mode-system
---

Related Doc: [[mode-system]]

# Implement Mode System

## Description

Implement global system mode and feature activation logic.

---

## Acceptance Criteria

- [ ] Mode enum implemented
- [ ] SystemConfig table used
- [ ] Mode injected into request context
- [ ] Admin-only mode switch API
- [ ] ARCHIVE disables editing
- [ ] WEDDING activates wedding features
- [ ] Mode validated server-side

---

## Implementation Plan

1. Implement mode loader middleware
2. Implement admin switch endpoint
3. Add guards to editing routes
4. Test mode transitions

---

## Implementation Notes

- Do not rely on client mode
- Consider caching SystemConfig