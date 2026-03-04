---
id: <% tp.date.now("YYYYMMDDHHmm") %>
status: todo
priority: high
system: auth-system
---

Related Doc: [[auth-system]]

# Implement Auth System

## Description

Implement authentication, session lifecycle, and role-based access control.

---

## Acceptance Criteria

- [ ] Login API implemented
- [ ] Refresh token API implemented
- [ ] Logout API implemented
- [ ] Password hashed with bcrypt
- [ ] Access token short-lived
- [ ] Refresh token stored hashed
- [ ] Role middleware implemented
- [ ] Guest approval flow works
- [ ] httpOnly secure cookies enabled

---

## Implementation Plan

1. Implement login endpoint
2. Implement refresh endpoint
3. Implement logout endpoint
4. Implement role middleware
5. Implement guest approval
6. Test role matrix

---

## Implementation Notes

- Do not expose passwordHash
- Do not trust client role
- Rate limit login endpoint