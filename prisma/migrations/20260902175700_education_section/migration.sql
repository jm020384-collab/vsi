-- CreateEnum
CREATE TYPE "EducationKind" AS ENUM ('EDUCATION', 'SPECIALIZATION', 'TRAINING', 'SHORT_PROGRAM', 'CONFERENCE');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('BACHELOR', 'MASTER', 'SPECIALIST', 'PHD', 'OTHER');

-- CreateEnum
CREATE TYPE "ConferenceRole" AS ENUM ('PARTICIPANT', 'SPEAKER', 'MODERATOR', 'ORGANIZER');

-- AlterTable
ALTER TABLE "VerificationDocument" ADD COLUMN     "entryId" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "EducationEntry" (
    "id" TEXT NOT NULL,
    "therapistId" TEXT NOT NULL,
    "kind" "EducationKind" NOT NULL,
    "title" TEXT,
    "institution" TEXT,
    "faculty" TEXT,
    "specialization" TEXT,
    "degree" "DegreeLevel",
    "country" TEXT,
    "trainer" TEXT,
    "programType" TEXT,
    "duration" TEXT,
    "startYear" INTEGER,
    "endYear" INTEGER,
    "ongoing" BOOLEAN NOT NULL DEFAULT false,
    "expectedEndYear" INTEGER,
    "eventDate" TEXT,
    "role" "ConferenceRole",
    "presentationTitle" TEXT,
    "link" TEXT,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EducationEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EducationEntry_therapistId_idx" ON "EducationEntry"("therapistId");

-- CreateIndex
CREATE INDEX "VerificationDocument_entryId_idx" ON "VerificationDocument"("entryId");

-- AddForeignKey
ALTER TABLE "EducationEntry" ADD CONSTRAINT "EducationEntry_therapistId_fkey" FOREIGN KEY ("therapistId") REFERENCES "TherapistProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "EducationEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

