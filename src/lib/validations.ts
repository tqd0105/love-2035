import { z } from "zod"
import { AppError, ErrorCode } from "@/src/lib/errors"

// ── Schemas ────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email format"),
  password: z
    .string({ error: "Password is required" })
    .trim()
    .min(1, "Password cannot be empty"),
})

export const createEventSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title is required"),
  eventType: z.enum(["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"], {
    error: "eventType must be one of: ANNIVERSARY, MILESTONE, WEDDING, CUSTOM",
  }),
  date: z
    .string({ error: "A valid date is required" })
    .refine((v) => !isNaN(Date.parse(v)), "A valid date is required"),
  visibility: z.enum(["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"], {
    error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
  }),
  description: z.string().trim().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().trim().optional(),
})

export const createLetterSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(1, "Title is required"),
  content: z
    .string({ error: "Content is required" })
    .trim()
    .min(1, "Content is required"),
  letterType: z.enum(["REGULAR", "TIME_LOCKED", "PASSWORD_LOCKED", "FUTURE_MESSAGE"], {
    error: "letterType must be one of: REGULAR, TIME_LOCKED, PASSWORD_LOCKED, FUTURE_MESSAGE",
  }),
  visibility: z.enum(["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"], {
    error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
  }),
  unlockAt: z
    .string()
    .refine((v) => !isNaN(Date.parse(v)), "Invalid unlockAt date format")
    .optional(),
  password: z.string().optional(),
  moodTags: z.array(z.string()).optional(),
  musicUrl: z.string().trim().optional(),
  isReadTracking: z.boolean().optional(),
})

export const createWishSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be at most 1000 characters"),
  photoUrl: z.string().trim().optional(),
})

export const mediaVisibilitySchema = z.enum(
  ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"],
  {
    error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
  },
)

export const guestRequestSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(1, "Name cannot be empty")
    .max(100, "Name must be at most 100 characters"),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email format"),
  relationship: z.enum(["friend", "family", "other"], {
    error: "Relationship must be one of: friend, family, other",
  }),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  message: z
    .string()
    .trim()
    .max(500, "Message must be at most 500 characters")
    .optional()
    .transform((v) => v || null),
})

// ── Helper ─────────────────────────────────────────────────────

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join("; ")
    throw new AppError(ErrorCode.VALIDATION_ERROR, message, 400)
  }
  return result.data
}
