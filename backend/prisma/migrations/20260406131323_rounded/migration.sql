/*
  Warnings:

  - You are about to drop the column `sessionId` on the `EventRound` table. All the data in the column will be lost.
  - Added the required column `text` to the `EventRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeLimit` to the `EventRound` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wordCount` to the `EventRound` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRound" DROP COLUMN "sessionId",
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "timeLimit" INTEGER NOT NULL,
ADD COLUMN     "wordCount" INTEGER NOT NULL;
