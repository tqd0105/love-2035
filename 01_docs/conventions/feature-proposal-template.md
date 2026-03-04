File: 01_docs/conventions/feature-proposal-template.md

# Feature Proposal Template

## 1. Feature Name

Short descriptive title.

---

## 2. System Owner

Which system does this belong to?

- Auth
- Mode
- Visibility
- Event
- Timeline
- Letter
- Media
- Profile
- Vault
- Wedding
- Archive

Only one primary owner allowed.

---

## 3. Problem Statement

What problem does this solve?

Why is it necessary?

---

## 4. Mode Impact

Does this feature behave differently in:

- RELATIONSHIP
- WEDDING
- ARCHIVE

Specify clearly.

---

## 5. Visibility Impact

Does this feature return content?

If yes:

- Which visibility levels apply?
- Does PASSWORD_LOCKED apply?

---

## 6. Data Impact

Does this require:

- New table?
- New field?
- New enum?
- Migration?

If yes, describe.

---

## 7. API Impact

New route?
Modified route?

Define request & response shape.

Must update:
01_docs/api/api-contracts.md

---

## 8. Security Review

- Role validation?
- Visibility enforcement?
- Token handling?
- Rate limiting?

---

## 9. Performance Risk

Could this cause:

- N+1 query?
- Heavy media load?
- DB growth spike?

---

## 10. Archive Compatibility

What happens in ARCHIVE mode?

Must be explicitly defined.

---

## 11. Decision

Approved / Rejected / Needs Review