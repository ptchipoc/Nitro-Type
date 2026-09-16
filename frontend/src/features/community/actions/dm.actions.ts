import { apiFetch } from "@/lib/api/client";
import {
  DMConversationListResponse,
  DMConversationResponse,
  DMMessagesResponse,
  DMSendMessageResponse,
} from "../response/community.response";
import { SendDMInput } from "../input/community.input";

// ─── DMs ─────────────────────────────────────────────────────────────

export function getDMConversations() {
  return apiFetch<DMConversationListResponse>("/community/dms");
}

export function createOrOpenDM(participantId?: string) {
  return apiFetch<DMConversationResponse>("/community/dms", {
    method: "POST",
    body: participantId ? JSON.stringify({ participantId }) : undefined,
  });
}

export function getDMMessages(dmId: string, limit: number = 50) {
  return apiFetch<DMMessagesResponse>(
    `/community/dms/${dmId}/messages?limit=${limit}`,
  );
}

export function sendDMMessage(participantId: string, input: SendDMInput) {
  const targetParticipantId = input.toUserId || participantId;

  return apiFetch<DMSendMessageResponse>(
    `/community/dms/${targetParticipantId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
}