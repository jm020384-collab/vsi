-- CreateEnum
CREATE TYPE "SocialSupportStatus" AS ENUM ('NEW', 'REVIEWING', 'SPECIALIST_FOUND', 'CONTACTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');

-- CreateEnum
CREATE TYPE "DayPart" AS ENUM ('MORNING', 'DAYTIME', 'EVENING');

-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "participatesInSocialSupport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "socialSupportCurrency" VARCHAR(3),
ADD COLUMN     "socialSupportDayParts" "DayPart"[],
ADD COLUMN     "socialSupportDays" "Weekday"[],
ADD COLUMN     "socialSupportMinRate" INTEGER;

-- CreateTable
CREATE TABLE "SocialSupportRequest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "request" TEXT NOT NULL,
    "budgetMinor" INTEGER NOT NULL,
    "budgetCurrency" VARCHAR(3) NOT NULL,
    "languageCode" TEXT,
    "format" "SessionFormat" NOT NULL DEFAULT 'BOTH',
    "days" "Weekday"[],
    "dayParts" "DayPart"[],
    "availabilityNote" TEXT,
    "status" "SocialSupportStatus" NOT NULL DEFAULT 'NEW',
    "adminNote" TEXT,
    "ipHash" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "consentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialSupportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialSupportRequest_status_createdAt_idx" ON "SocialSupportRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SocialSupportRequest_createdAt_idx" ON "SocialSupportRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "SocialSupportRequest" ADD CONSTRAINT "SocialSupportRequest_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "Language"("code") ON DELETE SET NULL ON UPDATE CASCADE;

