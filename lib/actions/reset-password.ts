"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { z } from "zod";

import { prisma } from "@/lib/db";

const TOKEN_TTL_MS = 45 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

/**
 * Крок 1: запит на відновлення. Відповідь навмисно однакова незалежно
 * від того, чи існує акаунт із цим email — це захищає від перевірки
 * сторонніми, які адреси зареєстровані на VSI.
 */
export async function requestPasswordResetAction(
  _prev: { ok: true } | null,
  formData: FormData,
): Promise<{ ok: true }> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user?.passwordHash) {
      const existing = await prisma.passwordResetToken.findFirst({ where: { identifier: email } });
      const recentlySent =
        existing && existing.expires.getTime() > Date.now() + TOKEN_TTL_MS - RESEND_COOLDOWN_MS;

      if (!recentlySent) {
        const token = randomBytes(32).toString("hex");
        await prisma.passwordResetToken.deleteMany({ where: { identifier: email } });
        await prisma.passwordResetToken.create({
          data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
        });

        if (process.env.RESEND_API_KEY) {
          const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
              from: process.env.EMAIL_FROM ?? "VSI <noreply@example.com>",
              to: email,
              subject: "Відновлення пароля VSI",
              text: `Ми отримали запит на зміну пароля.\n\nСтворити новий пароль:\n${url}\n\nПосилання дійсне 45 хвилин. Якщо ви не надсилали цей запит, нічого робити не потрібно.`,
            });
          } catch {
            // best-effort, як і verify-email
          }
        }
      }
    }
  }

  // Завжди ok:true з однаковим повідомленням — незалежно від існування акаунта.
  return { ok: true };
}

const newPasswordSchema = z
  .object({
    password: z.string().min(8, "Мінімум 8 символів"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export type ResetPasswordState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Крок 3: власне зміна пароля за токеном з посилання в листі. */
export async function resetPasswordAction(
  _prev: ResetPasswordState | null,
  formData: FormData,
): Promise<ResetPasswordState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const token = String(formData.get("token") ?? "");

  const raw = {
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const parsed = newPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const record = await prisma.passwordResetToken.findUnique({
    where: { identifier_token: { identifier: email, token } },
  });
  if (!record || record.expires < new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({
        where: { identifier_token: { identifier: email, token } },
      });
    }
    return { ok: false, error: "Посилання недійсне або застаріло. Запросіть нове." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.$transaction([
    prisma.user.updateMany({
      where: { email },
      data: { passwordHash, passwordChangedAt: new Date() },
    }),
    // Усі інші видані reset-токени для цього email — теж одноразові, гасимо разом.
    prisma.passwordResetToken.deleteMany({ where: { identifier: email } }),
  ]);

  return { ok: true };
}
