"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

import {
  EDUCATION_KINDS,
  DEGREE_LEVELS,
  CONFERENCE_ROLES,
  DOCUMENT_TYPES,
} from "@/lib/education-constants";

const yearField = z
  .union([z.number(), z.string(), z.null()])
  .optional()
  .transform((v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : null;
  })
  .refine((v) => v === null || (v >= 1950 && v <= 2100), "Вкажіть рік між 1950 і 2100");

const text = (max: number) =>
  z
    .union([z.string(), z.null()])
    .optional()
    .transform((v) => {
      const t = typeof v === "string" ? v.trim() : "";
      return t ? t.slice(0, max) : null;
    });

const entrySchema = z
  .object({
    kind: z.enum(EDUCATION_KINDS),
    title: text(200),
    institution: text(200),
    faculty: text(200),
    specialization: text(200),
    degree: z.enum(DEGREE_LEVELS).nullish(),
    country: text(100),
    trainer: text(200),
    programType: text(120),
    duration: text(100),
    startYear: yearField,
    endYear: yearField,
    ongoing: z.boolean().default(false),
    expectedEndYear: yearField,
    eventDate: text(100),
    role: z.enum(CONFERENCE_ROLES).nullish(),
    presentationTitle: text(200),
    link: text(500),
    description: text(2000),
  })
  // Мінімум зі специфікації: базова освіта — заклад + спеціальність;
  // усі інші типи — назва або організація. Документ ніде не обовʼязковий.
  .refine(
    (d) =>
      d.kind === "EDUCATION"
        ? Boolean(d.institution) && Boolean(d.specialization)
        : Boolean(d.title) || Boolean(d.institution),
    {
      message: "Заповніть назву або заклад",
      path: ["institution"],
    },
  )
  .refine((d) => !(d.startYear && d.endYear) || d.endYear >= d.startYear, {
    message: "Рік завершення не може бути раніше за рік початку",
    path: ["endYear"],
  });

export type EducationEntryInput = z.input<typeof entrySchema>;
export type EducationResult = { ok: true; id: string } | { ok: false; error: string };

type ProfileGuard = { profileId: string } | { error: string };

async function requireTherapistProfile(): Promise<ProfileGuard> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { error: "Потрібно увійти як фахівець" };
  }
  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!profile) return { error: "Профіль не знайдено" };
  return { profileId: profile.id };
}

function revalidate() {
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/qualifications");
}

/**
 * Дії повертають результат, а не кидають виняток: їх викликають прямим
 * викликом з клієнта, і кинутий Error доходив би до браузера як 500 —
 * екран «Щось пішло не так» замість зрозумілого повідомлення.
 */
export async function saveEducationEntryAction(
  input: EducationEntryInput & { id?: string | null },
): Promise<EducationResult> {
  const guard = await requireTherapistProfile();
  if ("error" in guard) return { ok: false, error: guard.error };

  const parsed = entrySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Перевірте поля запису" };
  }

  const data = parsed.data;
  // Поки навчання триває, рік завершення не має сенсу — тримаємо його
  // порожнім, щоб публічний профіль не показав програму як завершену.
  if (data.ongoing) data.endYear = null;

  try {
    if (input.id) {
      const existing = await prisma.educationEntry.findUnique({
        where: { id: input.id },
        select: { therapistId: true },
      });
      if (!existing || existing.therapistId !== guard.profileId) {
        return { ok: false, error: "Запис не знайдено" };
      }
      const updated = await prisma.educationEntry.update({ where: { id: input.id }, data });
      revalidate();
      return { ok: true, id: updated.id };
    }

    const created = await prisma.educationEntry.create({
      data: { ...data, therapistId: guard.profileId },
    });
    revalidate();
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Не вдалося зберегти запис. Спробуйте ще раз." };
  }
}

export async function deleteEducationEntryAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const guard = await requireTherapistProfile();
  if ("error" in guard) return { ok: false, error: guard.error };

  const existing = await prisma.educationEntry.findUnique({
    where: { id },
    select: { therapistId: true },
  });
  if (!existing || existing.therapistId !== guard.profileId) {
    return { ok: false, error: "Запис не знайдено" };
  }

  await prisma.educationEntry.delete({ where: { id } });
  revalidate();
  return { ok: true };
}

const attachSchema = z.object({
  entryId: z.string().min(1),
  fileUrl: z.string().url(),
  fileName: z.string().min(1).max(200),
  fileKey: z.string().min(1),
  title: z.string().max(200).nullish(),
  docType: z.enum(DOCUMENT_TYPES).default("DIPLOMA"),
});

/** Прикріплює завантажений файл до запису освіти. Записів без файлу це не стосується. */
export async function attachEducationDocumentAction(
  input: z.input<typeof attachSchema>,
): Promise<EducationResult> {
  const guard = await requireTherapistProfile();
  if ("error" in guard) return { ok: false, error: guard.error };

  const parsed = attachSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Некоректні дані файлу" };
  }

  const entry = await prisma.educationEntry.findUnique({
    where: { id: parsed.data.entryId },
    select: { therapistId: true },
  });
  if (!entry || entry.therapistId !== guard.profileId) {
    return { ok: false, error: "Запис не знайдено" };
  }

  try {
    const created = await prisma.verificationDocument.create({
      data: { ...parsed.data, therapistId: guard.profileId },
    });
    revalidate();
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Не вдалося зберегти документ" };
  }
}

export async function deleteEducationDocumentAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const guard = await requireTherapistProfile();
  if ("error" in guard) return { ok: false, error: guard.error };

  const doc = await prisma.verificationDocument.findUnique({
    where: { id },
    select: { therapistId: true },
  });
  if (!doc || doc.therapistId !== guard.profileId) {
    return { ok: false, error: "Документ не знайдено" };
  }

  await prisma.verificationDocument.delete({ where: { id } });
  revalidate();
  return { ok: true };
}
