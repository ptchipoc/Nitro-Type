import { apiFetch } from "@/lib/api/client";
import {
  AddMemberInput,
  RemoveMemberInput,
  BanMemberInput,
  UpdateMemberRoleInput,
} from "../input/community.input";
import {
  MemberResponse,
} from "../response/community.response";

// ─── MEMBROS ─────────────────────────────────────────────────────────

export function addMember(channelId: string, input: AddMemberInput) {
  return apiFetch<MemberResponse>(`/community/channels/${channelId}/members`, {
    method: "POST",
    body: JSON.stringify({ ...input, channelId }),
  });
}

export function removeMember(
  channelId: string,
  userId: string,
  input: RemoveMemberInput,
) {
  return apiFetch<{ success: boolean }>(
    `/community/channels/${channelId}/members/${userId}`,
    {
      method: "DELETE",
      body: JSON.stringify({ ...input, channelId, userId }),
    },
  );
}

export function banMember(
  channelId: string,
  userId: string,
  input: BanMemberInput,
) {
  return apiFetch<{ success: boolean }>(
    `/community/channels/${channelId}/members/${userId}/ban`,
    {
      method: "POST",
      body: JSON.stringify({ ...input, channelId, userId }),
    },
  );
}

export function updateMemberRole(
  channelId: string,
  userId: string,
  input: UpdateMemberRoleInput,
) {
  return apiFetch<MemberResponse>(
    `/community/channels/${channelId}/members/${userId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ ...input, channelId, userId }),
    },
  );
}
