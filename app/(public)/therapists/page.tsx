import type { Metadata } from "next";

import { loadTherapists } from "@/lib/therapists";
import { shuffle } from "@/lib/shuffle";
import { TherapistCatalog } from "@/components/preview/vsi/catalog";

export const metadata: Metadata = {
  title: "Психологи та психотерапевти онлайн українською",
  description:
    "Каталог перевірених фахівців аналітично орієнтованої (юнгіанської) психотерапії: освіта, теми, мови, формат і вартість. Кожен профіль проходить ручну перевірку.",
};

// Список залежить від модерації (approve/reject) — завжди свіжі дані, без кешування сторінки.
export const dynamic = "force-dynamic";

export default async function TherapistsPage() {
  // Порядок випадковий на кожне відкриття: інакше завжди першими лишалися б
  // ті, хто зареєструвався останнім, а найпершим фахівцям — гірше місце.
  // Фільтри в каталозі порядок не міняють, лише відсіюють.
  const therapists = shuffle(await loadTherapists());
  return <TherapistCatalog therapists={therapists} />;
}
