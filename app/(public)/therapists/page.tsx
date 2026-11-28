import type { Metadata } from "next";

import { loadTherapists } from "@/lib/therapists";
import { shuffle } from "@/lib/shuffle";
import { createContentTranslator, localizeTherapists } from "@/lib/i18n/content";
import { TranslatedNote } from "@/components/i18n/translated-note";
import { TherapistCatalog } from "@/components/preview/vsi/catalog";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  return pageMetadata(locale, "/therapists", {
    title: tr("Психологи та психотерапевти онлайн українською"),
    description: tr(
      "Каталог перевірених фахівців аналітично орієнтованої (юнгіанської) психотерапії: освіта, теми, мови, формат і вартість. Кожен профіль проходить ручну перевірку.",
    ),
  });
}

// Список залежить від модерації (approve/reject) — завжди свіжі дані, без кешування сторінки.
export const dynamic = "force-dynamic";

export default async function TherapistsPage() {
  // Порядок випадковий на кожне відкриття: інакше завжди першими лишалися б
  // ті, хто зареєструвався останнім, а найпершим фахівцям — гірше місце.
  // Фільтри в каталозі порядок не міняють, лише відсіюють.
  const { locale } = await getI18n();
  const content = createContentTranslator(locale);
  const therapists = localizeTherapists(shuffle(await loadTherapists()), content);
  return (
    <>
      <TherapistCatalog therapists={therapists} />
      <TranslatedNote show={content.used} className="mb-7 px-5 text-center" />
    </>
  );
}
