"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { therapistProfileSchema } from "@/lib/schemas/therapist";

export type ProfileState =
  | { ok: true; slug: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Оновлює анкету фахівця: власні поля профілю + M2M-звʼязки
 * (спеціалізації, мови). Публікація (DRAFT → PENDING) відбувається
 * лише коли анкета заповнена повністю — далі профіль чекає на ручну
 * перевірку, як і описано в розділі «Етика і безпека» на сайті.
 */
export async function updateTherapistProfileAction(
  _prev: ProfileState | null,
  formData: FormData,
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user || (session.user.role !== "THERAPIST" && session.user.role !== "ADMIN")) {
    return { ok: false, error: "Потрібно увійти як фахівець" };
  }

  const raw = {
    fullName: formData.get("fullName"),
    professionalTitle: formData.get("professionalTitle") || null,
    city: formData.get("city"),
    bio: formData.get("bio"),
    photoUrl: formData.get("photoUrl") || null,
    yearsExperience: formData.get("yearsExperience"),
    priceFrom: formData.get("priceFrom"),
    priceTo: formData.get("priceTo") || null,
    currency: formData.get("currency") || "UAH",
    sessionFormat: formData.get("sessionFormat"),
    workingHours: formData.get("workingHours") || null,
    contactEmail: formData.get("contactEmail") || null,
    contactPhone: formData.get("contactPhone") || null,
    whatsapp: formData.get("whatsapp") || null,
    telegram: formData.get("telegram") || null,
    website: formData.get("website") || null,
    socialLinks: formData.getAll("socialLinks").filter(Boolean),
    specializationIds: formData.getAll("specializationIds"),
    languageCodes: formData.getAll("languageCodes"),
    approaches: formData.getAll("approaches"),
    otherApproach: formData.get("otherApproach") || null,
    otherLanguage: formData.get("otherLanguage") || null,
    analyticalOrientation: formData.get("analyticalOrientation") || null,
    ageGroups: formData.getAll("ageGroups"),
    workFormats: formData.getAll("workFormats"),
    professionalInterests: formData.getAll("professionalInterests"),
    associations: formData.getAll("associations"),
    supervisionStatus: formData.get("supervisionStatus") || null,
    personalTherapyStatus: formData.get("personalTherapyStatus") || null,
  };

  const parsed = therapistProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму — деякі поля заповнені некоректно",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const existing = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
  });
  if (!existing) {
    return { ok: false, error: "Профіль не знайдено" };
  }

  const { specializationIds, languageCodes, ...data } = parsed.data;

  // DRAFT → PENDING саме в момент завершення анкети; з PENDING/APPROVED
  // повторне редагування статус не змінює (щоб не губити верифікацію).
  const nextStatus = existing.status === "DRAFT" ? "PENDING" : existing.status;

  await prisma.$transaction([
    prisma.therapistProfile.update({
      where: { id: existing.id },
      data: {
        ...data,
        status: nextStatus,
        publishedAt: existing.publishedAt ?? new Date(),
      },
    }),
    prisma.therapistSpecialization.deleteMany({ where: { therapistId: existing.id } }),
    prisma.therapistSpecialization.createMany({
      data: specializationIds.map((specializationId) => ({
        therapistId: existing.id,
        specializationId,
      })),
    }),
    prisma.therapistLanguage.deleteMany({ where: { therapistId: existing.id } }),
    prisma.therapistLanguage.createMany({
      data: languageCodes.map((languageCode) => ({
        therapistId: existing.id,
        languageCode,
      })),
    }),
  ]);

  revalidatePath("/dashboard/profile");
  revalidatePath(`/specialists/${existing.slug}`);

  return { ok: true, slug: existing.slug };
}

/** Довідники для форми — спеціалізації й мови з бази. */
/** Порядок мов у списку анкети: найуживаніші вгорі, «Інша мова» — завжди останньою. */
const LANGUAGE_ORDER = ["uk", "ru", "en", "pl", "de", "fr", "es", "it", "cs", "pt", "other"];

export async function getProfileFormLookups() {
  const [specializations, languages] = await Promise.all([
    prisma.specialization.findMany({ orderBy: { nameUk: "asc" } }),
    prisma.language.findMany(),
  ]);

  // Сортуємо в коді, а не в БД: алфавітний порядок виносив «Інша мова»
  // на перше місце, хоча це технічний пункт-перемикач, а не мова.
  const rank = (code: string) => {
    const i = LANGUAGE_ORDER.indexOf(code);
    return i === -1 ? LANGUAGE_ORDER.length : i;
  };
  languages.sort((a, b) => rank(a.code) - rank(b.code) || a.nameUk.localeCompare(b.nameUk, "uk"));

  return { specializations, languages };
}
