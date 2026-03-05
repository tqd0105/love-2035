import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { logger } from "@/src/lib/logger"
import { env } from "@/src/lib/env"

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2_000

async function connectWithRetry(client: PrismaClient): Promise<void> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await client.$connect()
      logger.info("Database connected")
      return
    } catch (err) {
      logger.error({ attempt, maxRetries: MAX_RETRIES, err }, "Database connection failed")
      if (attempt === MAX_RETRIES) throw err
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
    }
  }
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })
  const client = new PrismaClient({ adapter })

  // Eager connect with retry — fire-and-forget so module loading isn't blocked
  connectWithRetry(client).catch(() => {
    logger.error("All database connection retries exhausted")
  })

  return client
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache on globalThis in ALL environments to prevent recreation during hot reload
globalForPrisma.prisma = prisma
