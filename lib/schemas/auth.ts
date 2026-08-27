import { z } from "zod";

export const emailSchema = z.string().email("Введіть коректний email");

export const passwordSchema = z
  .string()
  .min(8, "Пароль має містити щонайменше 8 символів")
  .max(72, "Пароль занадто довгий");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Реєстрація існує лише для фахівців — пацієнти акаунт не заводять
// (звернутись до фахівця можна й без нього; увійти можна через Google).
export const registerSchema = z
  .object({
    name: z.string().min(2, "Введіть ім'я").max(120),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    consent: z.literal(true, {
      errorMap: () => ({ message: "Потрібна згода на обробку даних" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Паролі не збігаються",
  });

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
