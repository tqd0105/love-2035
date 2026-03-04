# API Contracts

## Response Format

All responses must follow:

```json
{
  "success": true,
  "data": {}
}
```

Error format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message"
  }
}
```

---

## Auth

### POST /api/auth/login

Request:

```json
{
  "email": "string",
  "password": "string"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "role": "ADMIN | COUPLE | APPROVED_GUEST"
    }
  }
}
```

---

### POST /api/auth/refresh

No body.

Response: new access token via cookie.

---

## Event

### GET /api/event

Return list of events based on visibility.

---

### POST /api/event

Role: ADMIN or COUPLE

---

## Timeline

### GET /api/timeline

Return sorted timeline events with visibility applied.

---

## Letter

### GET /api/letter/:id

Apply:
- Visibility check
- Time-lock check
- Password-lock check

---

## Vault

### GET /api/vault/:id

Role: COUPLE only
Apply unlock logic