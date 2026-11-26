import { z } from "zod";

import { describeFieldErrors } from "@/lib/forms/errors";

import { EVENT_RECURRENCES, parseEventDateTime } from "@/lib/event-recurrence";
import { EVENT_LIMITS as L, EVENT_TYPES } from "./event";

/** Назви полів такі, як на формі, — для переліку помилок біля кнопки. */
export const EVENT_FIELD_LABELS: Record<string, string> = {
  title: "Назва",
  description: "Опис",
  imageUrl: "Зображення",
  type: "Тип",
  format: "Формат",
  language: "Мова",
  startsAt: "Дата й час",
  seatsTotal: "Кількість місць",
  recurrence: "Повторення",
  recurrenceEndsAt: "Остання зустріч",
  audience: "Для кого",
  contactName: "Контактна особа",
  contactEmail: "Email",
  contactPhone: "Телефон",
  price: "Вартість",
};

export const eventSchema = z.object({
  title: z
    .string()
    .min(L.title.min, `щонайменше ${L.title.min} символи`)
    .max(L.title.max, `не більше ${L.title.max} символів`),
  description: z
    .string()
    .min(L.description.min, `щонайменше ${L.description.min} символів`)
    .max(L.description.max, `не більше ${L.description.max} символів`),
  imageUrl: z.string().url("завантажте зображення ще раз").optional().nullable(),
  type: z.enum(EVENT_TYPES),
  format: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  language: z.string().min(2).max(40),
  // Година з форми — київська; читаємо її без зсуву поясів.
  startsAt: z.preprocess(
    (value) => (typeof value === "string" ? (parseEventDateTime(value) ?? value) : value),
    z.coerce.date({ errorMap: () => ({ message: "Вкажіть дату й час" }) }),
  ),
  seatsTotal: z.coerce
    .number()
    .int("вкажіть ціле число")
    .min(1, "щонайменше 1 місце")
    .optional()
    .nullable(),
  recurrence: z.enum(EVENT_RECURRENCES).default("ONCE"),
  // Дата без години лягає на полудень (див. parseEventDateTime), щоб не
  // опинитися попереднім днем.
  recurrenceEndsAt: z
    .union([z.string(), z.date()])
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      if (value instanceof Date) return value;
      return parseEventDateTime(value);
    }),
  audience: z.enum(["PUBLIC", "PROFESSIONALS", "BOTH"]).default("PUBLIC"),
  contactName: z.string().max(120, "не більше 120 символів").optional().nullable(),
  contactEmail: z.string().email("Введіть коректний email").optional().nullable(),
  contactPhone: z
    .string()
    // Той самий шаблон, що в анкеті: реальні номери бувають із комами й
    // кількома країнами одразу, а 20 символів на це не вистачало.
    .regex(/^[+0-9\s\-(),;/]{7,120}$/, "Введіть коректний номер")
    .optional()
    .nullable(),
  price: z.coerce
    .number({ invalid_type_error: "вкажіть число" })
    .int("вкажіть суму цілим числом")
    .min(0, "Вартість не може бути від'ємною")
    .optional()
    .nullable(),
});

/** Відповідь на форму події, яка не пройшла перевірку. */
export function invalidEvent(mode: "create" | "update", error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
  // Лише назви полів, без тексту: щоб у журналі було видно, на чому спотикаються.
  console.warn("[event] не пройшла перевірку:", Object.keys(fieldErrors).join(", "));
  const lead = mode === "create" ? "Подію не опубліковано" : "Зміни не збережено";
  return {
    ok: false as const,
    error: describeFieldErrors(lead, fieldErrors, EVENT_FIELD_LABELS),
    fieldErrors,
  };
}
