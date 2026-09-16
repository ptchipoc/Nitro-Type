import { z } from "zod";
import { TypingSessionCategory, TypingSessionDifficulty } from "../type";

export const CreateSessionInputSchema = z.object({
  category: z.nativeEnum(TypingSessionCategory),
  difficulty: z.nativeEnum(TypingSessionDifficulty),
});

export type CreateSessionInput = z.infer<typeof CreateSessionInputSchema>;