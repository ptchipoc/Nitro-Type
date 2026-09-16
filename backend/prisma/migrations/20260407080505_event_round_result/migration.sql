/*
  Warnings:

  - Added the required column `roundNumber` to the `EventRoundResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRoundResult" ADD COLUMN     "roundNumber" INTEGER NOT NULL;
