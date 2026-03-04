import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcrypt"

// Supabase dùng self-signed cert, cần tắt verify
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! })
const prisma = new PrismaClient({ adapter })

const SALT_ROUNDS = 12

async function main() {
  const defaultPassword = await bcrypt.hash("Love2035@admin", SALT_ROUNDS)
  const couplePassword = await bcrypt.hash("Love2035@couple", SALT_ROUNDS)

  // 1. System config mặc định
  await prisma.systemConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      mode: "RELATIONSHIP",
      weddingEnabled: false,
      archiveEnabled: false,
    },
  })
  console.log("✔ SystemConfig seeded")

  // 2. Admin user
  await prisma.user.upsert({
    where: { email: "admin@love2035.com" },
    update: {},
    create: {
      email: "admin@love2035.com",
      passwordHash: defaultPassword,
      role: "ADMIN",
    },
  })
  console.log("✔ Admin user seeded")

  // 3. Couple users
  const personA = await prisma.user.upsert({
    where: { email: "persona@love2035.com" },
    update: {},
    create: {
      email: "persona@love2035.com",
      passwordHash: couplePassword,
      role: "COUPLE",
    },
  })

  const personB = await prisma.user.upsert({
    where: { email: "personb@love2035.com" },
    update: {},
    create: {
      email: "personb@love2035.com",
      passwordHash: couplePassword,
      role: "COUPLE",
    },
  })
  console.log("✔ Couple users seeded")

  // 4. Profiles
  await prisma.profile.upsert({
    where: { id: "profile-a" },
    update: {},
    create: {
      id: "profile-a",
      owner: "PERSON_A",
      displayName: "Person A",
      bio: "Hello from Person A 💕",
      visibility: "COUPLE",
    },
  })

  await prisma.profile.upsert({
    where: { id: "profile-b" },
    update: {},
    create: {
      id: "profile-b",
      owner: "PERSON_B",
      displayName: "Person B",
      bio: "Hello from Person B 💕",
      visibility: "COUPLE",
    },
  })
  console.log("✔ Profiles seeded")

  // 5. Sample timeline event
  await prisma.timelineEvent.upsert({
    where: { id: "timeline-first" },
    update: {},
    create: {
      id: "timeline-first",
      title: "Ngày đầu tiên gặp nhau",
      description: "Kỷ niệm ngày đầu tiên",
      timelineType: "MEMORY",
      date: new Date("2025-01-01"),
      visibility: "COUPLE",
      isHighlighted: true,
    },
  })
  console.log("✔ Timeline events seeded")
}

main()
  .then(() => {
    console.log("\n🌱 Seed completed successfully!")
  })
  .catch((e) => {
    console.error("Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })