import { apiFetch } from "@/lib/api/client";
import {
  CreateChannelInput,
  UpdateChannelInput,
} from "../input/community.input";
import {
  ChannelResponse,
  ChannelListResponse,
} from "../response/community.response";

// ─── CANAIS ─────────────────────────────────────────────────────────

export function createChannel(input: CreateChannelInput) {
  return apiFetch<ChannelResponse>("/community/channels", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function getChannels() {
  return apiFetch<ChannelListResponse>("/community/channels");
}

export function getChannel(channelId: string) {
  return apiFetch<ChannelResponse>(`/community/channels/${channelId}`);
}

export function updateChannel(channelId: string, input: UpdateChannelInput) {
  return apiFetch<ChannelResponse>(`/community/channels/${channelId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteChannel(channelId: string) {
  return apiFetch<{ success: boolean }>(`/community/channels/${channelId}`, {
    method: "DELETE",
  });
}