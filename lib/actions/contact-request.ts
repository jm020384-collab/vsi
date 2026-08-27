"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hashIp } from "@/lib/hash";
import { contactRequestSchema } from "@/lib/schemas/contact-request";

export type ContactRequestState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const MAX_REQUESTS_PER_DAY = 3;

/**
 * Перше звернення клієнта до фахівця через VSI.
 *
 * Anti-spam на цьому етапі — без Cloudflare Turnstile (не підключено):
 * honeypot-поле «website» (боти заповнюють приховане поле, люди — ні)
 * і ліміт за хешем IP на одного фахівця за добу.
 */
export async function createContactRequestAction(
  _prev: ContactRequestState | null,
  formData: FormData,
): Promise<ContactRequestState> {
  if (formData.get("website")) {
    // Пастка для ботів: тихо «успішно», щоб не підказувати, у чому річ.
    return { ok: true };
  }

  const raw = {
    therapistSlug: formData.get("therapistSlug"),
    patientName: formData.get("patientName"),
    patientEmail: formData.get("patientEmail"),
    patientPhone: formData.get("patientPhone") || "",
    preferredTime: formData.get("preferredTime") || undefined,
    message: formData.get("message"),
    consent: formData.get("consent") === "on",
  };

  const parsed = contactRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму — деякі поля заповнені некоректно",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const therapist = await prisma.therapistProfile.findUnique({
    where: { slug: parsed.data.therapistSlug },
    select: { id: true, contactEmail: true, fullName: true, acceptsRequestsViaVsi: true },
  });
  if (!therapist || !therapist.acceptsRequestsViaVsi) {
    return { ok: false, error: "Цей фахівець наразі не приймає звернення через VSI" };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const ipHash = hashIp(ip);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentCount = await prisma.contactRequest.count({
    where: { therapistId: therapist.id, ipHash, createdAt: { gte: since } },
  });
  if (recentCount >= MAX_REQUESTS_PER_DAY) {
    return {
      ok: false,
      error: "Забагато звернень з цієї адреси за останню добу. Спробуйте пізніше.",
    };
  }

  await prisma.contactRequest.create({
    data: {
      therapistId: therapist.id,
      patientName: parsed.data.patientName,
      patientEmail: parsed.data.patientEmail,
      patientPhone: parsed.data.patientPhone || null,
      preferredTime: parsed.data.preferredTime || null,
      message: parsed.data.message,
      ipHash,
      consentGiven: true,
      consentAt: new Date(),
    },
  });

  revalidatePath("/dashboard/requests");

  if (therapist.contactEmail && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.EMAIL_FROM ?? "VSI <noreply@example.com>",
        to: therapist.contactEmail,
        subject: "Нове звернення через VSI",
        text: `Вітаємо, ${therapist.fullName}!\n\nНа вашу сторінку VSI надійшло нове звернення від ${parsed.data.patientName} (${parsed.data.patientEmail}).\n\nПереглянути: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/dashboard/requests`,
      });
    } catch {
      // Лист — best-effort; звернення вже збережено в базі незалежно від нього.
    }
  }

  return { ok: true };
}

/** Позначає звернення опрацьованим — власник профілю, до якого воно надійшло. */
export async function markRequestClosedAction(requestId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Потрібно увійти");

  const request = await prisma.contactRequest.findUnique({
    where: { id: requestId },
    select: { therapist: { select: { userId: true } } },
  });
  if (!request || request.therapist.userId !== session.user.id) {
    throw new Error("Звернення не знайдено");
  }

  await prisma.contactRequest.update({ where: { id: requestId }, data: { status: "CLOSED" } });
  revalidatePath("/dashboard/requests");
}
