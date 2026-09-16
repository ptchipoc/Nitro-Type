import { apiFetch } from "@/lib/api/client";
import {
  SendMessageInput,
  EditMessageInput,
} from "../input/community.input";
import {
  MessageResponse,
  MessageListResponse,
} from "../response/community.response";

// ─── MENSAGENS ───────────────────────────────────────────────────────

export function getChannelMessages(channelId: string, limit: number = 50) {
    return apiFetch<MessageListResponse>(
        `/community/channels/${channelId}/messages?limit=${limit}`,
    );
}

export function sendChannelMessage(channelId: string, input: SendMessageInput) {
    return apiFetch<MessageResponse>(
        `/community/channels/${channelId}/messages`,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export function editMessage(messageId: string, input: EditMessageInput) {
    return apiFetch<MessageResponse>(`/community/messages/${messageId}`, {
        method: "PATCH",
        body: JSON.stringify({ ...input, messageId }),
    });
}

export function deleteMessage(messageId: string) {
    return apiFetch<{ success: boolean }>(`/community/messages/${messageId}`, {
        method: "DELETE",
    });
}
