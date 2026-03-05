import { describe, it, expect, beforeEach } from "vitest"
import { clearCookies, jsonRequest, createTestRequest, parseJson } from "./helpers"

// Mock next/headers — must appear in every test file
vi.mock("next/headers", () => ({
  cookies: async () => (globalThis as any).__testCookies,
}))

// Route handlers under test
import { POST } from "@/app/api/auth/login/route"
import { GET as listEvents } from "@/app/api/events/list/route"

describe("Auth Flow", () => {
  beforeEach(() => {
    clearCookies()
  })

  describe("POST /api/auth/login", () => {
    it("returns 200 with user data for valid admin credentials", async () => {
      const req = jsonRequest("/api/auth/login", {
        email: "admin@love2035.com",
        password: "Love2035@admin",
      })

      const res = await POST(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.user).toBeDefined()
      expect(body.data.user.role).toBe("ADMIN")
    })

    it("returns 200 with user data for valid couple credentials", async () => {
      const req = jsonRequest("/api/auth/login", {
        email: "persona@love2035.com",
        password: "Love2035@couple",
      })

      const res = await POST(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.user.role).toBe("COUPLE")
    })

    it("returns 401 for wrong password", async () => {
      const req = jsonRequest("/api/auth/login", {
        email: "admin@love2035.com",
        password: "wrongpassword",
      })

      const res = await POST(req)
      const body = await parseJson(res)

      expect(res.status).toBe(401)
      expect(body.success).toBe(false)
    })

    it("returns 400 for missing fields", async () => {
      const req = jsonRequest("/api/auth/login", {
        email: "admin@love2035.com",
      })

      const res = await POST(req)
      const body = await parseJson(res)

      expect(res.status).toBe(400)
      expect(body.success).toBe(false)
    })

    it("returns 400 for empty email", async () => {
      const req = jsonRequest("/api/auth/login", {
        email: "",
        password: "Love2035@admin",
      })

      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe("Protected route after login", () => {
    it("can access events/list after successful login", async () => {
      // Login first — sets session cookie in mock store
      const loginReq = jsonRequest("/api/auth/login", {
        email: "admin@love2035.com",
        password: "Love2035@admin",
      })
      const loginRes = await POST(loginReq)
      expect(loginRes.status).toBe(200)

      // Now access protected route — cookie is already set
      const listReq = createTestRequest("/api/events/list")
      const listRes = await listEvents(listReq)
      const body = await parseJson(listRes)

      expect(listRes.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.events).toBeDefined()
    })

    it("cannot access protected route without login", async () => {
      const req = createTestRequest("/api/events/list")
      const res = await listEvents(req)

      expect(res.status).toBe(401)
    })
  })
})
