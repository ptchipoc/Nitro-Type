import type { DirectMessage } from "../types";
import type { DMMessageEnvelope } from "../types/controller.types";
import type {
    DMConversation as ApiDMConversation,
    Message as ApiMessage,
} from "@/features/community/types/community.type";
import type {
    SocketDMMessagePayload,
} from "@/features/community/hooks/socket/community-socket";

export function normalizeSocketDMMessage(
    payload: SocketDMMessagePayload["message"],
): DMMessageEnvelope | null {
    if (!payload || typeof payload !== "object") return null;

    if ("id" in payload && typeof payload.id === "string") {
        return { message: payload as DMMessageEnvelope["message"] };
    }

    const envelope = payload as DMMessageEnvelope;
    if (envelope.message && typeof envelope.message.id === "string") {
        return envelope;
    }

    return null;
}

// export function normalizeSocketDMMessage(
//   payload: SocketDMMessagePayload["message"],
// ): DMMessageEnvelope | null {
//   if (!payload || typeof payload !== "object") return null;

//   if ("id" in payload && typeof payload.id === "string") {
//     return { message: payload as ApiMessage };
//   }

//   const envelope = payload as DMMessageEnvelope;
//   if (envelope.message && typeof envelope.message.id === "string") {
//     return envelope;
//   }

//   return null;
// }

export function resolveDMCounterpartId(
    conversation: ApiDMConversation | undefined,
    currentUserId: string | undefined,
    authorId: string,
    participantId: string,
) {
    if (conversation) {
        if (conversation.participantAId === currentUserId) {
            return conversation.participantBId;
        }

        if (conversation.participantBId === currentUserId) {
            return conversation.participantAId;
        }
    }

    if (authorId && authorId !== currentUserId) {
        return authorId;
    }

    return participantId !== currentUserId ? participantId : undefined;
}

export function normalizeParticipantUsername(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, "_");
}

export function isGenericDMName(name: string, userId: string): boolean {
    const normalized = name.trim().toLowerCase();
    const userSuffix = userId.slice(0, 6).toLowerCase();

    return (
        normalized === `user ${userSuffix}` ||
        normalized === `utilizador ${userSuffix}` ||
        normalized === `utilisateur ${userSuffix}` ||
        normalized === "utilizador desconhecido" ||
        normalized === "unknown"
    );
}

export function isGenericDMUsername(username: string, userId: string): boolean {
    const normalized = username.trim().toLowerCase();

    return (
        normalized === userId.slice(0, 10).toLowerCase() ||
        normalized.startsWith("user_")
    );
}

export function upsertDMCollection(collection: DirectMessage[], nextDM: DirectMessage) {
    const existing = collection.find(
        (dm) => dm.id === nextDM.id || dm.userId === nextDM.userId,
    );

    const merged: DirectMessage = existing
        ? {
            ...existing,
            ...nextDM,
        }
        : nextDM;

    if (existing) {
        if (
            isGenericDMName(merged.name, merged.userId) &&
            !isGenericDMName(existing.name, existing.userId)
        ) {
            merged.name = existing.name;
        }

        if (
            isGenericDMUsername(merged.username, merged.userId) &&
            !isGenericDMUsername(existing.username, existing.userId)
        ) {
            merged.username = existing.username;
        }

        if (
            (!merged.initials || merged.initials === "U") &&
            existing.initials
        ) {
            merged.initials = existing.initials;
        }
    }

    return [
        merged,
        ...collection.filter(
            (dm) => dm.id !== nextDM.id && dm.userId !== nextDM.userId,
        ),
    ];
}
