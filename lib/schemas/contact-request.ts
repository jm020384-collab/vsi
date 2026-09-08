import { z } from "zod";

export const contactRequestSchema = z.object({
  therapistSlug: z.string().min(1),
  patientName: z.string().min(2, "Введіть ім'я").max(120),
  patientEmail: z.string().email("Введіть коректний email"),
  patientPhone: z
    .string()
    // Той самий шаблон, що в анкеті: реальні номери бувають із комами й
    // кількома країнами одразу, а 20 символів на це не вистачало.
    .regex(/^[+0-9\s\-(),;/]{7,120}$/, "Введіть коректний номер")
    .optional()
    .or(z.literal("")),
  preferredTime: z.string().max(200).optional(),
  message: z
    .string()
    .min(10, "Повідомлення має бути щонайменше 10 символів")
    .max(1000, "Максимум 1000 символів"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Потрібна згода на обробку даних" }),
  }),
  // Cloudflare Turnstile ще не підключено (немає пакета/патерну в проєкті) —
  // anti-spam на цьому етапі: honeypot-поле + rate-limit за ipHash.
  captchaToken: z.string().optional(),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
