/*
  Warnings:

  - You are about to drop the column `defaultWalletId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SolWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SolWallet" DROP CONSTRAINT "SolWallet_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_defaultWalletId_fkey";

-- DropIndex
DROP INDEX "User_defaultWalletId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "defaultWalletId",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "password",
ADD COLUMN     "encSeed" TEXT,
ADD COLUMN     "walletInfo" JSONB;

-- DropTable
DROP TABLE "SolWallet";

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
