import { z } from "zod";

export const userUpdateSchema = z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(100, "Nome não pode exceder 100 caracteres").optional(),
    avatarUrl: z.string().url("URL do avatar inválida").optional(),
    bio: z.string().max(500, "Biografia não pode exceder 500 caracteres").optional(),
    country: z.string().max(64, "País não pode exceder 64 caracteres").length(2, "Código do país deve ter exatamente 2 caracteres").optional(),
    socialLinks: z.array(
        z.object({
            platform: z.string().min(2, "Plataforma deve ter no mínimo 2 caracteres").max(50, "Plataforma não pode exceder 50 caracteres"),
            url: z.string().url("URL da rede social inválida"),
        }),
        { message: "Links sociais deve ser um array válido" }
    ).optional(),
});

export type UserUpdateInput = z.infer<typeof userUpdateSchema>;