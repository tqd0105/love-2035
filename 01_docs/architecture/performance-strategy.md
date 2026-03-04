File: 01_docs/architecture/performance-strategy.md

# Performance Strategy

## 1. Purpose

Ensure system remains responsive as data grows over years.

---

## 2. Database Indexing

Must index:

- user.email
- timeline_events.date
- letters.unlockAt
- events.date
- vault_items.unlockAt

Add composite indexes if query grows.

---

## 3. Query Rules

- Always use select to limit fields.
- Avoid loading large media blobs.
- Prevent N+1 query pattern.

---

## 4. Caching Strategy

Future:

- Cache SystemConfig
- Cache public timeline
- Cache wedding invitation page

Use memory cache or Redis if scale increases.

---

## 5. Media Optimization

- Use blur placeholder
- Lazy load images
- Compress upload
- Use CDN in wedding phase

---

## 6. Archive Optimization

ARCHIVE mode should:

- Disable writes
- Reduce dynamic computation
- Serve mostly static content

---

## 7. Performance Budget

Target:

- API response < 300ms
- Initial load < 2s
- Database query < 100ms

If exceeded → investigate.