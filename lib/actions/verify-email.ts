"use server";

import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { Resend } from "resend";

import { prisma } from "@/lib/db";
import { hashIp } from "@/lib/hash";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Реєстрація не логінить одразу — акаунт стає робочим лише після
 * переходу за посиланням з листа. Це і відсіює фейкові адреси, і
 * прибирає крихкий ланцюжок «зареєструвати → одразу signIn → push»,
 * що раніше падав по дорозі до /dashboard.
 */
export async function sendVerificationEmail(email: string, name: string | null) {
  const lower = email.toLowerCase();
  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.deleteMany({ where: { identifier: lower } });
  await prisma.verificationToken.create({
    data: { identifier: lower, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
  });

  if (!process.env.RESEND_API_KEY) return;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/verify-email?token=${token}&email=${encodeURIComponent(lower)}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "VSI <noreply@example.com>",
      to: lower,
      subject: "Підтвердьте реєстрацію на VSI",
      text: `Вітаємо${name ? `, ${name}` : ""}!\n\nЩоб завершити реєстрацію на VSI, підтвердьте email за посиланням:\n${url}\n\nПосилання дійсне 24 години. Якщо ви не реєструвались на VSI — просто проігноруйте цей лист.`,
    });
  } catch {
    // Лист — best-effort; токен уже в базі, є ручний "надіслати ще раз".
  }
}

export type ConfirmEmailResult = { ok: true } | { ok: false; error: "invalid" | "expired" };

/** Викликається зі сторінки /verify-email при переході за посиланням з листа. */
export async function confirmEmail(email: string, token: string): Promise<ConfirmEmailResult> {
  const lower = email.toLowerCase();

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: lower, token } },
  });
  if (!record) return { ok: false, error: "invalid" };

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: lower, token } },
    });
    return { ok: false, error: "expired" };
  }

  await prisma.$transaction([
    prisma.user.updateMany({ where: { email: lower }, data: { emailVerified: new Date() } }),
    prisma.verificationToken.delete({ where: { identifier_token: { identifier: lower, token } } }),
  ]);

  return { ok: true };
}

export type ResendState = { ok: true } | { ok: false; error: string };

/** Кнопка «Надіслати лист ще раз» — на сторінках реєстрації/входу. */
export async function resendVerificationEmailAction(
  _prev: ResendState | null,
  formData: FormData,
): Promise<ResendState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { ok: false, error: "Вкажіть email" };

  // hashIp зберігається на майбутнє (лог/аналітика зловживань), сам
  // ліміт нижче — по cooldown токена, без окремої таблиці спроб.
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  void hashIp(ip);

  // VerificationToken зберігає лише ОДИН активний токен на identifier
  // (sendVerificationEmail видаляє попередній) — власного "createdAt"
  // немає, тож "щойно надісланий" визначаємо через expires: якщо до
  // завершення строку лишилось майже весь TTL, лист щойно пішов.
  const existing = await prisma.verificationToken.findFirst({ where: { identifier: email } });
  if (existing && existing.expires.getTime() > Date.now() + TOKEN_TTL_MS - RESEND_COOLDOWN_MS) {
    return {
      ok: false,
      error: "Лист щойно надіслано. Перевірте пошту (і теку «Спам») або спробуйте за хвилину.",
    };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  // Навмисно не підказуємо, чи існує акаунт — та сама відповідь в обох випадках.
  if (user && !user.emailVerified) {
    await sendVerificationEmail(email, user.name);
  }

  return { ok: true };
}
