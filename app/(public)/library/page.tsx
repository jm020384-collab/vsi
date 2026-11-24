import type { Metadata } from "next";

import { loadPublishedMaterials } from "@/lib/materials";
import { shuffle } from "@/lib/shuffle";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "Бібліотека",
  description:
    "Тексти, лекції та дослідження фахівців VSI: психотерапія, стосунки, тривога, несвідоме, сновидіння, міграція, втрата, ідентичність, символи.",
};

export default async function LibraryPage() {
  // Порядок випадковий на кожне відкриття: інакше завжди першими лишалися б
  // найновіші тексти. Фільтр за темою порядок не міняє, лише відсіює.
  return <LibraryClient materials={shuffle(await loadPublishedMaterials())} />;
}
