import {
  updatePresence,
  getPresence,
} from "@/features/community/actions/community.feature";
import {
  UpdatePresenceInput,
} from "@/features/community/input/community.input";

// ─── PRESENÇA ────────────────────────────────────────────────────────

export async function fetchUpdatePresence(input: UpdatePresenceInput) {
  const response = await updatePresence(input);
  if (!response.success) throw new Error("Falha ao atualizar presença");
  return response.data;
}

export async function fetchPresence(userId: string) {
  const response = await getPresence(userId);
  if (!response.success) throw new Error("Falha ao carregar presença");
  return response.data;
}