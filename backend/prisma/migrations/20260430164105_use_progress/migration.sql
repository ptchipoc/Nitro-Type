/*
  Warnings:

  - You are about to drop the column `totaEvents` on the `UserProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "totaEvents",
ADD COLUMN     "totalEvents" INTEGER NOT NULL DEFAULT 0;
