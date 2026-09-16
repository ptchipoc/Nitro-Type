/*
  Warnings:

  - You are about to drop the `EventMedal` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventMedal" DROP CONSTRAINT "EventMedal_eventId_fkey";

-- DropTable
DROP TABLE "EventMedal";
