/*
  Warnings:

  - You are about to drop the column `winCount` on the `EventParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventParticipant" DROP COLUMN "winCount";

-- AlterTable
ALTER TABLE "UserProgress" ADD COLUMN     "eventsWon" INTEGER NOT NULL DEFAULT 0;
