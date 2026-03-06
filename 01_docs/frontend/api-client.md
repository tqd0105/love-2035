# API Client

## Overview

All backend communication must go through a central API client.

Location:

lib/api/client.ts

This ensures:

- consistent headers
- error handling
- authentication support

---

## API Base URL

Base URL comes from environment variable.

NEXT_PUBLIC_BASE_URL

Example:

/api/events/list

---

## Response Format

All backend responses follow this format:

Success:

{
  success: true,
  data: ...
}

Error:

{
  success: false,
  error: {
    code: "...",
    message: "..."
  }
}

The API client must normalize responses.

---

## Example Usage

Hook calls API client.

Example:

useTimeline()

↓

apiClient.get("/timeline/list")

↓

return data