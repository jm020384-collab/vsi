"use server";

import bcrypt from "bcryptjs";
import slugify from "slugify";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/schemas/auth";

export type RegisterState =
  | { ok: true; userId: string; email: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function registerAction(
  _prev: RegisterState | null,
  formData: FormData,
): Promise<RegisterState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    consent: formData.get("consent") === "on",
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, password } = parsed.data;
  const lower = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: lower } });
  if (existing) {
    return { ok: false, error: "Користувач з таким email уже існує" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Реєстрація — лише для фахівців; роль ізсередини нізвідки не приймаємо.
  const user = await prisma.user.create({
    data: {
      email: lower,
      name,
      passwordHash,
      role: "THERAPIST",
    },
  });

  const baseSlug = slugify(name, { lower: true, strict: true, locale: "uk" });
  let slug = baseSlug;
  let suffix = 0;
  for (;;) {
    const exists = await prisma.therapistProfile.findUnique({ where: { slug } });
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
  await prisma.therapistProfile.create({
    data: {
      userId: user.id,
      slug,
      fullName: name,
      bio: "",
      city: "",
      priceFrom: 0,
      status: "DRAFT",
    },
  });

  return { ok: true, userId: user.id, email: lower };
}
