"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const docSchema = z.object({
  fileUrl: z.string().url(),
  fileName: z.string().min(1).max(200),
  fileKey: z.string().min(1),
  docType: z.enum(["DIPLOMA", "CERTIFICATE", "ID", "OTHER"]).default("DIPLOMA"),
});

export type DocumentActionResult = { ok: true; id: string } | { ok: false; error: string };

/**
 * Додає завантажений диплом/сертифікат до профілю поточного фахівця.
 * Файл уже лежить в UploadThing (client widget завантажує напряму) —
 * тут лише прив'язуємо метадані до профілю. Перевірка — вручну,
 * адміністратором; reviewedAt лишається null до розгляду.
 *
 * Повертає результат, а НЕ кидає виняток: цю дію викликають прямим
 * викликом з клієнта (не через <form action>), і кинутий тут Error
 * доходив до браузера як 500 → екран «Щось пішло не так», навіть
 * усередині try/catch на клієнті.
 */
export async function addVerificationDocumentAction(
  input: z.infer<typeof docSchema>,
): Promise<DocumentActionResult> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { ok: false, error: "Потрібно увійти як фахівець" };
  }

  const parsed = docSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: first
        ? `Файл не збережено: ${first.path.join(".")} — ${first.message}`
        : "Некоректні дані файлу",
    };
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
    return { ok: false, error: "Не вдалося зберегти документ. Спробуйте ще раз." };
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
