File: 01_docs/production/wedding-mode-activation-protocol.md

# Wedding Mode Activation Protocol

## 1. Purpose

Ensure clean transition from RELATIONSHIP to WEDDING mode.

---

## 2. Pre-Activation Checklist

- Wedding Event created in database
- Wedding album uploaded
- Guest visibility configured
- Private content verified hidden
- Archive mode disabled

---

## 3. Activation Steps

1. Admin login
2. Switch mode to WEDDING
3. Confirm mode in SystemConfig
4. Verify public page reflects wedding theme

---

## 4. Post-Activation Validation

- Timeline includes wedding entries
- RSVP endpoint active
- Guest pages accessible
- Private vault still protected
- Admin editing allowed

---

## 5. Archive Preparation (Post-Wedding)

After wedding:

- Review RSVP data
- Export data if desired
- Decide whether to switch to ARCHIVE

ARCHIVE must disable:
- New letters
- Timeline edits
- Guest request

---

## 6. Rule

Mode switching must never be done via direct DB manipulation.

Always use admin endpoint.