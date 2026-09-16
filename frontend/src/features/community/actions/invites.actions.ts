import { apiFetch } from "@/lib/api/client";
import {
  InviteToChannelInput,
} from "../input/community.input";
import {
  InviteResponse,
  InviteListResponse,
  MemberResponse,
} from "../response/community.response";

// ─── CONVITES ────────────────────────────────────────────────────────

export function inviteToChannel(
    channelId: string,
    input: InviteToChannelInput,
) {
    return apiFetch<InviteResponse>(`/community/channels/${channelId}/invites`, {
        method: "POST",
        body: JSON.stringify({ ...input }),
    });
}

export function getMyInvites() {
    return apiFetch<InviteListResponse>("/community/invites");
}

export function acceptInvite(code: string) {
    return apiFetch<MemberResponse>(`/community/invites/${code}/accept`, {
        method: "POST",
    });
}

export function rejectInvite(code: string) {
    return apiFetch<{ success: boolean }>(`/community/invites/${code}/reject`, {
        method: "POST",
    });
}