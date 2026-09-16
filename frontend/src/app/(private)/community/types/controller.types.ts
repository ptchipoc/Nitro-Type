import type { CommunityMessage } from "./message.types";
import type { Message as ApiMessage, DMConversation as ApiDMConversation } from "@/features/community/types/community.type";

export type UiMessage = CommunityMessage;

export type UiInvite = {
    code: string;
    channelId: string;
    channelName: string;
    expiresAt: string;
};

export type SidebarNotice = {
    kind: "success" | "error" | "info";
    message: string;
};

export type MessagePayload = {
    content: string;
    mentions?: string[];
    attachmentIds?: string[];
    replyToId?: string;
};

export type DMMessageEnvelope = {
    conversation?: ApiDMConversation;
    message?: ApiMessage;
};
