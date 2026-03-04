File: 01_docs/production/wedding-deployment-checklist.md

# Wedding Deployment Checklist

## 1. Purpose

Ensure system stability during wedding event.

No experimental changes allowed near event date.

---

## 2. Timeline

T-30 days:
- Deploy production environment
- Connect real domain
- Configure SSL
- Enable monitoring
- Enable automated backups

T-14 days:
- Activate WEDDING mode on staging
- Simulate guest access
- Test QR code
- Load test with multiple devices

T-7 days:
- Switch production to WEDDING mode
- Pre-upload wedding album
- Pre-warm public pages
- Verify database health

T-1 day:
- Freeze code
- Freeze schema
- No new deployments
- Confirm backup completed

Wedding Day:
- Monitor logs
- Monitor health endpoint
- Do not deploy anything

---

## 3. Critical Verification Checklist

- Domain resolves correctly
- HTTPS valid
- Timeline loads < 2s
- Wedding album loads properly
- No private content exposed
- Guest pages accessible without login
- Health endpoint returns OK
- Database connected

---

## 4. Emergency Plan

If site fails:

- Switch to static fallback page
- Display QR linking to fallback
- Investigate after ceremony

Never debug live during ceremony.