/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `community_channel` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `community_channel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "community_channel" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "community_channel_slug_key" ON "community_channel"("slug");

-- CreateIndex
CREATE INDEX "community_channel_slug_idx" ON "community_channel"("slug");
