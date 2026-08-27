import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AvatarPortrait } from "@/components/preview/vsi/decor";
import {
  MATERIALS,
  THEMES,
  THERAPISTS,
  themeContent,
  type ThemeEntry,
} from "@/components/preview/vsi/data";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface RelatedLink {
  id: string;
  href: string;
  title: string;
}

interface SpecialistLink {
  id: string;
  href: string;
  name: string;
  approach: string;
  photo?: string | null;
  seed: number;
}

interface MaterialViewModel {
  kind: string;
  title: string;
  categories: string[];
  bodyParagraphs: string[] | null;
  excerpt: string;
  sources?: string[];
  readingMinutes: number;
  authorName: string;
  authorHref?: string;
  authorStatus?: string;
  authorPhoto?: string | null;
  authorSeed: number;
  concepts: ThemeEntry[];
  relatedArticles: RelatedLink[];
  topicSpecialists: SpecialistLink[];
}

function seedFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Підтеми, чиї стеми зустрічаються в тексті — той самий добір для реальних і демо-матеріалів. */
function matchConcepts(text: string, categories: string[]): ThemeEntry[] {
  const lower = text.toLowerCase();
  const out: ThemeEntry[] = [];
  for (const theme of THEMES) {
    for (const sub of theme.subthemes) {
      if (sub.match.some((s) => lower.includes(s.toLowerCase()))) out.push(sub);
    }
  }
  const catHit = (c: ThemeEntry) =>
    categories.some((cat) => c.title.toLowerCase().startsWith(cat.toLowerCase().slice(0, 5)));
  out.sort((a, b) => Number(catHit(b)) - Number(catHit(a)));
  return out.slice(0, 5);
}

async function loadMaterial(id: string): Promise<MaterialViewModel | null> {
  const session = await auth();

  const real = await prisma.article.findUnique({
    where: { slug: id },
    include: { author: { include: { therapist: true } }, tags: { include: { tag: true } } },
  });

  if (real) {
    const isOwner = session?.user?.id === real.authorId;
    if (real.status !== "PUBLISHED" && !isOwner) return null;

    const categories = real.tags.map((t) => t.tag.nameUk);
    const bodyParagraphs = real.content
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    const relatedRows = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        id: { not: real.id },
        tags: { some: { tagId: { in: real.tags.map((t) => t.tagId) } } },
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });

    return {
      kind: "Стаття",
      title: real.title,
      categories,
      bodyParagraphs,
      excerpt: real.excerpt,
      readingMinutes: Math.max(1, Math.round(real.content.split(/\s+/).length / 200)),
      authorName: real.author.therapist?.fullName ?? real.author.name ?? "Фахівець VSI",
      authorHref: real.author.therapist ? `/specialists/${real.author.therapist.slug}` : undefined,
      authorStatus: real.author.therapist ? "Фахівець VSI" : undefined,
      authorPhoto: real.author.therapist?.photoUrl,
      authorSeed: seedFromString(real.authorId),
      concepts: matchConcepts(`${real.title} ${real.excerpt} ${categories.join(" ")}`, categories),
      relatedArticles: relatedRows.map((r) => ({
        id: r.slug,
        href: `/library/${r.slug}`,
        title: r.title,
      })),
      topicSpecialists: [],
    };
  }

  const m = MATERIALS.find((x) => x.id === id);
  if (!m) return null;

  const author = THERAPISTS.find((t) => t.name === m.author);
  const concepts = matchConcepts(`${m.title} ${m.excerpt}`, m.categories);
  const relatedArticles = MATERIALS.filter(
    (x) => x.id !== m.id && x.categories.some((c) => m.categories.includes(c)),
  ).slice(0, 3);
  const topicSpecialists = concepts[0]
    ? themeContent(concepts[0])
        .therapists.filter((t) => t.name !== m.author)
        .slice(0, 3)
    : [];

  return {
    kind: m.kind,
    title: m.title,
    categories: m.categories,
    bodyParagraphs: m.body ?? null,
    excerpt: m.excerpt,
    sources: m.sources,
    readingMinutes: m.readingMinutes,
    authorName: m.author,
    authorHref: author ? `/specialists/${author.id}` : undefined,
    authorStatus: author?.status,
    authorPhoto: author?.photo,
    authorSeed: author ? Number(author.id.slice(1)) || 0 : 0,
    concepts,
    relatedArticles: relatedArticles.map((r) => ({
      id: r.id,
      href: `/library/${r.id}`,
      title: r.title,
    })),
    topicSpecialists: topicSpecialists.map((t) => ({
      id: t.id,
      href: `/specialists/${t.id}`,
      name: t.name,
      approach: t.approach,
      photo: t.photo,
      seed: Number(t.id.slice(1)) || 0,
    })),
  };
}

export function generateStaticParams() {
  return MATERIALS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const m = await loadMaterial(id);
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!m) notFound();
  return { title: m.title, description: m.excerpt };
}

/**
 * Сторінка матеріалу.
 *
 * Джерело — реальна опублікована стаття (Prisma) або демо-матеріал.
 * Текст — головне; внизу «Продовжити дослідження»: суміжні поняття,
 * пов'язані матеріали, простір автора і фахівці за темою. Стаття —
 * не глухий кут, а вузол руху.
 */
export default async function ArticlePage({ params }: PageProps) {
  const { id } = await params;
  const m = await loadMaterial(id);
  if (!m) notFound();

  return (
    <div className="mx-auto w-full max-w-[760px] px-5 pb-20 sm:px-8">
      <div className="pt-8 lg:pt-12">
        <Link
          href="/library"
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Бібліотека
        </Link>
      </div>

      {/* ── Шапка статті ── */}
      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-[#142744]/15 bg-[#FFFDF8] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
            {m.kind}
          </span>
          {m.categories.map((c) => (
            <span key={c} className={`text-[12px] ${ink.soft}`}>
              {c}
            </span>
          ))}
        </div>

        <h1
          className={`mt-4 text-balance text-3xl font-normal leading-[1.15] sm:text-[2.6rem] ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {m.title}
        </h1>

        <div className="mt-5 flex items-center gap-3">
          <AvatarPortrait
            name={m.authorName}
            seed={m.authorSeed}
            photo={m.authorPhoto ?? undefined}
            sizes="44px"
            fit="cover"
            className="h-11 w-11 shrink-0 overflow-hidden rounded-full"
          />
          <div>
            <div className={`text-[15px] font-medium ${ink.strong}`}>{m.authorName}</div>
            {m.authorStatus && <div className={`text-[13px] ${ink.soft}`}>{m.authorStatus}</div>}
          </div>
          <span className={`ml-auto inline-flex items-center gap-1.5 text-[13px] ${ink.soft}`}>
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            {m.readingMinutes} хв
          </span>
        </div>
      </header>

      <hr className="mt-6 border-[#142744]/10" />

      {/* ── Текст ── */}
      <article className="mt-8">
        {m.bodyParagraphs && m.bodyParagraphs.length > 0 ? (
          <div className="space-y-5">
            {m.bodyParagraphs.map((p, i) => (
              <p
                key={i}
                className={cn(
                  "text-pretty text-[17px] leading-[1.85]",
                  ink.body,
                  i === 0 &&
                    "first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-normal first-letter:leading-[0.85] first-letter:text-[#1C3557] first-letter:[font-family:var(--vsi-serif),Georgia,serif]",
                )}
              >
                {p}
              </p>
            ))}
          </div>
        ) : (
          <div>
            <p className={`text-pretty text-[17px] leading-[1.85] ${ink.body}`}>{m.excerpt}</p>
            <p
              className={`mt-6 rounded-xl border border-dashed border-[#142744]/15 bg-[#FFFDF8]/70 px-5 py-4 text-[14px] italic ${ink.soft}`}
            >
              Повний текст цього матеріалу готується до публікації.
            </p>
          </div>
        )}

        {m.sources && m.sources.length > 0 && (
          <div className="mt-10 border-t border-[#142744]/10 pt-5">
            <h2 className={`text-[13px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
              Джерела
            </h2>
            <ul className={`mt-3 space-y-1.5 text-[14px] ${ink.muted}`}>
              {m.sources.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* ── Продовжити дослідження ── */}
      <footer className="mt-14 border-t border-[#B38B49]/30 pt-8">
        <h2
          className={`text-2xl font-normal ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Продовжити дослідження
        </h2>

        {m.concepts.length > 0 && (
          <div className="mt-5">
            <h3 className={`text-[12px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
              Суміжні поняття
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {m.concepts.map((c) => (
                <Link
                  key={c.slug}
                  href={`/themes/${c.slug}`}
                  className={cn(
                    "inline-flex items-center rounded-full border border-[#B38B49]/35 bg-[#FFFDF8] px-4 text-sm text-[#1C3557]",
                    "transition-colors hover:border-[#B38B49]/70 motion-reduce:transition-none",
                    touch,
                    focusRing,
                  )}
                >
                  {c.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {m.relatedArticles.length > 0 && (
          <div className="mt-7">
            <h3 className={`text-[12px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
              Пов'язані матеріали
            </h3>
            <ul className="mt-3 space-y-2.5">
              {m.relatedArticles.map((r) => (
                <li key={r.id}>
                  <Link
                    href={r.href}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-4 py-3",
                      "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <span
                      className={`text-[16px] leading-snug ${ink.strong}`}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {r.title}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[#5C6672] group-hover:text-[#142744]"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {m.authorHref && (
          <div className="mt-7">
            <h3 className={`text-[12px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
              Простір автора
            </h3>
            <Link
              href={m.authorHref}
              className={cn(
                "mt-3 flex items-center gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-4 py-3.5",
                "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                focusRing,
              )}
            >
              <AvatarPortrait
                name={m.authorName}
                seed={m.authorSeed}
                photo={m.authorPhoto ?? undefined}
                sizes="48px"
                fit="cover"
                className="h-12 w-12 shrink-0 overflow-hidden rounded-full"
              />
              <span className="min-w-0 flex-1">
                <span className={`block text-[16px] font-medium ${ink.strong}`}>
                  {m.authorName}
                </span>
                {m.authorStatus && (
                  <span className={`block truncate text-[13px] ${ink.soft}`}>{m.authorStatus}</span>
                )}
                <span className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-[#1C3557]">
                  Познайомитися з фахівцем
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </span>
            </Link>
          </div>
        )}

        {m.topicSpecialists.length > 0 && m.concepts[0] && (
          <div className="mt-7">
            <h3 className={`text-[12px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
              Фахівці за темою «{m.concepts[0].title}»
            </h3>
            <ul className="mt-3 space-y-2.5">
              {m.topicSpecialists.map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.href}
                    className={cn(
                      "flex items-center gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-4 py-3",
                      "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <AvatarPortrait
                      name={t.name}
                      seed={t.seed}
                      photo={t.photo ?? undefined}
                      sizes="40px"
                      fit="cover"
                      className="h-10 w-10 shrink-0 overflow-hidden rounded-full"
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[15px] font-medium ${ink.strong}`}>
                        {t.name}
                      </span>
                      <span className={`block truncate text-[13px] ${ink.soft}`}>{t.approach}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </footer>
    </div>
  );
}
