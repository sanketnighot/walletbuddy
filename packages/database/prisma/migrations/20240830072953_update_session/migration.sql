/*
  Warnings:

  - Changed the type of `dapp` on the `WalletSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "WalletSession" DROP COLUMN "dapp",
ADD COLUMN     "dapp" JSONB NOT NULL;
