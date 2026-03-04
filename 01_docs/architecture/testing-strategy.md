File: 01_docs/architecture/testing-strategy.md

# Testing Strategy

## 1. Purpose

Ensure system stability during long-term evolution.

Testing is mandatory before major releases.

---

## 2. Testing Layers

Level 1 – Unit Test  
Level 2 – Service Test  
Level 3 – Integration Test  
Level 4 – Manual Critical Flow Test  

---

## 3. What Must Be Tested

Auth:
- Login success
- Login fail
- Token refresh
- Role enforcement

Visibility:
- Role vs Visibility matrix
- Password locked content
- 403 enforcement

Mode:
- RELATIONSHIP behavior
- WEDDING behavior
- ARCHIVE behavior (write blocked)

Vault:
- Unlock success
- Unlock fail
- Time-lock behavior

---

## 4. Testing Rule

- Services must be testable independently.
- Routes must not contain complex logic.
- Mock Prisma when unit testing.

---

## 5. Regression Rule

Before:

- Mode switch feature
- Schema migration
- Wedding activation

Run full regression test.

---

## 6. Manual Critical Flow Checklist

Before production release:

- Login works
- Timeline loads
- Letter unlock works
- Vault access works
- Archive mode blocks edits
- Wedding mode activates correctly