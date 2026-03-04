---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: medium
system: media-system
---

Related Doc: [[media-system]]

# Implement Media System

## Description

Implement upload, storage, and secure media rendering.

---

## Acceptance Criteria

- [ ] Upload endpoint implemented
- [ ] File validation enforced
- [ ] Unique filename generation
- [ ] Metadata saved
- [ ] Blur placeholder generated
- [ ] Visibility enforced
- [ ] Lazy load ready

---

## Implementation Plan

1. Implement upload API
2. Add validation
3. Save file to storage
4. Save metadata
5. Implement media access guard

---

## Implementation Notes

- Do not expose filesystem path
- Limit file size