import type { Metadata } from "next";
import Link from "@/components/i18n/link";
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
import { AnalyticPanel } from "@/components/preview/vsi/analytic-panel";
import { analyticNote } from "@/components/preview/vsi/analytic-notes";
import { TherapistCard } from "@/components/preview/vsi/therapist-card";
import { findTheme, themeContent, FORMAT_LABEL, THEMES } from "@/components/preview/vsi/data";
import { loadPublishedMaterials } from "@/lib/materials";
import { loadUpcomingEvents } from "@/lib/events";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";
import { getI18n } from "@/lib/i18n/server";
import { countLabel } from "@/lib/i18n/counts";
import { pageMetadata } from "@/lib/i18n/metadata";
import { createContentTranslator, localizeEvents, localizeMaterials } from "@/lib/i18n/content";
import { TranslatedNote } from "@/components/i18n/translated-note";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return THEMES.flatMap((t) => [{ slug: t.slug }, ...t.subthemes.map((s) => ({ slug: s.slug }))]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, tr } = await getI18n();
  const found = findTheme(slug);
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!found) notFound();
  return pageMetadata(locale, `/themes/${slug}`, {
    title: tr(found.entry.title),
    description: tr("Фахівці, статті, лекції та групи за темою «{title}».", {
      title: tr(found.entry.title),
    }),
  });
}

/**
 * Сторінка теми — зріз усієї платформи.
 *
 * Людина заходить через тему («Втрата», «Я і моє внутрішнє життя»)
 * і бачить одразу все, що платформа має за нею: фахівців, статті,
 * лекції, групи. Працює і для п'яти великих тем, і для підтем.
 */
export default async function ThemePage({ params }: PageProps) {
  const { tr, locale } = await getI18n();
  const { slug } = await params;
  const found = findTheme(slug);
  if (!found) notFound();

  const { entry, parent, subthemes } = found;
  const note = analyticNote(entry.slug);
  const [texts, upcoming] = await Promise.all([
    loadPublishedMaterials(),
    loadUpcomingEvents(locale),
  ]);
  // Підбір за темою йде за українськими словами, переклад — лише після нього.
  const found_ = themeContent(entry, texts, upcoming);
  const content = createContentTranslator(locale);
  const { therapists } = found_;
  const articles = localizeMaterials(found_.articles, content);
  const lectures = localizeMaterials(found_.lectures, content);
  const events = localizeEvents(found_.events, content);

  const counts = [
    therapists.length && countLabel(therapists.length, "therapists", tr),
    articles.length && countLabel(articles.length, "articles", tr),
    lectures.length && countLabel(lectures.length, "lectures", tr),
    events.length && countLabel(events.length, "groups", tr),
  ].filter(Boolean) as string[];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-14 sm:px-8 lg:px-10">
      {/* ── Шапка теми ── */}
      <div className="pt-6 lg:pt-8">
        <Link
          href={parent ? `/themes/${parent.slug}` : "/#themes"}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {parent ? tr(parent.title) : tr("Усі теми")}
        </Link>

        <h1
          className={`mt-4 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {tr(entry.title)}
        </h1>

        {/* Коротке аналітичне пояснення — спосіб думати, не діагноз */}
        {entry.about && (
          <p className={`mt-5 max-w-2xl text-pretty text-[17px] leading-[1.75] ${ink.body}`}>
            {tr(entry.about)}
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
          <div className="mt-4 flex flex-wrap gap-2">
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
                {tr(s.title)}
              </Link>
            ))}
          </div>
        )}

        {/* Суміжні поняття — рух між темами */}
        {entry.related && entry.related.length > 0 && (
          <div className="mt-4">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#5C6672]">
              {tr("Суміжні поняття")}
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
                    {tr(rel.title)}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/*
        ── Юнгіанська нотатка ──

        Стоїть перед усіма переліками навмисно. Сторінка теми була
        вітриною чужого — статті, фахівці, групи; власного змісту в
        неї не було. Нотатка дає темі голос ще до того, як почнеться
        перелік, і лишає сторінці сенс навіть тоді, коли матеріалів
        за темою ще немає. Є лише у шести великих тем, не в підтем.
      */}
      {note && <AnalyticPanel note={note} />}

      <TranslatedNote show={content.used} className="mt-7" />

      {/* ── Статті та лекції — свідомо ПЕРЕД фахівцями ── */}
      {(articles.length > 0 || lectures.length > 0) && (
        <section className="mt-8" aria-labelledby="theme-materials">
          <h2
            id="theme-materials"
            className={`text-3xl font-normal ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {tr("Читати і слухати")}
          </h2>
          <ul className="mt-4 grid gap-5 sm:grid-cols-2">
            {[...articles, ...lectures].map((m) => (
              <li key={m.id}>
                <Link
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
                      {tr(m.kind)}
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
                    {m.readingMinutes} {tr("хв")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Фахівці ── */}
      {therapists.length > 0 && (
        <section className="mt-10" aria-labelledby="theme-therapists">
          <div className="flex items-end justify-between gap-4">
            <h2
              id="theme-therapists"
              className={`text-3xl font-normal ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              {tr("Фахівці, які працюють із цією темою")}
            </h2>
            <Link
              href="/therapists"
              className={cn(
                "hidden shrink-0 items-center gap-1.5 text-sm text-[#1C3557] hover:text-[#142744] sm:inline-flex",
                focusRing,
              )}
            >
              {tr("Простір фахівців")}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {therapists.map((t) => (
              <TherapistCard key={t.id} therapist={t} seed={Number(t.id.slice(1)) || 0} />
            ))}
          </div>
        </section>
      )}

      {/* ── Групи ── */}
      {events.length > 0 && (
        <section className="mt-10" aria-labelledby="theme-events">
          <h2
            id="theme-events"
            className={`text-3xl font-normal ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {tr("Групи та події за темою")}
          </h2>
          <ul className="mt-4 grid gap-5 lg:grid-cols-2">
            {events.map((e) => {
              const full = e.seatsLeft === 0;
              return (
                <li
                  key={e.id}
                  className="flex flex-col rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                      {tr(e.typeLabel)}
                    </span>
                    {e.closedReason === "closed" ? (
                      <span className="text-xs font-medium text-[#876428]">
                        {tr("Запис закрито")}
                      </span>
                    ) : e.seatsTotal !== null && e.seatsLeft !== null ? (
                      full ? (
                        <span className="text-xs font-medium text-[#8A4B33]">
                          {tr("Місць немає")}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-[#245A41]">
                          {tr("Вільно")} {e.seatsLeft} {tr("з")} {e.seatsTotal}
                        </span>
                      )
                    ) : null}
                  </div>
                  <h3
                    className={cn("mt-3 text-xl font-normal leading-snug", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    <Link href={`/events#${e.slug}`} className="hover:underline">
                      {e.title}
                    </Link>
                  </h3>
                  <p className={cn("mt-2 flex-1 text-[14px] leading-relaxed", ink.muted)}>
                    {e.description}
                  </p>
                  <dl className={cn("mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm", ink.body)}>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{tr("Дата")}</dt>
                      <CalendarDays className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      <dd>{e.dateLabel}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{tr("Формат")}</dt>
                      {e.format === "offline" ? (
                        <MapPin className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      ) : (
                        <Monitor className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      )}
                      <dd>{tr(FORMAT_LABEL[e.format])}</dd>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">{tr("Ведучий")}</dt>
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
        <div className="border-[#142744]/18 mt-10 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-10 text-center">
          <p className={`mx-auto max-w-md text-[15px] leading-relaxed ${ink.muted}`}>
            {tr(
              "За цією темою поки немає підібраного контенту. Загляньте до повного каталогу — або залиште запит, і ми підберемо фахівця вручну.",
            )}
          </p>
          <Link
            href="/therapists"
            className={cn(
              "mt-4 inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
              touch,
              focusRing,
            )}
          >
            {tr("До каталогу фахівців")}
          </Link>
        </div>
      )}
    </div>
  );
}
