import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcrypt"

// Supabase uses self-signed cert
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"]! })
const prisma = new PrismaClient({ adapter })

const SALT_ROUNDS = 12

async function main() {
  const adminPw = process.env["SEED_ADMIN_PASSWORD"]
  const couplePw = process.env["SEED_COUPLE_PASSWORD"]
  if (!adminPw || !couplePw) {
    throw new Error("Missing SEED_ADMIN_PASSWORD or SEED_COUPLE_PASSWORD in .env")
  }

  const adminPassword = await bcrypt.hash(adminPw, SALT_ROUNDS)
  const couplePassword = await bcrypt.hash(couplePw, SALT_ROUNDS)

  // ── 1. System Config ──────────────────────────────────────
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

  // ── 2. Users ──────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: "admin@love2035.com" },
    update: { passwordHash: adminPassword },
    create: {
      id: "user-admin",
      email: "admin@love2035.com",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  })

  const personA = await prisma.user.upsert({
    where: { email: "persona@love2035.com" },
    update: { passwordHash: couplePassword },
    create: {
      id: "user-persona",
      email: "persona@love2035.com",
      passwordHash: couplePassword,
      role: "COUPLE",
    },
  })

  const personB = await prisma.user.upsert({
    where: { email: "personb@love2035.com" },
    update: { passwordHash: couplePassword },
    create: {
      id: "user-personb",
      email: "personb@love2035.com",
      passwordHash: couplePassword,
      role: "COUPLE",
    },
  })
  console.log("✔ Users seeded (admin + couple)")

  // ── 3. Profiles ───────────────────────────────────────────
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

  // ── 4. Events ─────────────────────────────────────────────
  const eventData = [
    {
      id: "event-first-meeting",
      title: "First Meeting",
      description: "The day we first crossed paths and everything changed.",
      eventType: "MILESTONE" as const,
      date: new Date("2024-02-14"),
      visibility: "COUPLE" as const,
    },
    {
      id: "event-first-date",
      title: "First Date",
      description: "Our very first date — nervous hearts and endless conversation.",
      eventType: "MILESTONE" as const,
      date: new Date("2024-03-01"),
      visibility: "COUPLE" as const,
    },
    {
      id: "event-first-trip",
      title: "First Trip",
      description: "Our first trip together, exploring new places hand in hand.",
      eventType: "CUSTOM" as const,
      date: new Date("2024-06-15"),
      visibility: "APPROVED_GUEST" as const,
    },
    {
      id: "event-proposal",
      title: "Proposal",
      description: "The moment I asked the most important question of my life.",
      eventType: "MILESTONE" as const,
      date: new Date("2025-02-14"),
      visibility: "PUBLIC" as const,
    },
    {
      id: "event-anniversary",
      title: "Anniversary",
      description: "One year of love, laughter, and growing together.",
      eventType: "ANNIVERSARY" as const,
      date: new Date("2025-02-14"),
      isRecurring: true,
      recurrence: "YEARLY",
      visibility: "COUPLE" as const,
    },
  ]

  for (const evt of eventData) {
    await prisma.event.upsert({
      where: { id: evt.id },
      update: {},
      create: evt,
    })
  }
  console.log("✔ Events seeded (5)")

  // ── 5. Timeline Events (linked to events) ────────────────
  const timelineData = [
    {
      id: "timeline-first-meeting",
      title: "First Meeting",
      description: "We met for the first time.",
      timelineType: "MEMORY" as const,
      date: new Date("2024-02-14"),
      visibility: "COUPLE" as const,
      isHighlighted: true,
      eventId: "event-first-meeting",
    },
    {
      id: "timeline-first-date",
      title: "First Date",
      description: "Our first date together.",
      timelineType: "MEMORY" as const,
      date: new Date("2024-03-01"),
      visibility: "COUPLE" as const,
      isHighlighted: false,
      eventId: "event-first-date",
    },
    {
      id: "timeline-first-trip",
      title: "First Trip",
      description: "Traveled to Da Lat together.",
      timelineType: "MILESTONE" as const,
      date: new Date("2024-06-15"),
      visibility: "APPROVED_GUEST" as const,
      isHighlighted: true,
      eventId: "event-first-trip",
    },
    {
      id: "timeline-proposal",
      title: "Proposal",
      description: "The proposal under the stars.",
      timelineType: "MILESTONE" as const,
      date: new Date("2025-02-14"),
      visibility: "PUBLIC" as const,
      isHighlighted: true,
      eventId: "event-proposal",
    },
    {
      id: "timeline-anniversary",
      title: "Anniversary",
      description: "Celebrating one year together.",
      timelineType: "ANNIVERSARY" as const,
      date: new Date("2025-02-14"),
      visibility: "COUPLE" as const,
      isHighlighted: false,
      eventId: "event-anniversary",
    },
  ]

  for (const tl of timelineData) {
    await prisma.timelineEvent.upsert({
      where: { id: tl.id },
      update: {},
      create: tl,
    })
  }
  console.log("✔ Timeline events seeded (5)")

  // ── 6. Letters ────────────────────────────────────────────
  const letterData = [
    {
      id: "letter-anniversary",
      title: "Anniversary Letter",
      content: "My dearest, one year ago our story began. Every moment with you has been a gift I never knew I needed. Here's to a lifetime of us. 💕",
      letterType: "REGULAR" as const,
      visibility: "COUPLE" as const,
      moodTags: ["love", "grateful", "anniversary"],
      isReadTracking: true,
    },
    {
      id: "letter-future",
      title: "Future Letter",
      content: "Dear future us, I'm writing this on a quiet evening. I hope when you read this, we're still laughing at the same silly jokes and holding hands. See you in the future! ✨",
      letterType: "TIME_LOCKED" as const,
      visibility: "COUPLE" as const,
      unlockAt: new Date("2030-01-01"),
      moodTags: ["hope", "future", "nostalgia"],
      isReadTracking: false,
    },
  ]

  for (const lt of letterData) {
    await prisma.letter.upsert({
      where: { id: lt.id },
      update: {},
      create: lt,
    })
  }
  console.log("✔ Letters seeded (2)")

  // ── 7. Media ──────────────────────────────────────────────
  // Note: These are metadata placeholders. Actual files are not created.
  // The schema stores url, mediaType, visibility, and uploadedBy.
  const mediaData = [
    {
      id: "media-first-meeting-photo",
      url: "/uploads/seed-first-meeting.jpg",
      mediaType: "IMAGE" as const,
      visibility: "COUPLE" as const,
      uploadedBy: personA.id,
    },
    {
      id: "media-first-trip-photo",
      url: "/uploads/seed-first-trip.jpg",
      mediaType: "IMAGE" as const,
      visibility: "APPROVED_GUEST" as const,
      uploadedBy: personA.id,
    },
    {
      id: "media-proposal-video",
      url: "/uploads/seed-proposal.mp4",
      mediaType: "VIDEO" as const,
      visibility: "PUBLIC" as const,
      uploadedBy: personB.id,
    },
    {
      id: "media-anniversary-audio",
      url: "/uploads/seed-anniversary-song.mp3",
      mediaType: "AUDIO" as const,
      visibility: "COUPLE" as const,
      uploadedBy: personB.id,
    },
  ]

  for (const m of mediaData) {
    await prisma.media.upsert({
      where: { id: m.id },
      update: {},
      create: m,
    })
  }
  console.log("✔ Media seeded (4 — associated with First Meeting, First Trip, Proposal, Anniversary)")
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