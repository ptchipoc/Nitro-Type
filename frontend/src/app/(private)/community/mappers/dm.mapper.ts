import type { DMConversation } from "@/features/community/types/community.type";
import type { DirectMessage, CommunityUser } from "../types";
import { getInitials } from "./utils.mapper";

export function mapConversationToDM(
  conversation: DMConversation,
  currentUserId: string | undefined,
  usersById: Map<string, CommunityUser>,
  locale: "pt" | "en" | "fr",
): DirectMessage {
  const counterpartId =
    conversation.participantId ??
    (currentUserId &&
      conversation.participantAId === currentUserId
      ? conversation.participantBId
      : conversation.participantAId);

  const knownUser = usersById.get(counterpartId);

  const participantName =
    conversation.participantName?.trim();

  const fallbackName =
    locale === "fr"
      ? `Utilisateur ${counterpartId.slice(0, 6)}`
      : locale === "pt"
        ? `Utilizador ${counterpartId.slice(0, 6)}`
        : `User ${counterpartId.slice(0, 6)}`;

  const resolvedName =
    participantName || knownUser?.name || fallbackName;

  const resolvedUsername =
    knownUser?.username ||
    counterpartId.slice(0, 10);

  return {
    id: conversation.id,
    userId: counterpartId,
    name: resolvedName,
    username: resolvedUsername,
    initials:
      knownUser?.initials ?? getInitials(resolvedName),
    avatarUrl: knownUser?.avatarUrl ?? undefined,
    status: knownUser?.status ?? "offline",
    lastMessage:
      locale === "fr"
        ? "Ouvrir la conversation"
        : locale === "pt"
          ? "Abrir conversa"
          : "Open conversation",
    lastAt:
      conversation.lastMessageAt ??
      conversation.updatedAt,
  };
}