/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `languages` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `user_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_profile_username_idx";

-- DropIndex
DROP INDEX "user_profile_username_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "avatarUrl" TEXT;

-- AlterTable
ALTER TABLE "user_profile" DROP COLUMN "avatarUrl",
DROP COLUMN "languages",
DROP COLUMN "username",
DROP COLUMN "visibility";

-- AddForeignKey
ALTER TABLE "EventParticipant" ADD CONSTRAINT "EventParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
