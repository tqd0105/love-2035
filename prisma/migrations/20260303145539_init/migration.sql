-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'COUPLE', 'APPROVED_GUEST', 'PUBLIC_VISITOR');

-- CreateEnum
CREATE TYPE "Mode" AS ENUM ('RELATIONSHIP', 'WEDDING', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'APPROVED_GUEST', 'COUPLE', 'PASSWORD_LOCKED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ANNIVERSARY', 'MILESTONE', 'WEDDING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TimelineType" AS ENUM ('MEMORY', 'MILESTONE', 'ANNIVERSARY', 'WEDDING');

-- CreateEnum
CREATE TYPE "LetterType" AS ENUM ('REGULAR', 'TIME_LOCKED', 'PASSWORD_LOCKED', 'FUTURE_MESSAGE');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "ProfileOwner" AS ENUM ('PERSON_A', 'PERSON_B');

-- CreateEnum
CREATE TYPE "ProfileSectionType" AS ENUM ('LIKES', 'DISLIKES', 'UNKNOWN_FACTS', 'LESSONS_LEARNED', 'FAVORITE_MEMORY', 'QUOTE');

-- CreateEnum
CREATE TYPE "VaultContentType" AS ENUM ('SECRET_LETTER', 'PRIVATE_MEMORY', 'TIME_CAPSULE', 'PRIVATE_MEDIA');

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "mode" "Mode" NOT NULL,
    "weddingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "archiveEnabled" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_requests" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,

    CONSTRAINT "guest_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventType" "EventType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" TEXT,
    "visibility" "Visibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "blurDataUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "uploadedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "timelineType" "TimelineType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "letterType" "LetterType" NOT NULL,
    "visibility" "Visibility" NOT NULL,
    "unlockAt" TIMESTAMP(3),
    "passwordHash" TEXT,
    "moodTags" TEXT[],
    "musicUrl" TEXT,
    "isReadTracking" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "letter_reads" (
    "id" TEXT NOT NULL,
    "letterId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "letter_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "owner" "ProfileOwner" NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarId" TEXT,
    "visibility" "Visibility" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_sections" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "sectionType" "ProfileSectionType" NOT NULL,
    "content" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "visibility" "Visibility" NOT NULL,

    CONSTRAINT "profile_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vault_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentEncrypted" TEXT NOT NULL,
    "vaultType" "VaultContentType" NOT NULL,
    "unlockAt" TIMESTAMP(3),
    "requiresPassword" BOOLEAN NOT NULL DEFAULT false,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vault_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "letter_reads_letterId_userId_key" ON "letter_reads"("letterId", "userId");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_reads" ADD CONSTRAINT "letter_reads_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "letters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "letter_reads" ADD CONSTRAINT "letter_reads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_sections" ADD CONSTRAINT "profile_sections_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
