import {
  addMember,
  removeMember,
  banMember,
  updateMemberRole,
} from "@/features/community/actions/community.feature";
import {
  AddMemberInput,
  RemoveMemberInput,
  BanMemberInput,
  UpdateMemberRoleInput,
} from "@/features/community/input/community.input";

// ─── MEMBROS ─────────────────────────────────────────────────────────

export async function fetchAddMember(channelId: string, input: AddMemberInput) {
  const response = await addMember(channelId, input);
  if (!response.success) throw new Error("Falha ao adicionar membro");
  return response.data;
}

export async function fetchRemoveMember(
  channelId: string,
  userId: string,
  input: RemoveMemberInput,
) {
  const response = await removeMember(channelId, userId, input);
  return response.success;
}

export async function fetchBanMember(
  channelId: string,
  userId: string,
  input: BanMemberInput,
) {
  const response = await banMember(channelId, userId, input);
  return response.success;
}

export async function fetchUpdateMemberRole(
  channelId: string,
  userId: string,
  input: UpdateMemberRoleInput,
) {
  const response = await updateMemberRole(channelId, userId, input);
  return response.data;
}
