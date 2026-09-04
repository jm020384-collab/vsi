import type { Metadata } from "next";

import { loadTherapists } from "@/lib/therapists";
import { TherapistCatalog } from "@/components/preview/vsi/catalog";

export const metadata: Metadata = {
  title: "Каталог фахівців",
  description:
    "Перевірені фахівці аналітично орієнтованої психотерапії: напрям, формат, мова, вартість. Кожен профіль проходить ручну верифікацію.",
};

// Список залежить від модерації (approve/reject) — завжди свіжі дані, без кешування сторінки.
export const dynamic = "force-dynamic";

export default async function TherapistsPage() {
  const therapists = await loadTherapists();
  return <TherapistCatalog therapists={therapists} />;
}
