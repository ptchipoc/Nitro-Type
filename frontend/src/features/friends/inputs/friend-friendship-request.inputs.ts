import { z } from "zod";

export const sendFriendRequestSchema = z.object({
  receiverId: z.string().min(1, "ID do destinatário é obrigatório"),
});

export type SendFriendRequestInput = z.infer<typeof sendFriendRequestSchema>;