"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const EDUCATION_TYPES = [
  "DIPLOMA",
  "CERTIFICATE",
  "COURSE",
  "MASTERCLASS",
  "CONFERENCE",
  "ID",
  "OTHER",
] as const;

/**
 * Запис освіти. Файл необовʼязковий — навчання можна просто описати
 * або позначити як «у процесі». Але порожній запис без жодного змісту
 * зберігати немає сенсу, тож вимагаємо хоча б заклад або файл.
 */
const educationSchema = z
  .object({
    institution: z.string().max(200).optional().nullable(),
    specialization: z.string().max(200).optional().nullable(),
    yearFrom: z.number().int().min(1950).max(2100).optional().nullable(),
    yearTo: z.number().int().min(1950).max(2100).optional().nullable(),
    inProgress: z.boolean().default(false),
    docType: z.enum(EDUCATION_TYPES).default("DIPLOMA"),
    fileUrl: z.string().url().optional().nullable(),
    fileName: z.string().min(1).max(200).optional().nullable(),
    fileKey: z.string().min(1).optional().nullable(),
  })
  .refine((d) => Boolean(d.institution?.trim()) || Boolean(d.fileUrl), {
    message: "Вкажіть заклад освіти або прикріпіть файл",
    path: ["institution"],
  })
  .refine((d) => !(d.yearFrom && d.yearTo) || d.yearTo >= d.yearFrom, {
    message: "Рік завершення не може бути раніше за рік початку",
    path: ["yearTo"],
  });

export type EducationInput = z.input<typeof educationSchema>;

export type DocumentActionResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Додає запис освіти до профілю поточного фахівця. Файл, якщо він є,
 * уже лежить в UploadThing (віджет завантажує напряму) — тут лише
 * зберігаємо метадані. Перевірка — вручну адміністратором, тож
 * reviewedAt лишається null до розгляду.
 *
 * Повертає результат, а НЕ кидає виняток: цю дію викликають прямим
 * викликом з клієнта (не через <form action>), і кинутий тут Error
 * доходив до браузера як 500 → екран «Щось пішло не так», навіть
 * усередині try/catch на клієнті.
 */
export async function addVerificationDocumentAction(
  input: EducationInput,
): Promise<DocumentActionResult> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { ok: false, error: "Потрібно увійти як фахівець" };
  }

  const parsed = educationSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: first?.message ?? "Некоректні дані запису" };
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) return { ok: false, error: "Профіль не знайдено" };

  try {
    const created = await prisma.verificationDocument.create({
      data: { ...parsed.data, therapistId: profile.id },
    });
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/qualifications");
    return { ok: true, id: created.id };
  } catch {
    return { ok: false, error: "Не вдалося зберегти запис. Спробуйте ще раз." };
  }
}

export async function removeVerificationDocumentAction(
  documentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Потрібно увійти" };

  const doc = await prisma.verificationDocument.findUnique({
    where: { id: documentId },
    include: { therapist: true },
  });
  if (!doc || doc.therapist.userId !== session.user.id) {
    return { ok: false, error: "Документ не знайдено" };
  }

  await prisma.verificationDocument.delete({ where: { id: documentId } });
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/qualifications");
  return { ok: true };
}
