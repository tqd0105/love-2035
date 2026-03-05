import { z } from "zod"
import { AppError, ErrorCode } from "@/src/lib/errors"

// ── Schemas ────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email format"),
  password: z
    .string({ required_error: "Password is required" })
    .trim()
    .min(1, "Password cannot be empty"),
})

export const createEventSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required"),
  eventType: z.enum(["ANNIVERSARY", "MILESTONE", "WEDDING", "CUSTOM"], {
    required_error: "eventType is required",
    invalid_type_error: "eventType must be one of: ANNIVERSARY, MILESTONE, WEDDING, CUSTOM",
  }),
  date: z
    .string({ required_error: "A valid date is required" })
    .refine((v) => !isNaN(Date.parse(v)), "A valid date is required"),
  visibility: z.enum(["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"], {
    required_error: "visibility is required",
    invalid_type_error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
  }),
  description: z.string().trim().optional(),
  isRecurring: z.boolean().optional(),
  recurrence: z.string().trim().optional(),
})

export const createLetterSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title is required"),
  content: z
    .string({ required_error: "Content is required" })
    .trim()
    .min(1, "Content is required"),
  letterType: z.enum(["REGULAR", "TIME_LOCKED", "PASSWORD_LOCKED", "FUTURE_MESSAGE"], {
    required_error: "letterType is required",
    invalid_type_error: "letterType must be one of: REGULAR, TIME_LOCKED, PASSWORD_LOCKED, FUTURE_MESSAGE",
  }),
  visibility: z.enum(["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"], {
    required_error: "visibility is required",
    invalid_type_error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
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
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  message: z
    .string({ required_error: "Message is required" })
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be at most 1000 characters"),
  photoUrl: z.string().trim().optional(),
})

export const mediaVisibilitySchema = z.enum(
  ["PUBLIC", "APPROVED_GUEST", "COUPLE", "PASSWORD_LOCKED"],
  {
    invalid_type_error: "visibility must be one of: PUBLIC, APPROVED_GUEST, COUPLE, PASSWORD_LOCKED",
  },
)

// ── Helper ─────────────────────────────────────────────────────

export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join("; ")
    throw new AppError(ErrorCode.VALIDATION_ERROR, message, 400)
  }
  return result.data
}
