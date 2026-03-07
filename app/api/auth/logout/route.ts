import { clearSessionCookie } from "@/src/lib/auth"
import { successResponse } from "@/src/lib/response"

/**
 * POST /api/auth/logout
 *
 * Clears the session cookie and logs the user out.
 */
export async function POST() {
  await clearSessionCookie()
  return successResponse({ message: "Logged out" })
}
