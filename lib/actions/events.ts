"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashIp } from "@/lib/hash";
import { EVENT_TYPES } from "@/lib/schemas/event";
import { registrationClosedReason } from "@/lib/event-registration";

const eventSchema = z.object({
  title: z.string().min(4, "Заголовок надто короткий").max(160),
  description: z.string().min(20, "Опис надто короткий").max(1000),
  imageUrl: z.string().url().optional().nullable(),
  type: z.enum(EVENT_TYPES),
  format: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  language: z.string().min(2).max(40),
  startsAt: z.coerce.date({ errorMap: () => ({ message: "Вкажіть дату й час" }) }),
  seatsTotal: z.coerce.number().int().min(1).optional().nullable(),
  audience: z.enum(["PUBLIC", "PROFESSIONALS", "BOTH"]).default("PUBLIC"),
  contactName: z.string().max(120).optional().nullable(),
  contactEmail: z.string().email("Введіть коректний email").optional().nullable(),
  contactPhone: z
    .string()
    // Той самий шаблон, що в анкеті: реальні номери бувають із комами й
    // кількома країнами одразу, а 20 символів на це не вистачало.
    .regex(/^[+0-9\s\-(),;/]{7,120}$/, "Введіть коректний номер")
    .optional()
    .nullable(),
  price: z.coerce.number().int().min(0, "Вартість не може бути від'ємною").optional().nullable(),
});

export type EventState =
  | { ok: true; slug: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Публікація власної події фахівцем — одразу видима, без модерації. */
export async function createEventAction(
  _prev: EventState | null,
  formData: FormData,
): Promise<EventState> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { ok: false, error: "Потрібно увійти як фахівець" };
  }

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!therapist) {
    return { ok: false, error: "Спершу заповніть анкету профілю" };
  }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl") || null,
    type: formData.get("type"),
    format: formData.get("format"),
    language: formData.get("language") || "uk",
    startsAt: formData.get("startsAt"),
    seatsTotal: formData.get("seatsTotal") || null,
    audience: formData.get("audience") || "PUBLIC",
    contactName: formData.get("contactName") || null,
    contactEmail: formData.get("contactEmail") || null,
    contactPhone: formData.get("contactPhone") || null,
    price: formData.get("price") || null,
  };

  const parsed = eventSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму — деякі поля заповнені некоректно",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const baseSlug = slugify(parsed.data.title, { lower: true, strict: true, locale: "uk" });
  let slug = baseSlug;
  let suffix = 0;
  for (;;) {
    const exists = await prisma.event.findUnique({ where: { slug } });
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  await prisma.event.create({
    data: { ...parsed.data, slug, hostId: therapist.id, status: "PUBLISHED" },
  });

  revalidatePath("/dashboard/events");
  revalidatePath("/events");

  return { ok: true, slug };
}

export type EventDeleteResult = { ok: true } | { ok: false; error: string };

/**
 * Повертаємо результат, а не кидаємо виняток.
 *
 * Дію викликають напряму з клієнта через startTransition, а не через
 * <form action>. У такому виклику throw із серверної дії доходить до
 * браузера сирою 500-кою й піднімає межу помилки — тобто падає вся
 * сторінка замість повідомлення поруч із кнопкою.
 */
export async function deleteEventAction(eventId: string): Promise<EventDeleteResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { host: { select: { userId: true } } },
  });
  if (!event?.host || event.host.userId !== session.user.id) {
    return { ok: false, error: "Подію не знайдено" };
  }

  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { ok: true };
}

/**
 * Чи закритий запис і чому — рахуємо на сервері перед кожним записом.
 * Інтерфейс ховає кнопку, але покладатися на це не можна: дія
 * викликається напряму й має відмовляти сама.
 */
async function closedReasonFor(eventId: string): Promise<"closed" | "full" | null> {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      registrationOpen: true,
      seatsTotal: true,
      _count: { select: { registrations: { where: { status: "REGISTERED" } } } },
    },
  });
  if (!event) return "closed";
  return registrationClosedReason(event, event._count.registrations);
}

export type EventRegistrationOpenResult =
  | { ok: true; open: boolean }
  | { ok: false; error: string };

/**
 * Закрити або відкрити запис на власну подію.
 *
 * Подія при цьому лишається на сайті з усією інформацією — на відміну
 * від status = CANCELLED, який ховає її зовсім.
 */
export async function setEventRegistrationOpenAction(
  eventId: string,
  open: boolean,
): Promise<EventRegistrationOpenResult> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { host: { select: { userId: true } } },
  });
  if (!event?.host || event.host.userId !== session.user.id) {
    return { ok: false, error: "Подію не знайдено" };
  }

  await prisma.event.update({ where: { id: eventId }, data: { registrationOpen: open } });
  revalidatePath("/dashboard/events");
  revalidatePath("/events");
  return { ok: true, open };
}

export type EventInterestState =
  | { ok: true; status: "SAVED" | "REGISTERED" | null }
  | { ok: false; error: string };

/**
 * Зберегти подію «на потім» або зареєструватися — перемикач лише для
 * залогінених користувачів. Повертає стан замість кидання винятку:
 * викликається напряму з клієнта (не через <form>), а кинута помилка
 * з такого виклику на проді призводила до краху рендеру замість
 * акуратного повідомлення (гостьову реєстрацію тепер покриває
 * registerForEventAction — саме для НЕзалогінених відвідувачів).
 */
export async function setEventInterestAction(
  eventId: string,
  status: "SAVED" | "REGISTERED",
): Promise<EventInterestState> {
  const session = await auth();
  if (!session?.user) {
    return {
      ok: false,
      error:
        status === "SAVED"
          ? "Увійдіть, щоб зберігати події"
          : "Увійдіть або скористайтеся формою реєстрації нижче",
    };
  }

  const existing = await prisma.eventRegistration.findUnique({
    where: { eventId_userId: { eventId, userId: session.user.id } },
  });

  // Закритий запис не має обходитись повз інтерфейс. «Зберегти на потім»
  // лишається доступним завжди — воно не займає місця; забрати вже
  // наявний запис теж можна, інакше учасник опинився б у пастці.
  if (status === "REGISTERED" && existing?.status !== "REGISTERED") {
    const reason = await closedReasonFor(eventId);
    if (reason) {
      return {
        ok: false,
        error: reason === "full" ? "Місць більше немає" : "Запис на цю подію закрито",
      };
    }
  }

  let nextStatus: "SAVED" | "REGISTERED" | null;
  if (existing?.status === status) {
    await prisma.eventRegistration.delete({ where: { id: existing.id } });
    nextStatus = null;
  } else {
    await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId, userId: session.user.id } },
      update: { status },
      create: { eventId, userId: session.user.id, status },
    });
    nextStatus = status;
  }

  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { ok: true, status: nextStatus };
}

const guestRegistrationSchema = z.object({
  eventId: z.string().min(1),
  name: z.string().min(2, "Введіть ім'я").max(120),
  email: z.string().email("Введіть коректний email"),
  phone: z
    .string()
    // Той самий шаблон, що в анкеті: реальні номери бувають із комами й
    // кількома країнами одразу, а 20 символів на це не вистачало.
    .regex(/^[+0-9\s\-(),;/]{7,120}$/, "Введіть коректний номер")
    .optional()
    .or(z.literal("")),
});

export type GuestRegistrationState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const MAX_GUEST_REGISTRATIONS_PER_DAY = 15;

/**
 * Реєстрація на подію без акаунта — «Зареєструватися» бачить і може
 * використати будь-хто, хто бачить подію, без потреби спершу
 * реєструватися на VSI. Anti-spam — той самий патерн, що й у
 * createContactRequestAction: honeypot-поле + ліміт за хешем IP.
 */
export async function registerForEventAction(
  _prev: GuestRegistrationState | null,
  formData: FormData,
): Promise<GuestRegistrationState> {
  if (formData.get("website")) {
    return { ok: true };
  }

  const raw = {
    eventId: formData.get("eventId"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
  };

  const parsed = guestRegistrationSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму — деякі поля заповнені некоректно",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const event = await prisma.event.findUnique({
    where: { id: parsed.data.eventId },
    select: { id: true, status: true },
  });
  if (!event || event.status !== "PUBLISHED") {
    return { ok: false, error: "Подію не знайдено" };
  }

  // Раніше тут не перевірялось нічого, крім статусу: сторінка показувала
  // «Місць немає», а дія все одно приймала реєстрацію.
  const reason = await closedReasonFor(event.id);
  if (reason) {
    return {
      ok: false,
      error: reason === "full" ? "Місць більше немає" : "Запис на цю подію закрито",
    };
  }

  // Логін в іншій вкладці між рендером і сабмітом — реєструємо на акаунт,
  // а не як гостя, щоб не завести дублікат.
  const session = await auth();

  if (session?.user) {
    await prisma.eventRegistration.upsert({
      where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
      update: { status: "REGISTERED" },
      create: { eventId: event.id, userId: session.user.id, status: "REGISTERED" },
    });
    revalidatePath("/events");
    revalidatePath("/dashboard/events");
    return { ok: true };
  }

  const existingGuest = await prisma.eventRegistration.findFirst({
    where: { eventId: event.id, guestEmail: parsed.data.email },
  });
  if (existingGuest) {
    // Той самий email уже реєструвався — не дублюємо, тихо підтверджуємо.
    return { ok: true };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.eventRegistration.count({
    where: { ipHash, createdAt: { gte: since } },
  });
  if (recentCount >= MAX_GUEST_REGISTRATIONS_PER_DAY) {
    return {
      ok: false,
      error: "Забагато реєстрацій з цієї адреси за останню добу. Спробуйте пізніше.",
    };
  }

  await prisma.eventRegistration.create({
    data: {
      eventId: event.id,
      status: "REGISTERED",
      guestName: parsed.data.name,
      guestEmail: parsed.data.email,
      guestPhone: parsed.data.phone || null,
      ipHash,
    },
  });

  revalidatePath("/events");
  revalidatePath("/dashboard/events");
  return { ok: true };
}
