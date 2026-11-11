import { z } from "zod";

import { DAY_PART_VALUES, SOCIAL_CURRENCIES, WEEKDAY_VALUES } from "@/lib/social-support";

const weekday = z.enum(WEEKDAY_VALUES as [string, ...string[]]);
const dayPart = z.enum(DAY_PART_VALUES as [string, ...string[]]);
const currency = z.enum(SOCIAL_CURRENCIES as [string, ...string[]]);

/** Заявка людини на участь у програмі соціальної підтримки. */
export const socialSupportRequestSchema = z.object({
  name: z.string().min(2, "Введіть ім'я").max(120),
  email: z.string().email("Введіть коректний email"),
  // Той самий шаблон, що в анкеті, плюс нік месенджера: людина може
  // лишити @telegram замість номера.
  contact: z
    .string()
    .min(3, "Вкажіть телефон або месенджер")
    .max(120)
    .regex(
      /^(@[A-Za-z0-9_]{3,32}|[+0-9\s\-(),;/]{7,120}|.{3,120})$/,
      "Вкажіть телефон або месенджер",
    ),
  country: z.string().min(2, "Вкажіть країну або часовий пояс").max(120),
  age: z.coerce
    .number({ invalid_type_error: "Вкажіть вік числом" })
    .int()
    .min(16, "Програма працює з людьми від 16 років")
    .max(120, "Перевірте вік"),
  gender: z.string().min(1, "Оберіть варіант").max(40),
  request: z
    .string()
    .min(20, "Опишіть запит хоча б кількома реченнями")
    .max(2000, "Максимум 2000 символів"),

  /**
   * Бюджет вводиться в цілих одиницях валюти, а зберігається в
   * мінімальних — як priceFrom у профілі. Нуль не приймаємо: програма
   * про знижену вартість, а не про безкоштовну роботу.
   */
  budgetAmount: z.coerce
    .number({ invalid_type_error: "Вкажіть суму числом" })
    .int("Вкажіть суму цілим числом")
    .min(1, "Вкажіть суму, яку можете виділити")
    .max(100_000, "Перевірте суму"),
  budgetCurrency: currency,

  languageCode: z.string().max(10).optional().or(z.literal("")),
  format: z.enum(["ONLINE", "OFFLINE", "BOTH"]),

  days: z.array(weekday).min(1, "Оберіть хоча б один день"),
  dayParts: z.array(dayPart).min(1, "Оберіть хоча б один проміжок"),
  availabilityNote: z.string().max(500).optional().or(z.literal("")),

  consent: z.literal(true, {
    errorMap: () => ({ message: "Потрібна згода на обробку даних" }),
  }),
});

export type SocialSupportRequestInput = z.infer<typeof socialSupportRequestSchema>;

/** Налаштування участі фахівця — редагує він сам у кабінеті. */
export const socialSupportSettingsSchema = z
  .object({
    participates: z.boolean(),
    days: z.array(weekday),
    dayParts: z.array(dayPart),
    minRate: z.coerce
      .number()
      .int("Вкажіть суму цілим числом")
      .min(0, "Сума не може бути від'ємною")
      .max(100_000, "Перевірте суму")
      .optional()
      .nullable(),
    currency: currency.optional().nullable(),
  })
  .refine((v) => !v.participates || v.days.length > 0, {
    path: ["days"],
    message: "Оберіть дні, у які вам зручно",
  })
  .refine((v) => !v.participates || v.dayParts.length > 0, {
    path: ["dayParts"],
    message: "Оберіть зручні проміжки дня",
  });

export type SocialSupportSettingsInput = z.infer<typeof socialSupportSettingsSchema>;
