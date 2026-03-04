File: 01_docs/production/archive-legacy-mode-spec.md

# Archive Legacy Mode Specification

## 1. Purpose

Define how the system transitions from active platform to long-term digital archive.

Archive Mode is not shutdown.
It is stabilization.

---

## 2. When to Activate Archive Legacy Mode

Possible triggers:

- After wedding
- After major life milestone
- When active development stops
- When hosting cost needs reduction

---

## 3. Archive Legacy Principles

- No new content creation
- No content deletion
- No structural schema changes
- No feature expansion
- Read-only public experience

---

## 4. Technical Transition Steps

1. Switch mode to ARCHIVE
2. Disable:
   - Letter creation
   - Timeline editing
   - Guest request
3. Lock admin editing (optional)
4. Enable read-only optimization

---

## 5. Static Snapshot Option

Optional:

Generate static export of:

- Public timeline
- Wedding pages
- Profile pages

Deploy as static site for ultra-low cost hosting.

---

## 6. Data Preservation

Before entering Archive:

- Full database backup
- Media snapshot backup
- Store encrypted copy offline

---

## 7. Archive Performance Optimization

In ARCHIVE:

- Cache most routes
- Disable heavy dynamic queries
- Reduce DB connection pool
- Serve mostly static content

---

## 8. Legal & Privacy Review

Before archive:

- Review private visibility
- Remove accidental exposure
- Confirm no sensitive data publicly accessible

---

## 9. Legacy Hosting Strategy

Options:

A. Keep full dynamic hosting  
B. Move to low-cost hosting  
C. Convert to static snapshot  

Choice depends on budget and activity level.

---

## 10. Future Re-Activation

Archive is reversible.

To reactivate:

1. Switch mode from ARCHIVE to RELATIONSHIP
2. Re-enable editing
3. Verify migration compatibility

Archive must not destroy data.

---

## 11. 2035 Vision

By 2035, system should:

- Still load timeline
- Still display wedding memory
- Still preserve vault content
- Still allow private access

Longevity > feature richness.