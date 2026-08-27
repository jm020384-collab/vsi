import { z } from "zod";

/** Дописує https://, якщо людина ввела посилання без протоколу (напр. "instagram.com/..."). */
function normalizeUrl(val: unknown) {
  if (typeof val !== "string") return val;
  const trimmed = val.trim();
  if (!trimmed) return trimmed;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const SESSION_FORMATS = ["ONLINE", "OFFLINE", "BOTH"] as const;
export const AGE_GROUPS = ["CHILDREN", "TEENS", "ADULTS"] as const;
export const WORK_FORMATS = ["INDIVIDUAL", "COUPLES", "FAMILY", "GROUP"] as const;

export const therapistProfileSchema = z.object({
  fullName: z.string().min(2, "Вкажіть повне ім'я").max(120),
  professionalTitle: z.string().max(160, "Занадто довго").optional().nullable(),
  city: z.string().min(2, "Вкажіть місто").max(80),
  bio: z.string().max(4000, "Біографія занадто довга"),
  photoUrl: z.string().url().optional().nullable(),
  yearsExperience: z.coerce.number().int().min(0).max(80),
  priceFrom: z.coerce.number().int().min(0, "Мінімальна ціна не може бути від'ємною"),
  priceTo: z.coerce.number().int().min(0).optional().nullable(),
  currency: z.string().length(3).default("UAH"),
  sessionFormat: z.enum(SESSION_FORMATS).default("BOTH"),
  workingHours: z.string().max(200).optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Введіть коректний номер")
    .optional()
    .nullable(),
  website: z.preprocess(
    normalizeUrl,
    z.string().url("Введіть коректне посилання").optional().nullable().or(z.literal("")),
  ),
  socialLinks: z
    .array(z.preprocess(normalizeUrl, z.string().url("Введіть коректне посилання")))
    .max(5)
    .default([]),
  specializationIds: z.array(z.string()).min(1, "Оберіть щонайменше одну спеціалізацію"),
  languageCodes: z.array(z.string()).min(1, "Оберіть щонайменше одну мову"),

  // Професійна позиція — «Мій простір»
  analyticalOrientation: z.string().max(300).optional().nullable(),
  ageGroups: z.array(z.enum(AGE_GROUPS)).default([]),
  workFormats: z.array(z.enum(WORK_FORMATS)).default([]),
  professionalInterests: z.array(z.string().max(60)).max(20).default([]),
  associations: z.array(z.string().max(120)).max(20).default([]),
  supervisionStatus: z.string().max(200).optional().nullable(),
  personalTherapyStatus: z.string().max(200).optional().nullable(),
});

export type TherapistProfileInput = z.infer<typeof therapistProfileSchema>;

export const therapistFilterSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
  spec: z.string().optional(),
  lang: z.string().optional(),
  format: z.enum(SESSION_FORMATS).optional(),
  priceMax: z.coerce.number().int().optional(),
  page: z.coerce.number().int().min(1).default(1),
});

export type TherapistFilter = z.infer<typeof therapistFilterSchema>;
