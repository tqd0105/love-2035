import "dotenv/config"

/**
 * Smoke test — verify all core endpoints respond correctly.
 *
 * Usage:  npx tsx scripts/smoke-test.ts
 *         npx tsx scripts/smoke-test.ts http://localhost:3000
 */

const BASE = process.argv[2] ?? "http://localhost:3000"

interface TestCase {
  name: string
  method: "GET" | "POST"
  path: string
  body?: Record<string, unknown>
  expectedStatus: number | number[]
  needsAuth?: boolean
}

const tests: TestCase[] = [
  {
    name: "Auth Login",
    method: "POST",
    path: "/api/auth/login",
    body: { email: "admin@love2035.com", password: "Love2035@admin" },
    expectedStatus: 200,
  },
  {
    name: "Events List",
    method: "GET",
    path: "/api/events/list",
    expectedStatus: 200,
    needsAuth: true,
  },
  {
    name: "Timeline List",
    method: "GET",
    path: "/api/timeline/list",
    expectedStatus: 200,
    needsAuth: true,
  },
  {
    name: "Letters List",
    method: "GET",
    path: "/api/letters/list",
    expectedStatus: 200,
    needsAuth: true,
  },
  {
    name: "Wedding Wishes List",
    method: "GET",
    path: "/api/wedding/wishes/list",
    expectedStatus: [200, 403],
    needsAuth: true,
  },
]

async function getSessionCookie(): Promise<string> {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@love2035.com", password: "Love2035@admin" }),
    redirect: "manual",
  })

  if (!res.ok) {
    throw new Error(`Login failed (${res.status}) — cannot run authenticated tests`)
  }

  const setCookie = res.headers.getSetCookie?.() ?? []
  const session = setCookie.find((c) => c.startsWith("session="))
  if (!session) {
    throw new Error("No session cookie returned from login")
  }

  return session.split(";")[0]!
}

async function runTest(test: TestCase, cookie: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = {}
    if (test.needsAuth) headers["Cookie"] = cookie
    if (test.body) headers["Content-Type"] = "application/json"

    const res = await fetch(`${BASE}${test.path}`, {
      method: test.method,
      headers,
      body: test.body ? JSON.stringify(test.body) : undefined,
    })

    const accepted = Array.isArray(test.expectedStatus)
      ? test.expectedStatus.includes(res.status)
      : res.status === test.expectedStatus

    if (accepted) {
      console.log(`  ✔ ${test.name}: PASS (${res.status})`)
      return true
    }

    const body = await res.text().catch(() => "")
    console.log(`  ✘ ${test.name}: FAIL (expected ${test.expectedStatus}, got ${res.status})`)
    if (body) console.log(`    → ${body.slice(0, 200)}`)
    return false
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.log(`  ✘ ${test.name}: FAIL (network error: ${msg})`)
    return false
  }
}

async function main() {
  console.log(`\n🔍 Smoke testing ${BASE}\n`)

  let cookie: string
  try {
    cookie = await getSessionCookie()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`❌ ${msg}`)
    process.exit(1)
  }

  let passed = 0
  let failed = 0

  for (const test of tests) {
    const ok = await runTest(test, cookie)
    if (ok) passed++
    else failed++
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length}\n`)

  if (failed > 0) process.exit(1)
}

main()
