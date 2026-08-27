-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('CHILDREN', 'TEENS', 'ADULTS');

-- CreateEnum
CREATE TYPE "WorkFormat" AS ENUM ('INDIVIDUAL', 'COUPLES', 'FAMILY', 'GROUP');

-- CreateEnum
CREATE TYPE "ArticleKind" AS ENUM ('ARTICLE', 'NOTE', 'RESEARCH', 'BOOK_REVIEW', 'VIDEO', 'AUDIO');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'VERIFIED', 'NEEDS_UPDATE');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('LECTURE', 'SEMINAR', 'CONFERENCE', 'SUPERVISION_GROUP', 'INTERVISION_GROUP', 'READING_GROUP', 'TRAINING_PROGRAM', 'WORKSHOP');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventRegistrationStatus" AS ENUM ('SAVED', 'REGISTERED');

-- AlterEnum
ALTER TYPE "ArticleStatus" ADD VALUE 'REVIEW';

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "abstract" TEXT,
ADD COLUMN     "kind" "ArticleKind" NOT NULL DEFAULT 'ARTICLE',
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "references" TEXT[],
ADD COLUMN     "topicSlug" TEXT;

-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "acceptingNewClients" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "acceptsRequestsViaVsi" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "ageGroups" "AgeGroup"[],
ADD COLUMN     "analyticalOrientation" TEXT,
ADD COLUMN     "associations" TEXT[],
ADD COLUMN     "offersGroupWork" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "offersSupervision" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personalTherapyStatus" TEXT,
ADD COLUMN     "professionalInterests" TEXT[],
ADD COLUMN     "supervisionStatus" TEXT,
ADD COLUMN     "workFormats" "WorkFormat"[];

-- AlterTable
ALTER TABLE "VerificationDocument" ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "hostId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "format" "SessionFormat" NOT NULL DEFAULT 'ONLINE',
    "language" TEXT NOT NULL DEFAULT 'uk',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "seatsTotal" INTEGER,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "EventRegistrationStatus" NOT NULL DEFAULT 'SAVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startsAt_idx" ON "Event"("status", "startsAt");

-- CreateIndex
CREATE INDEX "Event_hostId_idx" ON "Event"("hostId");

-- CreateIndex
CREATE INDEX "EventRegistration_userId_idx" ON "EventRegistration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventRegistration_eventId_userId_key" ON "EventRegistration"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "TherapistProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
