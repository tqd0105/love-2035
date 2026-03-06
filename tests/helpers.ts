import { NextRequest } from "next/server"
import { createSessionToken } from "@/src/lib/auth"
import type { Role } from "@/generated/prisma/client"

// ---------------------------------------------------------------------------
// Mock cookie store — shared with vi.mock("next/headers") in each test file.
//
// Each test file must include:
//   vi.mock("next/headers", () => ({
//     cookies: async () => (globalThis as any).__testCookies,
//   }))
// ---------------------------------------------------------------------------

const store = new Map<string, string>()

export const testCookies = {
  get(name: string) {
    const value = store.get(name)
    return value ? { name, value } : undefined
  },
  set(name: string, value: string, _options?: unknown) {
    store.set(name, value)
  },
  delete(name: string) {
    store.delete(name)
  },
}

// Expose on globalThis so the vi.mock factory can access it at runtime
;(globalThis as any).__testCookies = testCookies

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

export function clearCookies() {
  store.clear()
}

/**
 * Set a session cookie with a JWT for the given role.
 * Useful when you want to skip the login flow and authenticate directly.
 */
export async function setAuthCookie(userId: string, role: Role) {
  const token = await createSessionToken({ userId, role })
  store.set("session", token)
}

// ---------------------------------------------------------------------------
// Request helpers
// ---------------------------------------------------------------------------

export function createTestRequest(
  path: string,
  init?: RequestInit,
): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"), init as never)
}

export function jsonRequest(
  path: string,
  body: unknown,
  method = "POST",
): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"), {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

export async function parseJson(response: Response) {
  return response.json() as Promise<{
    success: boolean
    data?: any
    error?: { code: string; message: string }
  }>
}
