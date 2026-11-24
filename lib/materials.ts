import { prisma } from "@/lib/db";
import { LIBRARY_CATEGORIES, type Material } from "@/components/preview/vsi/data";

const CATEGORY_SET = new Set<string>(LIBRARY_CATEGORIES);

/**
 * Опубліковані тексти фахівців — єдине джерело текстів на сайті.
 *
 * Раніше до них підмішувалися вигадані матеріали з data.ts, і на головній,
 * у бібліотеці та на сторінках тем люди бачили статті неіснуючих авторів.
 * Тепер тут лише те, що справді написали фахівці платформи.
 *
 * Автор підписується іменем із профілю фахівця, а не іменем акаунта:
 * акаунт може називатися як завгодно (латиницею, одним ім'ям).
 */
export async function loadPublishedMaterials(limit?: number): Promise<Material[]> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    include: {
      author: { include: { therapist: { select: { fullName: true } } } },
      tags: { include: { tag: true } },
    },
    orderBy: { publishedAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return articles.map((a) => ({
    id: a.slug,
    kind: "Стаття",
    title: a.title,
    excerpt: a.excerpt,
    readingMinutes: Math.max(1, Math.round(a.content.split(/\s+/).length / 200)),
    author: a.author.therapist?.fullName ?? a.author.name ?? "Фахівець VSI",
    categories: a.tags
      .map((t) => t.tag.nameUk)
      .filter((c): c is Material["categories"][number] => CATEGORY_SET.has(c)),
    imageUrl: a.coverUrl ?? undefined,
  }));
}
