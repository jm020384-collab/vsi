import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Monitor,
  MapPin,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { TherapistCard } from "@/components/preview/vsi/therapist-card";
import { findTheme, themeContent, FORMAT_LABEL, THEMES } from "@/components/preview/vsi/data";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return THEMES.flatMap((t) => [{ slug: t.slug }, ...t.subthemes.map((s) => ({ slug: s.slug }))]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = findTheme(slug);
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!found) notFound();
  return {
    title: found.entry.title,
    description: `Фахівці, статті, лекції та групи за темою «${found.entry.title}».`,
  };
}

/**
 * Сторінка теми — зріз усієї платформи.
 *
 * Людина заходить через тему («Втрата», «Я і моє внутрішнє життя»)
 * і бачить одразу все, що платформа має за нею: фахівців, статті,
 * лекції, групи. Працює і для п'яти великих тем, і для підтем.
 */
export default async function ThemePage({ params }: PageProps) {
  const { slug } = await params;
  const found = findTheme(slug);
  if (!found) notFound();

  const { entry, parent, subthemes } = found;
  const { therapists, articles, lectures, events } = themeContent(entry);

  const counts = [
    therapists.length && `${therapists.length} фахівців`,
    articles.length && `${articles.length} статей`,
    lectures.length && `${lectures.length} лекцій`,
    events.length && `${events.length} груп`,
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
      {/* ── Шапка теми ── */}
      <div className="pt-8 lg:pt-12">
        <Link
          href={parent ? `/themes/${parent.slug}` : "/#themes"}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {parent ? parent.title : "Усі теми"}
        </Link>

        <h1
          className={`mt-4 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {entry.title}
        </h1>

        {/* Коротке аналітичне пояснення — спосіб думати, не діагноз */}
        {entry.about && (
          <p className={`mt-5 max-w-2xl text-pretty text-[17px] leading-[1.75] ${ink.body}`}>
            {entry.about}
          </p>
        )}

        {/* Лічильники — тема як зріз платформи */}
        {counts.length > 0 && (
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[#876428]">
            {counts.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />}
                {c}
              </span>
            ))}
          </p>
        )}

        {/* Підтеми великої теми */}
        {subthemes && subthemes.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {subthemes.map((s) => (
              <Link
                key={s.slug}
                href={`/themes/${s.slug}`}
                className={cn(
                  "inline-flex items-center rounded-full border border-[#142744]/15 bg-[#FFFDF8] px-4 text-sm text-[#4A5568]",
                  "transition-colors hover:border-[#142744]/35 hover:text-[#142744] motion-reduce:transition-none",
                  touch,
                  focusRing,
                )}
              >
                {s.title}
              </Link>
            ))}
          </div>
        )}

        {/* Суміжні поняття — рух між темами */}
        {entry.related && entry.related.length > 0 && (
          <div className="mt-6">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#5C6672]">
              Суміжні поняття
            </span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {entry.related.map((slug) => {
                const rel = findTheme(slug)?.entry;
                if (!rel) return null;
                return (
                  <Link
                    key={slug}
                    href={`/themes/${slug}`}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border border-[#B38B49]/35 bg-[#FFFDF8] px-4 text-sm text-[#1C3557]",
                      "transition-colors hover:border-[#B38B49]/70 motion-reduce:transition-none",
                      touch,
                      focusRing,
                    )}
                  >
                    {rel.title}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Статті та лекції — свідомо ПЕРЕД фахівцями ── */}
      {(articles.length > 0 || lectures.length > 0) && (
        <section className="mt-12" aria-labelledby="theme-materials">
          <h2
            id="theme-materials"
            className={`text-3xl font-normal ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Читати і слухати
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2">
            {[...articles, ...lectures].map((m) => (
              <li key={m.id}>
                <a
                  href={`/library/${m.id}`}
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-5",
                    "hover:border-[#142744]/22 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-16px_rgba(20,39,68,0.3)]",
                    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    focusRing,
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center rounded-full border border-[#142744]/15 bg-[#F8F4EC] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                      {m.kind}
                    </span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[#5C6672] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#142744] motion-reduce:transition-none"
                      aria-hidden
                    />
                  </div>
                  <h3
                    className={cn("mt-3 text-xl font-normal leading-snug", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {m.title}
                  </h3>
                  <p className={cn("mt-2 flex-1 text-[14px] leading-relaxed", ink.muted)}>
                    {m.excerpt}
                  </p>
                  <p className={cn("mt-4 flex items-center gap-2 text-[13px]", ink.soft)}>
                    {m.author}
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                    <Clock3 className="h-3.5 w-3.5" aria-hidden />
                    {m.readingMinutes} хв
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Фахівці ── */}
      {therapists.length > 0 && (
        <section className="mt-14" aria-labelledby="theme-therapists">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="theme-therapists"
              className={`text-3xl font-normal ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Фахівці, які працюють із цією темою
            </h2>
            <Link
              href="/therapists"
              className={cn(
                "hidden shrink-0 items-center gap-1.5 text-sm text-[#1C3557] hover:text-[#142744] sm:inline-flex",
                focusRing,
              )}
            >
              Простір фахівців
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {therapists.map((t) => (
              <TherapistCard key={t.id} therapist={t} seed={Number(t.id.slice(1)) || 0} />
            ))}
          </div>
        </section>
      )}

      {/* ── Групи ── */}
      {events.length > 0 && (
        <section className="mt-14" aria-labelledby="theme-events">
          <h2
            id="theme-events"
            className={`text-3xl font-normal ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Групи та події за темою
          </h2>
          <ul className="mt-6 grid gap-5 lg:grid-cols-2">
            {events.map((e) => {
              const full = e.seatsLeft === 0;
              return (
                <li
                  key={e.id}
                  className="flex flex-col rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                      {e.type}
                    </span>
                    {full ? (
                      <span className="text-xs font-medium text-[#8A4B33]">Місць немає</span>
                    ) : (
                      <span className="text-xs font-medium text-[#245A41]">
                        Вільно {e.seatsLeft} з {e.seatsTotal}
                      </span>
                    )}
                  </div>
                  <h3
                    className={cn("mt-3 text-xl font-normal leading-snug", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {e.title}
                  </h3>
                  <p className={cn("mt-2 flex-1 text-[14px] leading-relaxed", ink.muted)}>
                    {e.description}
                  </p>
                  <dl className={cn("mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm", ink.body)}>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Дата</dt>
                      <CalendarDays className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      <dd>{e.date}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Формат</dt>
                      {e.format === "offline" ? (
                        <MapPin className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      ) : (
                        <Monitor className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      )}
                      <dd>{FORMAT_LABEL[e.format]}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Ведучий</dt>
                      <Users className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      <dd>{e.lead}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ── Якщо тема поки порожня ── */}
      {counts.length === 0 && (
        <div className="border-[#142744]/18 mt-14 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-14 text-center">
          <p className={`mx-auto max-w-md text-[15px] leading-relaxed ${ink.muted}`}>
            За цією темою поки немає підібраного контенту. Загляньте до повного каталогу — або
            залиште запит, і ми підберемо фахівця вручну.
          </p>
          <Link
            href="/therapists"
            className={cn(
              "mt-6 inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
              touch,
              focusRing,
            )}
          >
            До каталогу фахівців
          </Link>
        </div>
      )}
    </div>
  );
}
