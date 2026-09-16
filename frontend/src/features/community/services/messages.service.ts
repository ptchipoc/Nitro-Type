import {
  getChannelMessages,
  sendChannelMessage,
  editMessage,
  deleteMessage,
  addReaction,
  removeReaction,
} from "@/features/community/actions/community.feature";
import {
  SendMessageInput,
  AddReactionInput,
  EditMessageInput,
} from "@/features/community/input/community.input";

// ─── MENSAGENS ───────────────────────────────────────────────────────

export async function fetchChannelMessages(channelId: string, limit?: number) {
  const response = await getChannelMessages(channelId, limit);
  if (!response.success) throw new Error("Falha ao carregar mensagens");
  return response.data;
}

export async function fetchSendChannelMessage(
  channelId: string,
  input: SendMessageInput,
) {
  const response = await sendChannelMessage(channelId, input);
  if (!response.success) throw new Error("Falha ao enviar mensagem");
  return response.data;
}

export async function fetchEditMessage(
  messageId: string,
  input: EditMessageInput,
) {
  const response = await editMessage(messageId, input);
  if (!response.success) throw new Error("Falha ao editar mensagem");
  return response.data;
}

export async function fetchDeleteMessage(messageId: string) {
  const response = await deleteMessage(messageId);
  if (!response.success) throw new Error("Falha ao apagar mensagem");
  return response.success;
}