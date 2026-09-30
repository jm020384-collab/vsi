import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/db";
import {
  type AgeGroup,
  type Format,
  type Therapist,
  type WorkFormat,
} from "@/components/preview/vsi/data";

const FORMAT_MAP: Record<string, Format> = { ONLINE: "online", OFFLINE: "offline", BOTH: "both" };
const AGE_GROUP_MAP: Record<string, AgeGroup> = {
  CHILDREN: "children",
  TEENS: "teens",
  ADULTS: "adults",
};
const WORK_FORMAT_MAP: Record<string, WorkFormat> = {
  INDIVIDUAL: "individual",
  COUPLES: "couples",
  FAMILY: "family",
  GROUP: "group",
};

const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Каталог фахівців — лише ті, хто зареєструвався сам.
 *
 * Спільне джерело для сторінки каталогу і для ряду на головній, щоб
 * обидва місця показували те саме. Демо-персони прибрані: вигаданих
 * фахівців на сайті психотерапії бути не повинно.
 */
export async function loadTherapists(): Promise<Therapist[]> {
  const rows = await prisma.therapistProfile.findMany({
    where: { status: "APPROVED", deletedAt: null },
    include: {
      user: { select: { email: true } },
      specializations: { include: { specialization: true } },
      languages: { include: { language: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  const cutoff = Date.now() - NEW_WINDOW_MS;

  return rows.map((r) => ({
    id: r.slug,
    name: r.fullName,
    status: r.professionalTitle ?? "Фахівець VSI",
    approach: r.analyticalOrientation ?? "Аналітична психотерапія",
    yearsOfPractice: r.yearsExperience,
    languages: r.languages.map((l) => l.language.nameUk),
    format: FORMAT_MAP[r.sessionFormat] ?? "both",
    topics: r.specializations.map((s) => s.specialization.nameUk),
    priceFrom: r.priceFrom,
    currency: r.currency === "UAH" ? "грн" : r.currency,
    sessionMinutes: 50,
    verified: true,
    acceptingNew: r.acceptingNewClients,
    city: r.city,
    photo: r.photoUrl ?? undefined,
    isReal: true,
    researchInterests: r.professionalInterests,
    ageGroups: r.ageGroups.map((g) => AGE_GROUP_MAP[g]).filter((g): g is AgeGroup => Boolean(g)),
    workFormats: r.workFormats
      .map((f) => WORK_FORMAT_MAP[f])
      .filter((f): f is WorkFormat => Boolean(f)),
    isNew: r.publishedAt ? r.publishedAt.getTime() > cutoff : false,
  }));
}

/** Тег для скидання кешу з дій модерації. */
export const THERAPISTS_TAG = "therapists";

/**
 * Те саме, але через кеш даних.
 *
 * Кешувати саму сторінку не вийде: кореневий layout читає сесію, тож
 * будь-яка сторінка рендериться на кожен запит. Головна від того не
 * повинна щоразу ходити в базу — склад каталогу міняється рідко, а
 * модерація скидає кеш явно через revalidateTag.
 */
export const loadTherapistsCached = unstable_cache(loadTherapists, ["therapists-list"], {
  revalidate: 300,
  tags: [THERAPISTS_TAG],
});
