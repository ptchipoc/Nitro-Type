import { apiFetch } from "@/lib/api/client";
import {
  AddReactionInput,
} from "../input/community.input";
import {
  MessageResponse,
} from "../response/community.response";

// ─── REAÇÕES ─────────────────────────────────────────────────────────

export function addReaction(messageId: string, input: AddReactionInput) {
  return apiFetch<MessageResponse>(
    `/community/messages/${messageId}/reactions`,
    {
      method: "PUT",
      body: JSON.stringify({ ...input, messageId }),
    },
  );
}

export function removeReaction(messageId: string, emoji: string) {
  return apiFetch<{ success: boolean }>(
    `/community/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
    {
      method: "DELETE",
    },
  );
}