import "dotenv/config"

// Supabase uses self-signed cert
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

// Ensure JWT_SECRET is set for tests
if (!process.env["JWT_SECRET"]) {
  process.env["JWT_SECRET"] = "test-secret-for-integration-tests"
}
