import { apiFetch } from "@/lib/api/client";
import {
  UpdatePresenceInput,
} from "../input/community.input";
import {
  PresenceResponse,
} from "../response/community.response";

// ─── PRESENÇA ────────────────────────────────────────────────────────

export function updatePresence(input: UpdatePresenceInput) {
  return apiFetch<PresenceResponse>("/community/presence", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function getPresence(userId: string) {
  return apiFetch<PresenceResponse>(`/community/presence/${userId}`);
}
