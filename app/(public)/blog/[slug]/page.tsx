import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";
import { formatDateUk } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    select: { title: true, excerpt: true },
  });
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!a) notFound();
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED", deletedAt: null },
    include: { author: { select: { name: true, therapist: { select: { slug: true } } } } },
  });
  if (!article) notFound();

  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-4xl font-semibold md:text-5xl">{article.title}</h1>
      <div className="mt-3 text-sm text-muted-foreground">
        {article.publishedAt ? formatDateUk(article.publishedAt) : ""} ·{" "}
        {article.author.therapist ? (
          <Link href={`/specialists/${article.author.therapist.slug}`} className="hover:underline">
            {article.author.name ?? ""}
          </Link>
        ) : (
          (article.author.name ?? "")
        )}
      </div>
      <div className="prose-analyt mt-10 whitespace-pre-line">
        {/* TODO: Спринт 4 — рендер через next-mdx-remote з whitelisted-компонентами */}
        {article.content}
      </div>
    </article>
  );
}
