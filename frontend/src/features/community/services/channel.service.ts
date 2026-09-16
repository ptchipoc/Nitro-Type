
import {
  CreateChannelInput,
  UpdateChannelInput,
} from "@/features/community/input/community.input";

import {
  createChannel,
  getChannels,
  getChannel,
  updateChannel,
  deleteChannel,
} from "@/features/community/actions/community.feature";

// ─── CANAIS ─────────────────────────────────────────────────────────

export async function fetchCreateChannel(input: CreateChannelInput) {
  const response = await createChannel(input);
  if (!response.success) throw new Error("Falha ao criar canal");
  return response.data;
}

export async function fetchChannels() {
  const response = await getChannels();
  if (!response.success) throw new Error("Falha ao carregar canais");
  return response.data;
}

export async function fetchChannel(channelId: string) {
  const response = await getChannel(channelId);
  if (!response.success) throw new Error("Falha ao carregar detalhe do canal");
  return response.data;
}

export async function fetchUpdateChannel(
  channelId: string,
  input: UpdateChannelInput,
) {
  const response = await updateChannel(channelId, input);
  if (!response.success) throw new Error("Falha ao atualizar canal");
  return response.data;
}

export async function fetchDeleteChannel(channelId: string) {
  const response = await deleteChannel(channelId);
  if (!response.success) throw new Error("Falha ao apagar canal");
  return response.success;
}