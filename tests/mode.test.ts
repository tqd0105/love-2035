import { describe, it, expect, beforeEach, afterAll } from "vitest"
import {
  clearCookies,
  setAuthCookie,
  createTestRequest,
  jsonRequest,
  parseJson,
} from "./helpers"

vi.mock("next/headers", () => ({
  cookies: async () => (globalThis as any).__testCookies,
}))

import { GET, PUT } from "@/app/api/admin/mode/route"
import { POST as createTimeline } from "@/app/api/timeline/create/route"
import { invalidateModeCache } from "@/src/services/mode.service"

describe("Mode Flow", () => {
  beforeEach(() => {
    clearCookies()
    invalidateModeCache()
  })

  // Always restore RELATIONSHIP mode after these tests
  afterAll(async () => {
    clearCookies()
    invalidateModeCache()
    await setAuthCookie("admin-user", "ADMIN")

    const req = jsonRequest("/api/admin/mode", { mode: "RELATIONSHIP" }, "PUT")
    await PUT(req)
  })

  describe("GET /api/admin/mode", () => {
    it("ADMIN can read current system config", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = createTestRequest("/api/admin/mode")
      const res = await GET(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data).toHaveProperty("mode")
    })

    it("COUPLE cannot access admin mode endpoint", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      const req = createTestRequest("/api/admin/mode")
      const res = await GET(req)

      expect(res.status).toBe(403)
    })
  })

  describe("Mode switching and enforcement", () => {
    it("ADMIN can switch to ARCHIVE mode", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = jsonRequest("/api/admin/mode", { mode: "ARCHIVE" }, "PUT")
      const res = await PUT(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it("ARCHIVE mode blocks timeline creation", async () => {
      // Switch to ARCHIVE as admin
      await setAuthCookie("admin-user", "ADMIN")
      const switchReq = jsonRequest(
        "/api/admin/mode",
        { mode: "ARCHIVE" },
        "PUT",
      )
      await PUT(switchReq)
      invalidateModeCache()

      // Try to create timeline as couple
      clearCookies()
      await setAuthCookie("couple-user", "COUPLE")

      const createReq = jsonRequest("/api/timeline/create", {
        title: "Should be blocked",
        timelineType: "MEMORY",
        date: new Date().toISOString(),
        visibility: "COUPLE",
      })
      const res = await createTimeline(createReq)
      const body = await parseJson(res)

      expect(res.status).toBe(403)
      expect(body.success).toBe(false)
      expect(body.error?.message).toContain("ARCHIVE")

      // Restore mode
      clearCookies()
      await setAuthCookie("admin-user", "ADMIN")
      const restoreReq = jsonRequest(
        "/api/admin/mode",
        { mode: "RELATIONSHIP" },
        "PUT",
      )
      await PUT(restoreReq)
      invalidateModeCache()
    })

    it("RELATIONSHIP mode allows timeline creation", async () => {
      // Ensure RELATIONSHIP mode
      await setAuthCookie("admin-user", "ADMIN")
      const switchReq = jsonRequest(
        "/api/admin/mode",
        { mode: "RELATIONSHIP" },
        "PUT",
      )
      await PUT(switchReq)
      invalidateModeCache()

      // Create timeline as couple
      clearCookies()
      await setAuthCookie("couple-user", "COUPLE")

      const createReq = jsonRequest("/api/timeline/create", {
        title: "Mode test event",
        timelineType: "MEMORY",
        date: new Date().toISOString(),
        visibility: "COUPLE",
      })
      const res = await createTimeline(createReq)
      const body = await parseJson(res)

      expect(res.status).toBe(201)
      expect(body.success).toBe(true)
      expect(body.data.timelineEvent).toBeDefined()
    })

    it("rejects invalid mode value", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = jsonRequest(
        "/api/admin/mode",
        { mode: "INVALID_MODE" },
        "PUT",
      )
      const res = await PUT(req)

      expect(res.status).toBe(400)
    })
  })
})
