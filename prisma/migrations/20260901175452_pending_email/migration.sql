-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pendingEmail" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingEmail_key" ON "User"("pendingEmail");
