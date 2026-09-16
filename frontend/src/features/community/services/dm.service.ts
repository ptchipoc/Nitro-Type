import {
  getDMConversations,
  createOrOpenDM,
  getDMMessages,
  sendDMMessage,
} from "@/features/community/actions/community.feature";
import {
  SendDMInput,
} from "@/features/community/input/community.input";

// ─── DMs ─────────────────────────────────────────────────────────────

export async function fetchDMConversations() {
  const response = await getDMConversations();
  if (!response.success) throw new Error("Falha ao carregar DMs");
  return response.data;
}

export async function fetchCreateOrOpenDM(participantId?: string) {
  const response = await createOrOpenDM(participantId);
  if (!response.success) throw new Error("Falha ao abrir DM");
  return response.data;
}

export async function fetchDMMessages(dmId: string, limit?: number) {
  const response = await getDMMessages(dmId, limit);
  if (!response.success) throw new Error("Falha ao carregar mensagens da DM");

  const payload = response.data;
  if (Array.isArray(payload)) return payload;

  return Array.isArray(payload.messages) ? payload.messages : [];
}

export async function fetchSendDMMessage(participantId: string, input: SendDMInput) {
  const response = await sendDMMessage(participantId, input);
  if (!response.success) throw new Error("Falha ao enviar DM");
  return response.data.message;
}