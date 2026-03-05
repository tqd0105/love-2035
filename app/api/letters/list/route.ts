import { NextRequest } from "next/server"
import { successResponse, handleError } from "@/src/lib/response"
import { listLetters } from "@/src/services/letter.service"
import { withVisibilityFilter } from "@/src/middleware/visibility.middleware"

/**
 * GET /api/letters/list
 *
 * List all letters visible to the authenticated user (summary, no content).
 *
 * Flow: Auth → service (visibility filtered at DB level) → respond
 */
const handler = withVisibilityFilter(async (_request, session) => {
  try {
    const letters = await listLetters(session.role)
    return successResponse({ letters })
  } catch (err) {
    return handleError(err)
  }
})

export async function GET(request: NextRequest) {
  return handler(request)
}
