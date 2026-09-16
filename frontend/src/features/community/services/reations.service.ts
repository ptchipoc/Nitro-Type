import {
  addReaction,
  removeReaction,
} from "@/features/community/actions/community.feature";
import {
  AddReactionInput,
} from "@/features/community/input/community.input";

// ─── REAÇÕES ─────────────────────────────────────────────────────────

export async function fetchAddReaction(
  messageId: string,
  input: AddReactionInput,
) {
  const response = await addReaction(messageId, input);
  if (!response.success) throw new Error("Falha ao adicionar reação");
  return response.data;
}

export async function fetchRemoveReaction(messageId: string, emoji: string) {
  const response = await removeReaction(messageId, emoji);
  if (!response.success) throw new Error("Falha ao remover reação");
  return response.success;
}