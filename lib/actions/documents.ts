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

/**
 * Додає завантажений диплом/сертифікат до профілю поточного фахівця.
 * Файл уже лежить в UploadThing (client widget завантажує напряму) —
 * тут лише прив'язуємо метадані до профілю. Перевірка — вручну,
 * адміністратором; reviewedAt лишається null до розгляду.
 */
export async function addVerificationDocumentAction(input: z.infer<typeof docSchema>) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    throw new Error("Потрібно увійти як фахівець");
  }

  const parsed = docSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Некоректні дані файлу");
  }

  const profile = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!profile) throw new Error("Профіль не знайдено");

  await prisma.verificationDocument.create({
    data: { ...parsed.data, therapistId: profile.id },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/qualifications");
}

export async function removeVerificationDocumentAction(documentId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Потрібно увійти");

  const doc = await prisma.verificationDocument.findUnique({
    where: { id: documentId },
    include: { therapist: true },
  });
  if (!doc || doc.therapist.userId !== session.user.id) {
    throw new Error("Документ не знайдено");
  }

  await prisma.verificationDocument.delete({ where: { id: documentId } });
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/qualifications");
}
