-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "reviewNote" TEXT;

-- AlterTable
ALTER TABLE "TherapistProfile" ADD COLUMN     "socialLinks" TEXT[],
ADD COLUMN     "website" TEXT;
