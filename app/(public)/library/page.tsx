import type { Metadata } from "next";

import { loadPublishedMaterials } from "@/lib/materials";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "Бібліотека",
  description:
    "Тексти, лекції та дослідження фахівців VSI: психотерапія, стосунки, тривога, несвідоме, сновидіння, міграція, втрата, ідентичність, символи.",
};

export default async function LibraryPage() {
  return <LibraryClient materials={await loadPublishedMaterials()} />;
}
