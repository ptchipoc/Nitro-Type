import { z } from "zod";
import {
  ChannelType,
  MemberRole,
  MessageType,
  UserPresenceStatus,
} from "./community.type";

export const createChannelSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(50),
  description: z.string().max(255).optional(),
  type: z.nativeEnum(ChannelType),
  isPlatformManaged: z.boolean().optional(),
});

export const updateChannelSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").max(50).optional(),
  description: z.string().max(255).optional(),
});

export const addMemberSchema = z.object({
  userId: z.string().uuid("ID de utilizador inválido"),
});

export const removeMemberSchema = z.object({
  notifyChannel: z.boolean().optional(),
});

export const banMemberSchema = z.object({
  reason: z.string().max(255).optional(),
  duration: z.string().optional(),
});

export const updateMemberRoleSchema = z.object({
  role: z.nativeEnum(MemberRole),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, "A mensagem não pode estar vazia").max(1000),
  type: z.nativeEnum(MessageType).optional(),
  mentions: z.array(z.string().uuid()).optional(),
  attachmentIds: z.array(z.string().uuid()).optional(),
  replyToId: z.string().uuid().optional(),
});

export const sendDMSchema = z.object({
  toUserId: z.string().uuid("ID de utilizador inválido"),
  content: z.string().min(1, "A mensagem não pode estar vazia").max(1000),
  replyToId: z.string().uuid().optional(),
});

export const addReactionSchema = z.object({
  emoji: z.string().min(1),
});

export const editMessageSchema = z.object({
  content: z.string().min(1, "A mensagem não pode estar vazia").max(1000),
});

export const inviteToChannelSchema = z.object({
  invitedUserId: z.string().uuid("ID de utilizador inválido"),
});

export const updatePresenceSchema = z.object({
  status: z.nativeEnum(UserPresenceStatus),
});
