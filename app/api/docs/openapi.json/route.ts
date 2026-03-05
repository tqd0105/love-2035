import { NextResponse } from "next/server"
import { openApiSpec } from "@/src/lib/openapi"

export function GET() {
  return NextResponse.json(openApiSpec)
}
