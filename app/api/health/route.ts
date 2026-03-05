import { NextResponse } from "next/server"

/**
 * GET /api/health
 *
 * Basic health check endpoint for monitoring and deployment probes.
 * No auth required. Does not query the database.
 */
export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() })
}
