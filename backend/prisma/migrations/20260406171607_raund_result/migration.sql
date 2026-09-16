/*
  Warnings:

  - Added the required column `completionRate` to the `EventRoundResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completionTime` to the `EventRoundResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `errorRate` to the `EventRoundResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRoundResult" ADD COLUMN     "completionRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "completionTime" INTEGER NOT NULL,
ADD COLUMN     "errorRate" DOUBLE PRECISION NOT NULL;
