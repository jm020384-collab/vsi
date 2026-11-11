"use server";

import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { Resend } from "resend";
import type { DayPart, SessionFormat, SocialSupportStatus, Weekday } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashIp } from "@/lib/hash";
import { THERAPISTS_TAG } from "@/lib/therapists";
import {
  socialSupportRequestSchema,
  socialSupportSettingsSchema,
} from "@/lib/schemas/social-support";

/** Те, що повертаємо у форму після невдалої спроби. */
export interface SocialSupportValues {
  name: string;
  email: string;
  contact: string;
  country: string;
  age: string;
  gender: string;
  request: string;
  budgetAmount: string;
  budgetCurrency: string;
  languageCode: string;
  format: string;
  days: string[];
  dayParts: string[];
  availabilityNote: string;
}

export type SocialSupportState =
  | { ok: true }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      values?: SocialSupportValues;
    };

const MAX_REQUESTS_PER_DAY = 3;

/**
 * Заявка на соціальну психологічну підтримку.
 *
 * Фахівця тут не обирають: заявка адресована програмі, а відповідність
 * запиту, бюджету й доступності перевіряє адміністратор вручну. Тому
 * жодного автоматичного підбору чи запису на зустріч дія не робить.
 *
 * Anti-spam — той самий, що й у зверненнях до фахівця: honeypot-поле
 * «website» і ліміт за хешем IP за добу.
 */
export async function createSocialSupportRequestAction(
  _prev: SocialSupportState | null,
  formData: FormData,
): Promise<SocialSupportState> {
  if (formData.get("website")) {
    // Пастка для ботів: тихо «успішно», щоб не підказувати, у чому річ.
    return { ok: true };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    contact: formData.get("contact"),
    country: formData.get("country"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    request: formData.get("request"),
    budgetAmount: formData.get("budgetAmount"),
    budgetCurrency: formData.get("budgetCurrency"),
    languageCode: formData.get("languageCode") || "",
    format: formData.get("format"),
    days: formData.getAll("days").map(String),
    dayParts: formData.getAll("dayParts").map(String),
    availabilityNote: formData.get("availabilityNote") || "",
    consent: formData.get("consent") === "on",
  };

  // React скидає неконтрольовані поля після відправки — без цього людина
  // втрачала б усе введене й бачила саму лише помилку.
  const submitted: SocialSupportValues = {
    name: String(raw.name ?? ""),
    email: String(raw.email ?? ""),
    contact: String(raw.contact ?? ""),
    country: String(raw.country ?? ""),
    age: String(raw.age ?? ""),
    gender: String(raw.gender ?? ""),
    request: String(raw.request ?? ""),
    budgetAmount: String(raw.budgetAmount ?? ""),
    budgetCurrency: String(raw.budgetCurrency ?? ""),
    languageCode: String(raw.languageCode ?? ""),
    format: String(raw.format ?? ""),
    days: raw.days,
    dayParts: raw.dayParts,
    availabilityNote: String(raw.availabilityNote ?? ""),
  };

  const parsed = socialSupportRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму — деякі поля заповнені некоректно",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      values: submitted,
    };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.socialSupportRequest.count({
    where: { ipHash, createdAt: { gte: since } },
  });
  if (recentCount >= MAX_REQUESTS_PER_DAY) {
    return {
      ok: false,
      error: "Забагато заявок з цієї адреси за останню добу. Спробуйте пізніше.",
      values: submitted,
    };
  }

  const d = parsed.data;
  await prisma.socialSupportRequest.create({
    data: {
      name: d.name,
      email: d.email,
      contact: d.contact,
      country: d.country,
      age: d.age,
      gender: d.gender,
      request: d.request,
      // У форму вводять цілі одиниці валюти, у базі тримаємо мінімальні.
      budgetMinor: d.budgetAmount * 100,
      budgetCurrency: d.budgetCurrency,
      languageCode: d.languageCode ? d.languageCode : null,
      format: d.format as SessionFormat,
      days: d.days as Weekday[],
      dayParts: d.dayParts as DayPart[],
      availabilityNote: d.availabilityNote ? d.availabilityNote : null,
      ipHash,
      consentGiven: true,
      consentAt: new Date(),
    },
  });

  revalidatePath("/admin/social-support");

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "VSI <noreply@example.com>",
        to: d.email,
        subject: "Вашу заявку на соціальну підтримку отримано",
        text: [
          `Вітаємо, ${d.name}!`,
          "",
          "Ми отримали вашу заявку на участь у програмі соціальної психологічної підтримки VSI.",
          "",
          "Ми розглянемо її протягом 48 годин і зв'яжемося з вами, якщо серед фахівців програми буде спеціаліст, який відповідає вашому запиту, бюджету та доступному часу.",
          "",
          "Подання заявки не гарантує підбору фахівця — можливість участі залежить від поточної доступності спеціалістів.",
          "",
          "З повагою,",
          "VSI",
        ].join("\n"),
      });
    } catch {
      // Лист — best-effort: заявка вже в базі незалежно від нього.
    }
  }

  return { ok: true };
}

export type SocialSettingsState = { ok: true } | { ok: false; error: string };

/**
 * Участь фахівця у програмі — вмикає й налаштовує він сам.
 *
 * Окремої реєстрації в програмі немає: перемикач у кабінеті і є вступом.
 */
export async function updateSocialSupportSettingsAction(
  formData: FormData,
): Promise<SocialSettingsState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const rawRate = formData.get("minRate");
  const parsed = socialSupportSettingsSchema.safeParse({
    participates: formData.get("participates") === "on",
    days: formData.getAll("days").map(String),
    dayParts: formData.getAll("dayParts").map(String),
    minRate: rawRate === null || rawRate === "" ? null : rawRate,
    currency: formData.get("currency") || null,
  });
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Перевірте заповнені поля" };
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return { ok: false, error: "Спершу заповніть анкету профілю" };

  const d = parsed.data;
  await prisma.therapistProfile.update({
    where: { id: profile.id },
    data: {
      participatesInSocialSupport: d.participates,
      socialSupportDays: d.days as Weekday[],
      socialSupportDayParts: d.dayParts as DayPart[],
      socialSupportMinRate: d.minRate == null ? null : d.minRate * 100,
      socialSupportCurrency: d.currency ?? null,
    },
  });

  revalidatePath("/dashboard/contact");
  revalidatePath("/admin/social-support");
  // Позначка учасника видима в каталозі й на сторінці фахівця, а каталог
  // читається через кеш — без скидання тега позначка там не зʼявиться.
  revalidateTag(THERAPISTS_TAG);

  return { ok: true };
}

export type SocialStatusResult = { ok: true } | { ok: false; error: string };

/** Зміна статусу заявки — лише адміністратор. */
export async function setSocialSupportStatusAction(
  requestId: string,
  status: SocialSupportStatus,
): Promise<SocialStatusResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false, error: "Потрібні права адміністратора" };
  }

  const exists = await prisma.socialSupportRequest.findUnique({
    where: { id: requestId },
    select: { id: true },
  });
  if (!exists) return { ok: false, error: "Заявку не знайдено" };

  await prisma.socialSupportRequest.update({ where: { id: requestId }, data: { status } });
  revalidatePath("/admin/social-support");
  return { ok: true };
}
