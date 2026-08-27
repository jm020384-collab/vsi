"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const contactSettingsSchema = z.object({
  acceptingNewClients: z.boolean(),
  acceptsRequestsViaVsi: z.boolean(),
  offersSupervision: z.boolean(),
  offersGroupWork: z.boolean(),
});

export type ContactSettingsState = { ok: true } | { ok: false; error: string };

/** Швидкі перемикачі доступності — окремо від багатокрокової анкети. */
export async function updateContactSettingsAction(
  _prev: ContactSettingsState | null,
  formData: FormData,
): Promise<ContactSettingsState> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { ok: false, error: "Потрібно увійти як фахівець" };
  }

  const parsed = contactSettingsSchema.safeParse({
    acceptingNewClients: formData.get("acceptingNewClients") === "on",
    acceptsRequestsViaVsi: formData.get("acceptsRequestsViaVsi") === "on",
    offersSupervision: formData.get("offersSupervision") === "on",
    offersGroupWork: formData.get("offersGroupWork") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: "Перевірте форму" };
  }

  const existing = await prisma.therapistProfile.findUnique({ where: { userId: session.user.id } });
  if (!existing) {
    return { ok: false, error: "Профіль не знайдено" };
  }

  await prisma.therapistProfile.update({ where: { id: existing.id }, data: parsed.data });

  revalidatePath("/dashboard/contact");
  revalidatePath(`/specialists/${existing.slug}`);

  return { ok: true };
}
