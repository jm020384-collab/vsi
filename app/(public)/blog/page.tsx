import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/db";
import { formatDateUk, truncate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Блог",
  description: "Статті про аналітично орієнтовану психотерапію та психічне здоров'я.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { name: true, therapist: { select: { slug: true } } } },
      tags: { include: { tag: true } },
    },
    take: 24,
  });

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-semibold">Блог</h1>
      <p className="mt-2 text-muted-foreground">Освітні матеріали про метод і про себе.</p>

      {articles.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
          Поки немає опублікованих статей. Перші матеріали з'являться найближчим часом.
        </div>
      ) : (
        <ul className="mt-10 space-y-8">
          {articles.map((a) => (
            <li key={a.id} className="group">
              <Link href={`/blog/${a.slug}`} className="block">
                <h2 className="text-2xl font-semibold group-hover:underline">{a.title}</h2>
              </Link>
              <div className="mt-1 text-xs text-muted-foreground">
                {a.publishedAt ? formatDateUk(a.publishedAt) : ""} ·{" "}
                {a.author.therapist ? (
                  <Link
                    href={`/specialists/${a.author.therapist.slug}`}
                    className="hover:underline"
                  >
                    {a.author.name ?? ""}
                  </Link>
                ) : (
                  (a.author.name ?? "")
                )}
              </div>
              <Link href={`/blog/${a.slug}`} className="block">
                <p className="mt-3 text-muted-foreground">{truncate(a.excerpt, 240)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
