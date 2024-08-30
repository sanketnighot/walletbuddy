/*
  Warnings:

  - You are about to drop the column `data` on the `WalletSession` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `WalletSession` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `WalletSession` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "WalletTransactionStatus" AS ENUM ('PENDING', 'SIGNED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "WalletSession" DROP CONSTRAINT "WalletSession_userId_fkey";

-- AlterTable
ALTER TABLE "WalletSession" DROP COLUMN "data",
DROP COLUMN "expiresAt",
DROP COLUMN "type",
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "userId" DROP NOT NULL;

-- DropEnum
DROP TYPE "WalletSessionType";

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "txn" JSONB NOT NULL,
    "status" "WalletTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletTransaction_sessionId_idx" ON "WalletTransaction"("sessionId");

-- AddForeignKey
ALTER TABLE "WalletSession" ADD CONSTRAINT "WalletSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WalletSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
