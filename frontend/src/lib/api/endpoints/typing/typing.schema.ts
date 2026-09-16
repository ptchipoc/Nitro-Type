import { z } from "zod";
import { TypingCategory, TypingDifficulty } from "./typing.type";

export const createSectionSchema = z.object({
  category: z.nativeEnum(TypingCategory),
  difficulty: z.nativeEnum(TypingDifficulty),
});

export const submitSessionSchema = z.object({
  sessionId: z.string().uuid(),
  typedChars: z.number().int().positive(),
  correctTypedChars: z.number().int().positive(),
  incorrectTypedChars: z.number().int().positive(),
});
