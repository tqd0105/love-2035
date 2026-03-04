# Error Convention

## Error Codes

- UNAUTHORIZED
- FORBIDDEN
- NOT_FOUND
- VALIDATION_ERROR
- INVALID_CREDENTIALS
- LOCKED
- INTERNAL_ERROR

---

## Rule

- Never expose internal stack trace
- Never expose password mismatch reason
- Always return consistent shape
- Always use HTTP status code correctly