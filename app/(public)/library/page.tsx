import type { Metadata } from "next";

import { loadPublishedMaterials } from "@/lib/materials";
import { shuffle } from "@/lib/shuffle";
import { createContentTranslator, localizeMaterials } from "@/lib/i18n/content";
import { LibraryClient } from "./library-client";
import { pageMetadata } from "@/lib/i18n/metadata";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  return pageMetadata(locale, "/library", {
    title: tr("Бібліотека"),
    description: tr(
      "Тексти, лекції та дослідження фахівців VSI: психотерапія, стосунки, тривога, несвідоме, сновидіння, міграція, втрата, ідентичність, символи.",
    ),
  });
}

export default async function LibraryPage() {
  // Порядок випадковий на кожне відкриття: інакше завжди першими лишалися б
  // найновіші тексти. Фільтр за темою порядок не міняє, лише відсіює.
  const { locale } = await getI18n();
  const content = createContentTranslator(locale);
  const materials = localizeMaterials(shuffle(await loadPublishedMaterials()), content);
  return <LibraryClient materials={materials} translated={content.used} />;
}
