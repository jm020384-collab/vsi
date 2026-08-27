-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactName" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "price" INTEGER;

-- AlterTable
ALTER TABLE "EventRegistration" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "guestName" TEXT,
ADD COLUMN     "guestPhone" TEXT,
ADD COLUMN     "ipHash" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "EventRegistration_eventId_guestEmail_idx" ON "EventRegistration"("eventId", "guestEmail");
