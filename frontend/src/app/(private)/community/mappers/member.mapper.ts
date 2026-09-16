import type { Message } from "@/features/community/types/community.type";
import type { CommunityMember } from "../types";
import { getInitials } from "./utils.mapper";

export function mapApiMessageToCommunityMember(message: Message): CommunityMember {
  const resolvedAuthorId =
    message.authorId || message.author?.id || `unknown-${message.id}`;
  const authorName =
    message.author?.name?.trim() ||
    message.author?.username ||
    `User ${resolvedAuthorId.slice(0, 6)}`;
  const usernameFallback =
    message.author?.username ||
    message.author?.email?.split("@")[0] ||
    `user_${resolvedAuthorId.slice(0, 8)}`;

  return {
    id: resolvedAuthorId,
    name: authorName,
    username: usernameFallback,
    avatarInitials: getInitials(authorName),
    avatarUrl: (message.author as any)?.avatarUrl || (message.author as any)?.profile?.avatarUrl || (message.author as any)?.image || undefined,
    role: "GROUP_MEMBER",
    status: "offline",
  };
}