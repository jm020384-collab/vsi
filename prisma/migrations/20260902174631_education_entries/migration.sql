-- AlterEnum
ALTER TYPE "DocumentType" ADD VALUE 'COURSE';
ALTER TYPE "DocumentType" ADD VALUE 'MASTERCLASS';
ALTER TYPE "DocumentType" ADD VALUE 'CONFERENCE';

-- AlterTable
ALTER TABLE "VerificationDocument" ADD COLUMN     "inProgress" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "yearFrom" INTEGER,
ADD COLUMN     "yearTo" INTEGER,
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileKey" DROP NOT NULL;
