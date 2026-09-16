-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'BLOCKED');

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'FRIEND_REQUEST';

-- CreateTable
CREATE TABLE "friendship" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "friendship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendship_senderId_idx" ON "friendship"("senderId");

-- CreateIndex
CREATE INDEX "friendship_receiverId_idx" ON "friendship"("receiverId");

-- CreateIndex
CREATE INDEX "friendship_status_idx" ON "friendship"("status");

-- CreateIndex
CREATE UNIQUE INDEX "friendship_senderId_receiverId_key" ON "friendship"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendship" ADD CONSTRAINT "friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
