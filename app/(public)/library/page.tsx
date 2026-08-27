import type { Metadata } from "next";

import { prisma } from "@/lib/db";
import { MATERIALS, LIBRARY_CATEGORIES, type Material } from "@/components/preview/vsi/data";
import { LibraryClient } from "./library-client";

export const metadata: Metadata = {
  title: "Бібліотека",
  description:
    "Тексти, лекції та дослідження фахівців VSI: психотерапія, стосунки, тривога, несвідоме, сновидіння, міграція, втрата, ідентичність, символи.",
};

const CATEGORY_SET = new Set<string>(LIBRARY_CATEGORIES);

export default async function LibraryPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: { author: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });

  const realMaterials: Material[] = articles.map((a) => ({
    id: a.slug,
    kind: "Стаття",
    title: a.title,
    excerpt: a.excerpt,
    readingMinutes: Math.max(1, Math.round(a.content.split(/\s+/).length / 200)),
    author: a.author.name ?? "Фахівець VSI",
    categories: a.tags
      .map((t) => t.tag.nameUk)
      .filter((c): c is Material["categories"][number] => CATEGORY_SET.has(c)),
    imageUrl: a.coverUrl ?? undefined,
  }));

  // Свіжі реальні тексти — попереду демо-контенту.
  const materials = [...realMaterials, ...MATERIALS];

  return <LibraryClient materials={materials} />;
}
