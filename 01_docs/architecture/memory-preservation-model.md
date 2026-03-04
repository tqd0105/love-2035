File: 01_docs/architecture/memory-preservation-model.md

# Memory Preservation Model

## 1. Purpose

Define how Project 2035 preserves:

- Timeline memories
- Wedding invitations
- Guest wishes
- Shared moments
- Media artifacts

For long-term emotional and technical stability.

---

## 2. Memory Classification

### Type A – Core Memories
- Timeline events
- Letters
- Wedding milestones

These must never be deleted once archived.

---

### Type B – Social Interaction
- Guest wishes
- RSVP
- Shared messages

Editable before archive.
Read-only after archive.

---

### Type C – Media
- Images
- Videos
- Audio

Must be backed up separately from database.

---

### Type D – Vault Content
- Private letters
- Time capsules

Encrypted, access-controlled, preserved permanently.

---

## 3. Immutability Rule

After entering ARCHIVE mode:

- Core Memories become immutable.
- No structural edits allowed.
- Only metadata annotations allowed (optional future feature).

---

## 4. Wedding Memory Strategy

Wedding content must include:

- Invitation page snapshot
- Guestbook export
- Media album export
- RSVP record

Wedding becomes a sealed chapter.

---

## 5. Public vs Private Balance

Public layer:
- Timeline summary
- Wedding gallery
- Selected wishes

Private layer:
- Full letters
- Vault content
- Personal annotations

Visibility system must remain active even in archive.

---

## 6. Annual Memory Snapshot

Once per year:

- Export database
- Export media
- Generate static HTML snapshot
- Store offline copy

This creates generational durability.

---

## 7. Format Durability

Avoid storing:

- Proprietary document formats only
- Platform-dependent content

Prefer:

- JSON (database export)
- JPEG / PNG / MP4 (media)
- Static HTML snapshot

These formats will survive decades.

---

## 8. Narrative Integrity

Do not over-edit history.

The system must preserve:

- Context
- Imperfections
- Time sequence

Memory is not marketing.

---

## 9. Future Accessibility

In 2035:

- Children can view public timeline
- Couple can access vault
- Wedding memory remains accessible

System must degrade gracefully, not collapse.

---

## 10. Principle

The goal is not feature growth.

The goal is memory continuity.