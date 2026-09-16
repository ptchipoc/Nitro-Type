import type { Message as ApiMessage } from "@/features/community/types/community.type";
import type { CommunityMessage } from "../types";
import { getInitials } from "./utils.mapper";

export function mapApiMessageToUiMessage(
    message: ApiMessage,
): CommunityMessage {
    const resolvedAuthorId =
        message.authorId || message.author?.id || `unknown-${message.id}`;

    const authorName =
        message.author?.name?.trim() ||
        message.author?.username ||
        `User ${resolvedAuthorId.slice(0, 6)}`;

    const authorInitials = getInitials(authorName);

    return {
        id: message.id,
        authorId: resolvedAuthorId,
        authorName,
        authorInitials,
        authorRole: "GROUP_MEMBER",
        content: message.content,
        createdAt: message.createdAt,
        edited: Boolean(message.edited),
        reactions: message.reactions ?? [],
        mentions: message.mentions ?? [],
        authorAvatarUrl: (message.author as any)?.avatarUrl || (message.author as any)?.profile?.avatarUrl || (message.author as any)?.image || undefined,
    };
}