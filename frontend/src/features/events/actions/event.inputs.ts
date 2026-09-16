import { z } from "zod";
import { EventCategory, EventDifficulty, EventType } from "../types";

export const createEventSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(100),
  description: z.string().max(500).optional(),
  type: z.nativeEnum(EventType),
  scheduledAt: z.string().datetime().optional(),
  betweenRoundsDelay: z.number().int().min(5).optional(),
  category: z.nativeEnum(EventCategory),
  difficulty: z.nativeEnum(EventDifficulty),
  roundsCount: z.number().int().min(1),
  maxParticipants: z.number().int().min(1).optional(),
});

export const createRoundSchema = z.object({
  roundNumber: z.number().int().min(1).optional(),
});

export const inviteToEventSchema = z.object({
  email: z.string().email("Email inválido"),
});

export const acceptInviteSchema = z.object({
  eventId: z.string().uuid(),
});

export const submitRoundResultsSchema = z.object({
  eventId: z.string().uuid(),
  typedChars: z.number(),
  correctChars: z.number(),
  totalChars: z.number(),
  incorrectChars: z.number(),
  completionTime: z.number(),
  wordCount: z.number(),
  timeLimit: z.number(),
  roundNumber: z.number(),
});

//
const optionalTextSchema = z
  .string()
  .trim()
  .max(500, "A descrição deve ter no máximo 500 caracteres")
  .optional()
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value));

const scheduledAtSchema = z
  .string()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value === "" ? undefined : value))
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "Data e hora inválidas",
  });

export const createPrivateEventSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: optionalTextSchema,
  scheduledAt: scheduledAtSchema,
  betweenRoundsDelay: z
    .number({
      invalid_type_error: "O atraso entre rodadas é obrigatório",
    })
    .int("O atraso entre rodadas deve ser um número inteiro")
    .min(5, "O atraso entre rodadas deve ser de pelo menos 5 segundos"),
  roundsCount: z
    .number({ invalid_type_error: "O número de rodadas é obrigatório" })
    .int("O número de rodadas deve ser um número inteiro")
    .min(1, "Deve haver pelo menos 1 rodada"),
  category: z.nativeEnum(EventCategory),
  difficulty: z.nativeEnum(EventDifficulty),
  maxParticipants: z
    .number({
      invalid_type_error: "O número máximo de participantes é inválido",
    })
    .int("O número máximo de participantes deve ser um número inteiro")
    .min(1, "O número máximo de participantes deve ser pelo menos 1")
    .optional(),
});

export type CreatePrivateEventInput = z.infer<typeof createPrivateEventSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateRoundInput = z.infer<typeof createRoundSchema>;
export type InviteToEventInput = z.infer<typeof inviteToEventSchema>;
export type SubmitRoundResultsInput = z.infer<typeof submitRoundResultsSchema>;
