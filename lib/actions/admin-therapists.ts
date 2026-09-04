"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { THERAPISTS_TAG } from "@/lib/therapists";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

/**
 * Профіль лишається доступним лише власнику, поки не APPROVED — тож
 * жодних додаткових revalidatePath для /specialists тут не буває зайвим:
 * сторінка починає віддаватись публічно щойно статус зміниться.
 *
 * Повертає {ok,error} замість throw: ці дії викликаються напряму з
 * клієнта (не через <form>), а кинутий виняток із такого виклику
 * на проді може дійти до клієнта як необроблена 500-помилка замість
 * акуратного повідомлення — той самий клас багу, що й у реєстрації
 * на подію, виправлений раніше.
 */
export async function approveTherapistAction(therapistId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId } });
  if (!therapist || therapist.status !== "PENDING") {
    return { ok: false, error: "Анкету не знайдено або вона вже розглянута" };
  }

  await prisma.$transaction([
    prisma.therapistProfile.update({
      where: { id: therapistId },
      data: { status: "APPROVED", reviewNote: null },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "therapist.approved",
        entity: "TherapistProfile",
        entityId: therapistId,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/therapists");
  revalidatePath("/dashboard");
  revalidatePath("/therapists");
  revalidateTag(THERAPISTS_TAG);
  revalidatePath("/");
  revalidatePath(`/specialists/${therapist.slug}`);
  return { ok: true };
}

export async function rejectTherapistAction(
  therapistId: string,
  reason: string,
): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const note = reason.trim();
  if (note.length < 5) {
    return { ok: false, error: "Вкажіть причину відхилення (щонайменше 5 символів)" };
  }

  const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId } });
  if (!therapist || therapist.status !== "PENDING") {
    return { ok: false, error: "Анкету не знайдено або вона вже розглянута" };
  }

  await prisma.$transaction([
    prisma.therapistProfile.update({
      where: { id: therapistId },
      data: { status: "REJECTED", reviewNote: note },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "therapist.rejected",
        entity: "TherapistProfile",
        entityId: therapistId,
        meta: { reason: note },
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/therapists");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function suspendTherapistAction(
  therapistId: string,
  reason: string,
): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const note = reason.trim();
  if (note.length < 5) {
    return { ok: false, error: "Вкажіть причину деактивації (щонайменше 5 символів)" };
  }

  const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId } });
  if (!therapist || therapist.status !== "APPROVED") {
    return { ok: false, error: "Профіль не знайдено або він не активний" };
  }

  await prisma.$transaction([
    prisma.therapistProfile.update({
      where: { id: therapistId },
      data: { status: "SUSPENDED", reviewNote: note },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "therapist.suspended",
        entity: "TherapistProfile",
        entityId: therapistId,
        meta: { reason: note },
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/therapists");
  revalidatePath("/dashboard");
  revalidatePath("/therapists");
  revalidateTag(THERAPISTS_TAG);
  revalidatePath("/");
  revalidatePath(`/specialists/${therapist.slug}`);
  return { ok: true };
}

export async function reactivateTherapistAction(therapistId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const therapist = await prisma.therapistProfile.findUnique({ where: { id: therapistId } });
  if (!therapist || therapist.status !== "SUSPENDED") {
    return { ok: false, error: "Профіль не знайдено або він не призупинений" };
  }

  await prisma.$transaction([
    prisma.therapistProfile.update({
      where: { id: therapistId },
      data: { status: "APPROVED", reviewNote: null },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "therapist.reactivated",
        entity: "TherapistProfile",
        entityId: therapistId,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/therapists");
  revalidatePath("/dashboard");
  revalidatePath("/therapists");
  revalidateTag(THERAPISTS_TAG);
  revalidatePath("/");
  revalidatePath(`/specialists/${therapist.slug}`);
  return { ok: true };
}
