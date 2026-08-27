-- CreateEnum
CREATE TYPE "EventAudience" AS ENUM ('PUBLIC', 'PROFESSIONALS', 'BOTH');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "audience" "EventAudience" NOT NULL DEFAULT 'PUBLIC';
