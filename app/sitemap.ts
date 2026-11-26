import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { THEMES } from "@/components/preview/vsi/data";
import { localizeHref } from "@/lib/i18n/config";

// Не пре-рендерити на етапі build (БД може бути недоступна);
// генеруємо на льоту і кешуємо на годину.
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [therapists, articles] = await Promise.all([
    prisma.therapistProfile.findMany({
      where: { status: "APPROVED", deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pro-metod`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/therapists`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/library`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/events`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/social-support`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/explore`, changeFrequency: "monthly", priority: 0.6 },
    ...THEMES.flatMap((t) => [t, ...t.subthemes]).map((t) => ({
      url: `${base}/themes/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
    ...therapists.map((t) => ({
      url: `${base}/specialists/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${base}/library/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  // Кожна сторінка існує двома мовами, і пошуковик має бачити обидві
  // адреси разом із зв'язком між ними.
  return pages.flatMap((page) => {
    const ru = `${base}${localizeHref(page.url.slice(base.length), "ru")}`;
    const alternates = { languages: { uk: page.url, ru } };
    return [
      { ...page, alternates },
      { ...page, url: ru, alternates },
    ];
  });
}
