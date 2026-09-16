import { z } from "zod";

export const emailSchema = z.string().email("Email inválido");

export const passwordSchema = z
  .string()
  .min(8, "Password deve ter pelo menos 8 caracteres")
  .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/, {
    message: "Password deve ter 1 maiúscula, 1 número e 1 caracter especial",
  });

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, "Código deve ter 6 dígitos");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password não pode estar vazia"),
});

export const signUpSchema = z.object({
  email: emailSchema,
  name: z.string().min(2, "Nome muito curto").max(100, "Nome muito longo"),
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    code: otpSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma a nova password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As passwords não coincidem",
    path: ["confirmPassword"],
  });
