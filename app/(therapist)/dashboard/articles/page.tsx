import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, FileText, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

const STATUS_LABEL: Record<"DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED", string> = {
  DRAFT: "Чернетка",
  REVIEW: "На перевірці",
  PUBLISHED: "Опубліковано",
  ARCHIVED: "Заархівовано",
};

const STATUS_TONE: Record<keyof typeof STATUS_LABEL, string> = {
  DRAFT: "bg-[#29323B]/[0.07] text-[#4A5568]",
  REVIEW: "bg-[#B38B49]/[0.14] text-[#876428]",
  PUBLISHED: "bg-[#2F6B4F]/[0.1] text-[#245A41]",
  ARCHIVED: "bg-[#29323B]/[0.07] text-[#4A5568]",
};

const KIND_LABEL: Record<
  "ARTICLE" | "NOTE" | "RESEARCH" | "BOOK_REVIEW" | "VIDEO" | "AUDIO",
  string
> = {
  ARTICLE: "Стаття",
  NOTE: "Професійна нотатка",
  RESEARCH: "Дослідження",
  BOOK_REVIEW: "Рецензія на книгу",
  VIDEO: "Відео",
  AUDIO: "Аудіо",
};

export default async function DashboardArticlesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const articles = await prisma.article.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
            Публікації
          </p>
          <h1
            className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Мої тексти
          </h1>
          <p className={cn("mt-3 max-w-md text-[15px] leading-relaxed", ink.muted)}>
            Статті, нотатки, дослідження — з'являються у вашому просторі й у бібліотеці VSI.
          </p>
        </div>
        <Link
          href="/dashboard/articles/new"
          className={cn(
            "inline-flex items-center gap-2 rounded-xl bg-[#1C3557] px-5 text-sm font-medium text-[#FFFDF8]",
            "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
            touch,
            focusRing,
          )}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Новий текст
        </Link>
      </div>

      <div className="mt-8 space-y-3">
        {articles.length === 0 ? (
          <div className="border-[#142744]/18 flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-14 text-center">
            <FileText className="h-7 w-7 text-[#8C93A0]" aria-hidden />
            <p className={cn("text-[15px]", ink.muted)}>У вас ще немає жодного тексту.</p>
            <Link
              href="/dashboard/articles/new"
              className={cn(
                "mt-1 inline-flex items-center rounded-xl bg-[#1C3557] px-5 text-sm font-medium text-[#FFFDF8]",
                "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
                touch,
                focusRing,
              )}
            >
              Написати перший
            </Link>
          </div>
        ) : (
          articles.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      STATUS_TONE[a.status],
                    )}
                  >
                    {STATUS_LABEL[a.status]}
                  </span>
                  <span className={cn("text-xs", ink.soft)}>{KIND_LABEL[a.kind]}</span>
                  <span className={cn("text-xs", ink.soft)}>
                    {new Date(a.createdAt).toLocaleDateString("uk-UA")}
                  </span>
                </div>
                <h2
                  className={cn("mt-1.5 truncate text-lg font-normal", ink.strong)}
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {a.title}
                </h2>
                {a.status === "DRAFT" && a.reviewNote && (
                  <p className={cn("mt-1 text-[13px] italic leading-relaxed", ink.muted)}>
                    Коментар адміністратора: «{a.reviewNote}»
                  </p>
                )}
              </div>
              {a.status === "PUBLISHED" && (
                <Link
                  href={`/blog/${a.slug}`}
                  className={cn(
                    "group/cta inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#1C3557]",
                    "transition-colors hover:text-[#142744] motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  Переглянути
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden
                  />
                </Link>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
