File: 01_docs/architecture/privacy-and-data-principles.md

# Privacy and Data Principles

## 1. Purpose

Protect relationship data for long-term safety.

---

## 2. Data Classification

Level 1 – Public  
Level 2 – Approved Guest  
Level 3 – Couple  
Level 4 – Vault (highly private)

Each level must respect visibility system.

---

## 3. Minimal Data Principle

Store only necessary personal data.

GuestRequest must not collect excessive information.

---

## 4. Password & Token Safety

- Hash with bcrypt
- Refresh token stored hashed
- No plaintext storage

---

## 5. Encryption Strategy

Vault content may use:

- Application-level encryption
- Server-managed key

Never expose encryption key in client.

---

## 6. Data Export Right

Future feature:

Allow ADMIN to export:

- Letters
- Timeline
- Media metadata

In case of system migration.

---

## 7. Deletion Policy

If deleting user:

- Remove refresh tokens
- Preserve relationship content
- Maintain referential integrity

---

## 8. Long-Term Ethical Principle

This system stores emotional history.

Protect dignity over convenience.