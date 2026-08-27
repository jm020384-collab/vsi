import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ArticleReviewRow } from "@/components/admin/article-review-row";

export const metadata: Metadata = { title: "Статті на перевірці · Адмін-панель" };

export default async function AdminArticlesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const articles = await prisma.article.findMany({
    where: { status: "REVIEW", deletedAt: null },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold">Статті на перевірці</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {articles.length === 0
          ? "Немає статей, надісланих на перевірку."
          : `На перевірці: ${articles.length}`}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Автори можуть публікувати тексти й напряму — тут лише ті, хто сам попросив другий погляд.
      </p>

      {articles.length > 0 && (
        <ul className="mt-8">
          {articles.map((a) => (
            <ArticleReviewRow
              key={a.id}
              id={a.id}
              title={a.title}
              authorName={a.author.name ?? "—"}
              createdAt={a.createdAt.toLocaleDateString("uk-UA")}
              excerpt={a.excerpt}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
