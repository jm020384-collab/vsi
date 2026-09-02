import { redirect } from "next/navigation";
import slugify from "slugify";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getProfileFormLookups } from "@/lib/actions/therapist-profile";
import { ProfileWizard } from "./profile-wizard";

const PROFILE_INCLUDE = {
  specializations: true,
  languages: true,
  documents: { orderBy: { createdAt: "desc" as const } },
};

/** Перший візит на анкету — профілю ще нема, створюємо порожній чернетковий запис. */
async function getOrCreateTherapist(userId: string, fallbackName: string | null | undefined) {
  const existing = await prisma.therapistProfile.findUnique({
    where: { userId },
    include: PROFILE_INCLUDE,
  });
  if (existing) return existing;

  const baseSlug =
    slugify(fallbackName || "specialist", { lower: true, strict: true, locale: "uk" }) ||
    "specialist";
  let slug = baseSlug;
  let suffix = 0;
  for (;;) {
    const taken = await prisma.therapistProfile.findUnique({ where: { slug } });
    if (!taken) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  return prisma.therapistProfile.create({
    data: { userId, slug, fullName: fallbackName ?? "", bio: "", city: "", priceFrom: 0 },
    include: PROFILE_INCLUDE,
  });
}

/**
 * Анкета фахівця — заповнюється самостійно після реєстрації.
 * Дані звідси напряму формують публічний «Простір фахівця».
 */
export default async function TherapistProfileEditorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Валідність самого акаунта (JWT може пережити видалення User) уже
  // перевірена в dashboard/layout.tsx — тут одразу до профілю.
  const therapist = await getOrCreateTherapist(session.user.id, session.user.name);

  const { specializations, languages } = await getProfileFormLookups();

  return (
    <ProfileWizard
      therapist={{
        fullName: therapist.fullName,
        professionalTitle: therapist.professionalTitle,
        photoUrl: therapist.photoUrl,
        city: therapist.city,
        bio: therapist.bio,
        yearsExperience: therapist.yearsExperience,
        priceFrom: therapist.priceFrom,
        priceTo: therapist.priceTo,
        sessionFormat: therapist.sessionFormat,
        workingHours: therapist.workingHours,
        contactEmail: therapist.contactEmail,
        contactPhone: therapist.contactPhone,
        whatsapp: therapist.whatsapp,
        telegram: therapist.telegram,
        website: therapist.website,
        socialLinks: therapist.socialLinks,
        specializationIds: therapist.specializations.map((s) => s.specializationId),
        languageCodes: therapist.languages.map((l) => l.languageCode),
        slug: therapist.slug,
        status: therapist.status,
        approaches: therapist.approaches,
        otherApproach: therapist.otherApproach,
        otherLanguage: therapist.otherLanguage,
        analyticalOrientation: therapist.analyticalOrientation,
        ageGroups: therapist.ageGroups,
        workFormats: therapist.workFormats,
        professionalInterests: therapist.professionalInterests,
        associations: therapist.associations,
        supervisionStatus: therapist.supervisionStatus,
        personalTherapyStatus: therapist.personalTherapyStatus,
      }}
      documents={therapist.documents.map((d) => ({
        id: d.id,
        fileName: d.fileName,
        docType: d.docType,
        status: d.status,
        reviewNote: d.reviewNote,
      }))}
      specializationOptions={specializations.map((s) => ({ id: s.id, label: s.nameUk }))}
      languageOptions={languages.map((l) => ({ code: l.code, label: l.nameUk }))}
    />
  );
}
