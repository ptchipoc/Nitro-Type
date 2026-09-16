-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('MASTER_ADMIN', 'GROUP_OWNER', 'GROUP_ADMIN', 'GROUP_MEMBER', 'GROUP_VIEWER');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'SYSTEM', 'NOTIFICATION');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "UserPresenceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'IDLE');

-- CreateTable
CREATE TABLE "community_channel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "type" "ChannelType" NOT NULL DEFAULT 'PUBLIC',
    "isPlatformManaged" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_channel_member" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'GROUP_MEMBER',
    "permissions" JSONB NOT NULL DEFAULT '{}',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_channel_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_message" (
    "id" TEXT NOT NULL,
    "channelId" TEXT,
    "dmConversationId" TEXT,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'TEXT',
    "reactions" JSONB NOT NULL DEFAULT '[]',
    "mentions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "attachmentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "replyToId" TEXT,
    "edited" BOOLEAN NOT NULL DEFAULT false,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_dm_conversation" (
    "id" TEXT NOT NULL,
    "participantAId" TEXT NOT NULL,
    "participantBId" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_dm_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_channel_invite" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "invitedUserId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_channel_invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_user_presence" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "UserPresenceStatus" NOT NULL DEFAULT 'OFFLINE',
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_user_presence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_read_receipt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT,
    "dmConversationId" TEXT,
    "lastReadMessageId" TEXT,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "community_read_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "community_channel_type_idx" ON "community_channel"("type");

-- CreateIndex
CREATE INDEX "community_channel_isArchived_idx" ON "community_channel"("isArchived");

-- CreateIndex
CREATE INDEX "community_channel_createdBy_idx" ON "community_channel"("createdBy");

-- CreateIndex
CREATE INDEX "community_channel_member_channelId_idx" ON "community_channel_member"("channelId");

-- CreateIndex
CREATE INDEX "community_channel_member_userId_idx" ON "community_channel_member"("userId");

-- CreateIndex
CREATE INDEX "community_channel_member_role_idx" ON "community_channel_member"("role");

-- CreateIndex
CREATE UNIQUE INDEX "community_channel_member_channelId_userId_key" ON "community_channel_member"("channelId", "userId");

-- CreateIndex
CREATE INDEX "community_message_channelId_idx" ON "community_message"("channelId");

-- CreateIndex
CREATE INDEX "community_message_dmConversationId_idx" ON "community_message"("dmConversationId");

-- CreateIndex
CREATE INDEX "community_message_authorId_idx" ON "community_message"("authorId");

-- CreateIndex
CREATE INDEX "community_message_createdAt_idx" ON "community_message"("createdAt");

-- CreateIndex
CREATE INDEX "community_dm_conversation_participantAId_idx" ON "community_dm_conversation"("participantAId");

-- CreateIndex
CREATE INDEX "community_dm_conversation_participantBId_idx" ON "community_dm_conversation"("participantBId");

-- CreateIndex
CREATE UNIQUE INDEX "community_dm_conversation_participantAId_participantBId_key" ON "community_dm_conversation"("participantAId", "participantBId");

-- CreateIndex
CREATE UNIQUE INDEX "community_channel_invite_code_key" ON "community_channel_invite"("code");

-- CreateIndex
CREATE INDEX "community_channel_invite_channelId_idx" ON "community_channel_invite"("channelId");

-- CreateIndex
CREATE INDEX "community_channel_invite_invitedUserId_idx" ON "community_channel_invite"("invitedUserId");

-- CreateIndex
CREATE INDEX "community_channel_invite_code_idx" ON "community_channel_invite"("code");

-- CreateIndex
CREATE UNIQUE INDEX "community_user_presence_userId_key" ON "community_user_presence"("userId");

-- CreateIndex
CREATE INDEX "community_user_presence_userId_idx" ON "community_user_presence"("userId");

-- CreateIndex
CREATE INDEX "community_read_receipt_userId_idx" ON "community_read_receipt"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "community_read_receipt_userId_channelId_key" ON "community_read_receipt"("userId", "channelId");

-- CreateIndex
CREATE UNIQUE INDEX "community_read_receipt_userId_dmConversationId_key" ON "community_read_receipt"("userId", "dmConversationId");

-- AddForeignKey
ALTER TABLE "community_channel_member" ADD CONSTRAINT "community_channel_member_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "community_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_message" ADD CONSTRAINT "community_message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "community_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_message" ADD CONSTRAINT "community_message_dmConversationId_fkey" FOREIGN KEY ("dmConversationId") REFERENCES "community_dm_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_channel_invite" ADD CONSTRAINT "community_channel_invite_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "community_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_read_receipt" ADD CONSTRAINT "community_read_receipt_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "community_channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_read_receipt" ADD CONSTRAINT "community_read_receipt_dmConversationId_fkey" FOREIGN KEY ("dmConversationId") REFERENCES "community_dm_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
