import type { OpenAPIV3 } from "openapi-types"

const Role = { type: "string" as const, enum: ["ADMIN", "COUPLE", "APPROVED_GUEST", "PUBLIC_VISITOR"] }
const Visibility = { type: "string" as const, enum: ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"] }
const EventType = { type: "string" as const, enum: ["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"] }
const LetterType = { type: "string" as const, enum: ["REGULAR", "TIME_LOCKED", "PASSWORD_LOCKED", "FUTURE_MESSAGE"] }
const TimelineType = { type: "string" as const, enum: ["MEMORY", "MILESTONE", "ANNIVERSARY", "WEDDING"] }
const VaultType = { type: "string" as const, enum: ["SECRET_LETTER", "PRIVATE_MEMORY", "TIME_CAPSULE", "PRIVATE_MEDIA"] }
const Mode = { type: "string" as const, enum: ["RELATIONSHIP", "WEDDING", "ARCHIVE"] }

function success(dataSchema: OpenAPIV3.SchemaObject): OpenAPIV3.SchemaObject {
  return {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: dataSchema,
    },
  }
}

function errorResp(desc: string): OpenAPIV3.ResponseObject {
  return {
    description: desc,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: {
              type: "object",
              properties: {
                code: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
  }
}

const paginationSchema: OpenAPIV3.SchemaObject = {
  type: "object",
  properties: {
    page: { type: "integer" },
    limit: { type: "integer" },
    total: { type: "integer" },
    totalPages: { type: "integer" },
  },
}

const pageParams: OpenAPIV3.ParameterObject[] = [
  { name: "page", in: "query", schema: { type: "integer", default: 1 } },
  { name: "limit", in: "query", schema: { type: "integer", default: 50 } },
]

export const openApiSpec: OpenAPIV3.Document = {
  openapi: "3.0.3",
  info: {
    title: "Love 2035 API",
    version: "1.0.0",
    description: "Backend API for Love 2035 — a long-term digital memory platform.",
  },
  servers: [{ url: "/", description: "Current server" }],
  tags: [
    { name: "Health", description: "Health check" },
    { name: "Auth", description: "Authentication" },
    { name: "Events", description: "Event management" },
    { name: "Timeline", description: "Timeline entries" },
    { name: "Letters", description: "Letter management" },
    { name: "Media", description: "Media uploads" },
    { name: "Wedding", description: "Wedding mode & wishes" },
    { name: "Vault", description: "Privacy vault" },
    { name: "Admin", description: "Admin operations" },
  ],
  paths: {
    // ── Health ──────────────────────────────────────────────
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: success({
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                }),
              },
            },
          },
        },
      },
    },

    // ── Auth ────────────────────────────────────────────────
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        description: "Authenticate with email and password. Rate-limited to 10 req/min per IP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 1 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful. Sets httpOnly session cookie.",
            content: {
              "application/json": {
                schema: success({
                  type: "object",
                  properties: {
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string", format: "uuid" },
                        role: Role,
                      },
                    },
                  },
                }),
              },
            },
          },
          "400": errorResp("Validation error"),
          "401": errorResp("Invalid credentials"),
          "429": errorResp("Rate limited"),
        },
      },
    },

    // ── Events ──────────────────────────────────────────────
    "/api/events/create": {
      post: {
        tags: ["Events"],
        summary: "Create event",
        description: "COUPLE or ADMIN only. Blocked in WEDDING & ARCHIVE modes.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "eventType", "date", "visibility"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  eventType: EventType,
                  date: { type: "string", format: "date-time" },
                  isRecurring: { type: "boolean" },
                  recurrence: { type: "string" },
                  visibility: Visibility,
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Event created", content: { "application/json": { schema: success({ type: "object", properties: { event: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden — wrong role or mode"),
        },
      },
    },
    "/api/events/list": {
      get: {
        tags: ["Events"],
        summary: "List events",
        description: "Paginated, visibility-filtered, cached 60s.",
        security: [{ cookieAuth: [] }],
        parameters: pageParams,
        responses: {
          "200": {
            description: "Event list",
            content: {
              "application/json": {
                schema: success({
                  type: "object",
                  properties: {
                    events: { type: "array", items: { type: "object" } },
                    pagination: paginationSchema,
                  },
                }),
              },
            },
          },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/events/{id}": {
      get: {
        tags: ["Events"],
        summary: "Get event by ID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Event details", content: { "application/json": { schema: success({ type: "object", properties: { event: { type: "object" } } }) } } },
          "401": errorResp("Unauthorized"),
          "404": errorResp("Not found"),
        },
      },
      put: {
        tags: ["Events"],
        summary: "Update event",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE mode.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  eventType: EventType,
                  date: { type: "string", format: "date-time" },
                  isRecurring: { type: "boolean" },
                  recurrence: { type: "string" },
                  visibility: Visibility,
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Event updated", content: { "application/json": { schema: success({ type: "object", properties: { event: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
      delete: {
        tags: ["Events"],
        summary: "Delete event",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE mode.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Event deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
    },

    // ── Timeline ────────────────────────────────────────────
    "/api/timeline": {
      get: {
        tags: ["Timeline"],
        summary: "Get timeline",
        description: "Visibility-filtered, cached 60s.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "year", in: "query", schema: { type: "integer", minimum: 1900, maximum: 2100 } },
          ...pageParams,
        ],
        responses: {
          "200": {
            description: "Timeline entries",
            content: {
              "application/json": {
                schema: success({
                  type: "object",
                  properties: {
                    events: { type: "array", items: { type: "object" } },
                    pagination: paginationSchema,
                  },
                }),
              },
            },
          },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/timeline/list": {
      get: {
        tags: ["Timeline"],
        summary: "List timeline entries",
        description: "Chronological order. Visibility-filtered, cached 60s.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "year", in: "query", schema: { type: "integer" } },
          ...pageParams,
        ],
        responses: {
          "200": {
            description: "Timeline list",
            content: { "application/json": { schema: success({ type: "object", properties: { events: { type: "array", items: { type: "object" } }, pagination: paginationSchema } }) } },
          },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/timeline/recent": {
      get: {
        tags: ["Timeline"],
        summary: "Recent timeline entries",
        description: "Most recent entries first. Cached 60s.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "limit", in: "query", schema: { type: "integer", default: 5, maximum: 20 } }],
        responses: {
          "200": { description: "Recent entries", content: { "application/json": { schema: success({ type: "object", properties: { events: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/timeline/{id}": {
      get: {
        tags: ["Timeline"],
        summary: "Get timeline entry by ID",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Timeline entry", content: { "application/json": { schema: success({ type: "object", properties: { timelineEvent: { type: "object" } } }) } } },
          "401": errorResp("Unauthorized"),
          "404": errorResp("Not found"),
        },
      },
    },
    "/api/timeline/create": {
      post: {
        tags: ["Timeline"],
        summary: "Create timeline entry",
        description: "COUPLE or ADMIN only. Blocked in WEDDING & ARCHIVE modes.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "timelineType", "date", "visibility"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  timelineType: TimelineType,
                  date: { type: "string", format: "date-time" },
                  visibility: Visibility,
                  isHighlighted: { type: "boolean" },
                  eventId: { type: "string", format: "uuid" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Timeline entry created", content: { "application/json": { schema: success({ type: "object", properties: { timelineEvent: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },

    // ── Letters ─────────────────────────────────────────────
    "/api/letters/create": {
      post: {
        tags: ["Letters"],
        summary: "Create letter",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE & WEDDING modes.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "content", "letterType", "visibility"],
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  letterType: LetterType,
                  visibility: Visibility,
                  unlockAt: { type: "string", format: "date-time" },
                  password: { type: "string" },
                  moodTags: { type: "array", items: { type: "string" } },
                  musicUrl: { type: "string" },
                  isReadTracking: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Letter created", content: { "application/json": { schema: success({ type: "object", properties: { letter: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/letters/list": {
      get: {
        tags: ["Letters"],
        summary: "List letters",
        description: "Summary only (no full content). Visibility-filtered.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Letter list", content: { "application/json": { schema: success({ type: "object", properties: { letters: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/letters/{id}": {
      get: {
        tags: ["Letters"],
        summary: "Get letter by ID",
        description: "Visibility check, time-lock check, password check. Can return 423 (Locked).",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "password", in: "query", schema: { type: "string" }, description: "For password-locked letters" },
        ],
        responses: {
          "200": { description: "Letter details", content: { "application/json": { schema: success({ type: "object", properties: { letter: { type: "object" } } }) } } },
          "401": errorResp("Unauthorized"),
          "404": errorResp("Not found"),
          "423": errorResp("Locked — time-locked or password required"),
        },
      },
      put: {
        tags: ["Letters"],
        summary: "Update letter",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE mode.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  letterType: LetterType,
                  visibility: Visibility,
                  unlockAt: { type: "string", format: "date-time" },
                  password: { type: "string" },
                  moodTags: { type: "array", items: { type: "string" } },
                  musicUrl: { type: "string" },
                  isReadTracking: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Letter updated", content: { "application/json": { schema: success({ type: "object", properties: { letter: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
      delete: {
        tags: ["Letters"],
        summary: "Delete letter",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE mode.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Letter deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
    },

    // ── Media ───────────────────────────────────────────────
    "/api/media/upload": {
      post: {
        tags: ["Media"],
        summary: "Upload media",
        description: "COUPLE or ADMIN only. Multipart form-data. Rate-limited 10 req/min. Max 5 MB.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: { type: "string", format: "binary" },
                  visibility: { ...Visibility, default: "COUPLE" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Media uploaded", content: { "application/json": { schema: success({ type: "object", properties: { media: { type: "object", properties: { id: { type: "string" }, url: { type: "string" }, mediaType: { type: "string" }, visibility: Visibility } } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "413": errorResp("Payload too large"),
          "429": errorResp("Rate limited"),
        },
      },
    },
    "/api/media/list": {
      get: {
        tags: ["Media"],
        summary: "List media",
        description: "Returns id, url, mediaType only. Paginated, visibility-filtered.",
        security: [{ cookieAuth: [] }],
        parameters: pageParams,
        responses: {
          "200": {
            description: "Media list",
            content: { "application/json": { schema: success({ type: "object", properties: { media: { type: "array", items: { type: "object", properties: { id: { type: "string" }, url: { type: "string" }, mediaType: { type: "string" } } } }, pagination: paginationSchema } }) } },
          },
          "401": errorResp("Unauthorized"),
        },
      },
    },
    "/api/media/{id}": {
      get: {
        tags: ["Media"],
        summary: "Get media by ID",
        description: "Visibility check enforced. Cached 5 minutes.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Media details", content: { "application/json": { schema: success({ type: "object", properties: { media: { type: "object" } } }) } } },
          "401": errorResp("Unauthorized"),
          "404": errorResp("Not found"),
        },
      },
      delete: {
        tags: ["Media"],
        summary: "Delete media",
        description: "COUPLE or ADMIN only. Blocked in ARCHIVE mode.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Media deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
    },

    // ── Wedding ─────────────────────────────────────────────
    "/api/wedding/portal": {
      get: {
        tags: ["Wedding"],
        summary: "Wedding portal",
        description: "Available only in WEDDING mode. Cached 30s.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Wedding portal data",
            content: {
              "application/json": {
                schema: success({
                  type: "object",
                  properties: {
                    portal: {
                      type: "object",
                      properties: {
                        mode: Mode,
                        weddingEnabled: { type: "boolean" },
                        wishes: { type: "array", items: { type: "object" } },
                        wishCount: { type: "integer" },
                      },
                    },
                  },
                }),
              },
            },
          },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Not in WEDDING mode"),
        },
      },
    },
    "/api/wedding/wishes/list": {
      get: {
        tags: ["Wedding"],
        summary: "List wedding wishes",
        description: "Available only in WEDDING mode. Cached 30s.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Wishes list", content: { "application/json": { schema: success({ type: "object", properties: { wishes: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Not in WEDDING mode"),
        },
      },
    },
    "/api/wedding/wishes/create": {
      post: {
        tags: ["Wedding"],
        summary: "Create wedding wish",
        description: "WEDDING mode required. Rate-limited 10 req/min.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "message"],
                properties: {
                  name: { type: "string" },
                  message: { type: "string", maxLength: 1000 },
                  photoUrl: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Wish created", content: { "application/json": { schema: success({ type: "object", properties: { wish: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Not in WEDDING mode"),
          "429": errorResp("Rate limited"),
        },
      },
    },
    "/api/wedding/wishes/{id}": {
      delete: {
        tags: ["Wedding"],
        summary: "Delete wish",
        description: "ADMIN or COUPLE only. WEDDING mode required.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Wish deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
    },

    // ── Vault ───────────────────────────────────────────────
    "/api/vault/list": {
      get: {
        tags: ["Vault"],
        summary: "List vault items",
        description: "COUPLE or ADMIN only. Summary only (no decrypted content).",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Vault items", content: { "application/json": { schema: success({ type: "object", properties: { items: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/vault/create": {
      post: {
        tags: ["Vault"],
        summary: "Create vault item",
        description: "COUPLE or ADMIN only. Blocked in WEDDING & ARCHIVE modes.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title", "contentEncrypted", "vaultType"],
                properties: {
                  title: { type: "string" },
                  contentEncrypted: { type: "string" },
                  vaultType: VaultType,
                  unlockAt: { type: "string", format: "date-time" },
                  requiresPassword: { type: "boolean" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "Vault item created", content: { "application/json": { schema: success({ type: "object", properties: { item: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/vault/{id}": {
      get: {
        tags: ["Vault"],
        summary: "Get vault item",
        description: "COUPLE or ADMIN only. Time-lock and password checks apply. Can return 423.",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          { name: "password", in: "query", schema: { type: "string" }, description: "For password-protected items" },
        ],
        responses: {
          "200": { description: "Vault item", content: { "application/json": { schema: success({ type: "object", properties: { item: { type: "object" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
          "423": errorResp("Locked"),
        },
      },
      put: {
        tags: ["Vault"],
        summary: "Update vault item",
        description: "COUPLE or ADMIN only. Blocked in WEDDING & ARCHIVE modes.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  contentEncrypted: { type: "string" },
                  vaultType: VaultType,
                  unlockAt: { type: "string", format: "date-time" },
                  requiresPassword: { type: "boolean" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Vault item updated", content: { "application/json": { schema: success({ type: "object", properties: { item: { type: "object" } } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
      delete: {
        tags: ["Vault"],
        summary: "Delete vault item",
        description: "COUPLE or ADMIN only. Blocked in WEDDING & ARCHIVE modes.",
        security: [{ cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Vault item deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
          "404": errorResp("Not found"),
        },
      },
    },

    // ── Admin ───────────────────────────────────────────────
    "/api/admin/mode": {
      get: {
        tags: ["Admin"],
        summary: "Get system mode",
        description: "ADMIN only.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "Current system config", content: { "application/json": { schema: success({ type: "object", properties: { mode: Mode } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
      put: {
        tags: ["Admin"],
        summary: "Set system mode",
        description: "ADMIN only. Switches system-wide mode.",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["mode"],
                properties: { mode: Mode },
              },
            },
          },
        },
        responses: {
          "200": { description: "Mode updated", content: { "application/json": { schema: success({ type: "object", properties: { mode: Mode } }) } } },
          "400": errorResp("Validation error"),
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/admin/events": {
      get: {
        tags: ["Admin"],
        summary: "List all events (admin)",
        description: "ADMIN only. No visibility filter.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "All events", content: { "application/json": { schema: success({ type: "object", properties: { events: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete event (admin)",
        description: "ADMIN only.",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } } } },
        responses: {
          "200": { description: "Event deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/admin/media": {
      get: {
        tags: ["Admin"],
        summary: "List all media (admin)",
        description: "ADMIN only. No visibility filter.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "All media", content: { "application/json": { schema: success({ type: "object", properties: { media: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete media (admin)",
        description: "ADMIN only.",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } } } },
        responses: {
          "200": { description: "Media deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/admin/wishes": {
      get: {
        tags: ["Admin"],
        summary: "List all wishes (admin)",
        description: "ADMIN only.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": { description: "All wishes", content: { "application/json": { schema: success({ type: "object", properties: { wishes: { type: "array", items: { type: "object" } } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete wish (admin)",
        description: "ADMIN only.",
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["id"], properties: { id: { type: "string", format: "uuid" } } } } } },
        responses: {
          "200": { description: "Wish deleted", content: { "application/json": { schema: success({ type: "object", properties: { message: { type: "string" } } }) } } },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
    "/api/admin/export": {
      get: {
        tags: ["Admin"],
        summary: "Export all data",
        description: "ADMIN only. Downloads JSON file with all timeline events, letters, and media metadata.",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "JSON export file",
            content: { "application/json": { schema: { type: "object" } } },
            headers: {
              "Content-Disposition": { schema: { type: "string", example: 'attachment; filename="love-2035-export-2026-03-05.json"' } },
            },
          },
          "401": errorResp("Unauthorized"),
          "403": errorResp("Forbidden"),
        },
      },
    },
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "session",
        description: "Session cookie set by POST /api/auth/login",
      },
    },
  },
}
