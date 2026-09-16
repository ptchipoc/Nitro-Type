import z from "zod";

export const verifyEmailSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;