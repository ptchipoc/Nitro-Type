import z from "zod";

export const registerInputSchema = z.object({
  name: z.string().min(2, "O nome deve conter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "A senha deve conter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    ),
  privacyAgreed: z.boolean().refine((val) => val === true, {
    message: "Você deve concordar com a Política de Privacidade",
  }),
});

export type RegisterInput = z.infer<typeof registerInputSchema>;