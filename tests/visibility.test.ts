import { describe, it, expect, beforeEach } from "vitest"
import {
  clearCookies,
  setAuthCookie,
  createTestRequest,
  parseJson,
} from "./helpers"

vi.mock("next/headers", () => ({
  cookies: async () => (globalThis as any).__testCookies,
}))

import { GET as listVault } from "@/app/api/vault/list/route"
import { GET as getTimeline } from "@/app/api/timeline/route"

describe("Visibility Flow", () => {
  beforeEach(() => {
    clearCookies()
  })

  describe("Vault access (COUPLE/ADMIN only)", () => {
    it("COUPLE can list vault items", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      const req = createTestRequest("/api/vault/list")
      const res = await listVault(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.data.items).toBeDefined()
    })

    it("ADMIN can list vault items", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = createTestRequest("/api/vault/list")
      const res = await listVault(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it("unauthenticated user gets 401", async () => {
      const req = createTestRequest("/api/vault/list")
      const res = await listVault(req)

      expect(res.status).toBe(401)
    })

    it("APPROVED_GUEST gets 403 for vault", async () => {
      await setAuthCookie("guest-user", "APPROVED_GUEST")

      const req = createTestRequest("/api/vault/list")
      const res = await listVault(req)

      expect(res.status).toBe(403)
    })
  })

  describe("Timeline access (visibility-filtered)", () => {
    it("COUPLE can access timeline", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      const req = createTestRequest("/api/timeline")
      const res = await getTimeline(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it("ADMIN can access timeline", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = createTestRequest("/api/timeline")
      const res = await getTimeline(req)
      const body = await parseJson(res)

      expect(res.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it("unauthenticated user gets 401 for timeline", async () => {
      const req = createTestRequest("/api/timeline")
      const res = await getTimeline(req)

      expect(res.status).toBe(401)
    })
  })
})
