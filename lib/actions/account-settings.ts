"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/actions/verify-email";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Введіть поточний пароль"),
    newPassword: z.string().min(8, "Мінімум 8 символів"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export type ChangePasswordState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/** Мій профіль → Безпека: зміна пароля з підтвердженням поточного. */
export async function changePasswordAction(
  _prev: ChangePasswordState | null,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const raw = {
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  };
  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.passwordHash) return { ok: false, error: "Акаунт не знайдено" };

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!ok) {
    return {
      ok: false,
      error: "Невірний поточний пароль",
      fieldErrors: { currentPassword: ["Невірний поточний пароль"] },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, passwordChangedAt: new Date() },
  });

  return { ok: true };
}

export type ChangeEmailState = { ok: true; pendingEmail: string } | { ok: false; error: string };

/**
 * Мій профіль → Безпека: запит на зміну email. Основний email лишається
 * активним і залогінити можна ним же, доки нова адреса не підтверджена.
 */
export async function requestEmailChangeAction(
  _prev: ChangeEmailState | null,
  formData: FormData,
): Promise<ChangeEmailState> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const newEmail = String(formData.get("newEmail") ?? "")
    .trim()
    .toLowerCase();
  if (!newEmail || !newEmail.includes("@")) {
    return { ok: false, error: "Вкажіть коректний email" };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { ok: false, error: "Акаунт не знайдено" };

  if (newEmail === user.email) {
    return { ok: false, error: "Це вже ваш поточний email" };
  }

  const taken = await prisma.user.findFirst({
    where: { OR: [{ email: newEmail }, { pendingEmail: newEmail }] },
  });
  if (taken) {
    return { ok: false, error: "Цей email уже використовується" };
  }

  await prisma.user.update({ where: { id: user.id }, data: { pendingEmail: newEmail } });
  await sendVerificationEmail(newEmail, user.name);

  return { ok: true, pendingEmail: newEmail };
}

/** Скасувати незавершену зміну email (поки нова адреса не підтверджена). */
export async function cancelEmailChangeAction() {
  const session = await auth();
  if (!session?.user) return { ok: false as const, error: "Потрібно увійти" };

  await prisma.user.update({ where: { id: session.user.id }, data: { pendingEmail: null } });
  return { ok: true as const };
}
