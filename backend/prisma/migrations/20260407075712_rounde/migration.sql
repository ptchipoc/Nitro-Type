/*
  Warnings:

  - The values [DRAFT] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `roundId` on the `EventRoundResult` table. All the data in the column will be lost.
  - You are about to drop the `EventRound` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `EventRoundResult` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('RANDOM', 'BEGINNER', 'ANIME', 'FUNCTIONS', 'ALGORITHMS');

-- CreateEnum
CREATE TYPE "EventDifficulty" AS ENUM ('RANDOM', 'EASY', 'MEDIUM', 'HARD', 'EXTREME');

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('WAITING', 'SCHEDULED', 'ACTIVE', 'BETWEEN_ROUNDS', 'FINISHED');
ALTER TABLE "Event" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Event" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "Event" ALTER COLUMN "status" SET DEFAULT 'WAITING';
COMMIT;

-- DropForeignKey
ALTER TABLE "EventRound" DROP CONSTRAINT "EventRound_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventRoundResult" DROP CONSTRAINT "EventRoundResult_roundId_fkey";

-- DropIndex
DROP INDEX "EventRoundResult_roundId_userId_key";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "EventCategory" NOT NULL,
ADD COLUMN     "currentRound" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "difficulty" "EventDifficulty" NOT NULL,
ADD COLUMN     "roundsCount" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "status" SET DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE "EventRoundResult" DROP COLUMN "roundId";

-- DropTable
DROP TABLE "EventRound";

-- DropEnum
DROP TYPE "EventRoundStatus";

-- CreateIndex
CREATE UNIQUE INDEX "EventRoundResult_eventId_userId_key" ON "EventRoundResult"("eventId", "userId");
