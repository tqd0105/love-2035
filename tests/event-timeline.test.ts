import { describe, it, expect, beforeEach, beforeAll } from "vitest"
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

import { POST as createEvent } from "@/app/api/events/create/route"
import { GET as listEvents } from "@/app/api/events/list/route"
import { POST as createTimeline } from "@/app/api/timeline/create/route"
import { GET as getTimeline } from "@/app/api/timeline/route"
import { invalidateModeCache } from "@/src/services/mode.service"
import { invalidateCacheByPrefix } from "@/src/lib/cache"

describe("Event & Timeline Integration", () => {
  beforeAll(() => {
    invalidateModeCache()
  })

  beforeEach(() => {
    clearCookies()
    invalidateCacheByPrefix("timeline")
    invalidateCacheByPrefix("events")
  })

  describe("Event creation and listing", () => {
    it("COUPLE can create an event and see it in the list", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      // Create event
      const createReq = jsonRequest("/api/events/create", {
        title: "Integration Test Event",
        eventType: "CUSTOM",
        date: new Date().toISOString(),
        visibility: "COUPLE",
      })
      const createRes = await createEvent(createReq)
      const createBody = await parseJson(createRes)

      expect(createRes.status).toBe(201)
      expect(createBody.success).toBe(true)
      expect(createBody.data.event).toBeDefined()
      expect(createBody.data.event.title).toBe("Integration Test Event")

      const eventId = createBody.data.event.id

      // List events — should include the new event
      clearCookies()
      await setAuthCookie("couple-user", "COUPLE")

      const listReq = createTestRequest("/api/events/list")
      const listRes = await listEvents(listReq)
      const listBody = await parseJson(listRes)

      expect(listRes.status).toBe(200)
      expect(listBody.data.events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: eventId }),
        ]),
      )
    })

    it("ADMIN can create an event", async () => {
      await setAuthCookie("admin-user", "ADMIN")

      const req = jsonRequest("/api/events/create", {
        title: "Admin Event",
        eventType: "MILESTONE",
        date: new Date().toISOString(),
        visibility: "PUBLIC",
      })
      const res = await createEvent(req)
      const body = await parseJson(res)

      expect(res.status).toBe(201)
      expect(body.data.event.title).toBe("Admin Event")
    })

    it("APPROVED_GUEST cannot create an event", async () => {
      await setAuthCookie("guest-user", "APPROVED_GUEST")

      const req = jsonRequest("/api/events/create", {
        title: "Guest Event",
        eventType: "CUSTOM",
        date: new Date().toISOString(),
        visibility: "PUBLIC",
      })
      const res = await createEvent(req)

      expect(res.status).toBe(403)
    })
  })

  describe("Timeline creation and retrieval", () => {
    it("COUPLE can create a timeline event and see it in the list", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      // Create timeline event
      const createReq = jsonRequest("/api/timeline/create", {
        title: "Integration Timeline Event",
        timelineType: "MILESTONE",
        date: new Date().toISOString(),
        visibility: "COUPLE",
      })
      const createRes = await createTimeline(createReq)
      const createBody = await parseJson(createRes)

      expect(createRes.status).toBe(201)
      expect(createBody.data.timelineEvent).toBeDefined()
      expect(createBody.data.timelineEvent.title).toBe(
        "Integration Timeline Event",
      )

      const timelineId = createBody.data.timelineEvent.id

      // Fetch timeline — should include the new event
      invalidateCacheByPrefix("timeline")
      clearCookies()
      await setAuthCookie("couple-user", "COUPLE")

      const getReq = createTestRequest("/api/timeline")
      const getRes = await getTimeline(getReq)
      const getBody = await parseJson(getRes)

      expect(getRes.status).toBe(200)
      expect(getBody.data.events).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: timelineId }),
        ]),
      )
    })

    it("rejects timeline creation with missing required fields", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      const req = jsonRequest("/api/timeline/create", {
        title: "Missing fields",
      })
      const res = await createTimeline(req)

      expect(res.status).toBe(400)
    })

    it("rejects invalid timelineType", async () => {
      await setAuthCookie("couple-user", "COUPLE")

      const req = jsonRequest("/api/timeline/create", {
        title: "Bad Type",
        timelineType: "INVALID",
        date: new Date().toISOString(),
        visibility: "COUPLE",
      })
      const res = await createTimeline(req)

      expect(res.status).toBe(400)
    })
  })
})
