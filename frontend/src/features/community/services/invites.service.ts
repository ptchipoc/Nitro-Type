import {
  inviteToChannel,
  getMyInvites,
  acceptInvite,
  rejectInvite,
} from "@/features/community/actions/community.feature";
import {
  InviteToChannelInput,
} from "@/features/community/input/community.input";

// ─── CONVITES ────────────────────────────────────────────────────────

export async function fetchInviteToChannel(
  channelId: string,
  input: InviteToChannelInput,
) {
  const response = await inviteToChannel(channelId, input);
  if (!response.success) throw new Error("Falha ao enviar convite");
  return response.data;
}

export async function fetchMyInvites() {
  const response = await getMyInvites();
  if (!response.success) throw new Error("Falha ao carregar convites");
  return response.data;
}

export async function fetchAcceptInvite(code: string) {
  const response = await acceptInvite(code);
  if (!response.success) throw new Error("Falha ao aceitar convite");
  return response.data;
}

export async function fetchRejectInvite(code: string) {
  const response = await rejectInvite(code);
  if (!response.success) throw new Error("Falha ao rejeitar convite");
  return response.success;
}
