-- CreateEnum
CREATE TYPE "EventRecurrence" AS ENUM ('ONCE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "recurrence" "EventRecurrence" NOT NULL DEFAULT 'ONCE',
ADD COLUMN     "recurrenceEndsAt" TIMESTAMP(3);

