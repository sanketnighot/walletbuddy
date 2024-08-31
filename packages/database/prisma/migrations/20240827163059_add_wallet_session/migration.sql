-- CreateEnum
CREATE TYPE "WalletSessionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WalletSessionType" AS ENUM ('CONNECTION_REQUEST', 'TRANSACTION_REQUEST');

-- CreateTable
CREATE TABLE "WalletSession" (
    "id" TEXT NOT NULL,
    "type" "WalletSessionType" NOT NULL,
    "dapp" TEXT NOT NULL,
    "data" JSONB,
    "status" "WalletSessionStatus" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "WalletSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WalletSession_userId_idx" ON "WalletSession"("userId");

-- AddForeignKey
ALTER TABLE "WalletSession" ADD CONSTRAINT "WalletSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
