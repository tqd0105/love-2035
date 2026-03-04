---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: high
system: core-architecture
---

Related Doc: [[core-architecture]]

# Setup Database Schema

## Description

Create initial database schema for all core systems and ensure enum consistency with documentation.

---

## Acceptance Criteria

- [ ] User table created
- [ ] RefreshToken table created
- [ ] GuestRequest table created
- [ ] SystemConfig table created
- [ ] Event table created
- [ ] Media table created
- [ ] TimelineEvent table created
- [ ] Letter table created
- [ ] Profile table created
- [ ] ProfileSection table created
- [ ] VaultItem table created
- [ ] Enums match documentation
- [ ] Default ADMIN & COUPLE seeded
- [ ] Default SystemConfig seeded

---

## Implementation Plan

1. Define all enums
2. Define schema structure
3. Run migration
4. Seed initial data
5. Verify constraints

---

## Implementation Notes

- Use UUID for primary keys
- Only one SystemConfig row allowed
- Add indexes on foreign keys