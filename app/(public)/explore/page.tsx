import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeGlyph } from "@/components/preview/vsi/sections/themes";
import { THEMES, findTheme, themeContent } from "@/components/preview/vsi/data";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export const metadata: Metadata = {
  title: "Досліджувати",
  description:
    "Мапа психологічних тем VSI: поняття, що перетікають одне в одне. Почніть із будь-якої точки — кожна веде далі.",
};

/** Перетини — пари понять, між якими природно рухатись. */
const CROSSINGS: [string, string][] = [
  ["blyzkist", "samotnist"],
  ["vtrata", "sens"],
  ["snovydinnia", "symvoly"],
  ["tryvoha", "vnutrishniy-konflikt"],
  ["mihratsiia", "identychnist"],
  ["dytynstvo", "povtorennia"],
];

/**
 * Досліджувати — редакційна мапа тем.
 *
 * Свідомо не список симптомів: шість смислових кластерів у зміщеній
 * сітці, з'єднаних тонкими орбітами. Поняття всередині кластера —
 * живі посилання; внизу — «перетини», рух між кластерами.
 */
export default function ExplorePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Тонкі орбіти, що зв'язують кластери */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[340px] hidden w-[1400px] -translate-x-1/2 opacity-[0.5] lg:block"
        viewBox="0 0 1400 900"
        fill="none"
      >
        <ellipse
          cx="700"
          cy="430"
          rx="640"
          ry="300"
          stroke="#B38B49"
          strokeOpacity="0.22"
          strokeWidth="1"
          transform="rotate(-8 700 430)"
        />
        <ellipse
          cx="700"
          cy="450"
          rx="480"
          ry="380"
          stroke="#142744"
          strokeOpacity="0.07"
          strokeWidth="1"
          transform="rotate(14 700 450)"
        />
        <circle
          cx="700"
          cy="440"
          r="260"
          stroke="#B38B49"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="1 7"
        />
      </svg>

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
        {/* ── Шапка ── */}
        <div className="max-w-2xl pt-10 lg:pt-14">
          <p className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
            <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
            Мапа тем
          </p>
          <h1
            className={`mt-5 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Досліджувати
          </h1>
          <p className={`mt-5 text-pretty text-[17px] leading-relaxed ${ink.muted}`}>
            Це не перелік симптомів і не анкета. Це мапа понять, які перетікають одне в одне:
            близькість межує із самотністю, втрата — із сенсом, тривога — з тим, що не має слів.
            Почніть із будь-якої точки — кожна веде далі.
          </p>
        </div>

        {/* ── Кластери у зміщеній редакційній сітці ── */}
        <div className="mt-14 grid gap-x-10 gap-y-12 lg:grid-cols-12">
          {THEMES.map((theme, i) => {
            const c = themeContent(theme);
            const total =
              c.therapists.length + c.articles.length + c.lectures.length + c.events.length;
            // Зміщення колонок — мапа, а не таблиця; картки в одному ряду
            // лишаються вирівняними по верху (без mt-зсувів, що ламали ряд).
            const placement = [
              "lg:col-span-5 lg:col-start-1",
              "lg:col-span-5 lg:col-start-8",
              "lg:col-span-5 lg:col-start-2",
              "lg:col-span-5 lg:col-start-8",
              "lg:col-span-5 lg:col-start-1",
              "lg:col-span-5 lg:col-start-7",
            ][i];

            return (
              <article key={theme.slug} className={cn("max-w-xl", placement)}>
                <div className="flex items-center gap-4">
                  <ThemeGlyph slug={theme.slug} />
                  <h2
                    className={`text-2xl font-normal leading-snug sm:text-3xl ${ink.strong}`}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    <Link
                      href={`/themes/${theme.slug}`}
                      className={cn("transition-colors hover:text-[#1C3557]", focusRing)}
                    >
                      {theme.title}
                    </Link>
                  </h2>
                </div>

                {theme.about && (
                  <p className={`mt-3 text-[15px] leading-relaxed ${ink.muted}`}>{theme.about}</p>
                )}

                {/* Поняття кластера — редакційний рядок, не чекліст */}
                <p className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1.5 text-[15px] leading-relaxed">
                  {theme.subthemes.map((s, j) => (
                    <span key={s.slug} className="inline-flex items-baseline gap-2">
                      {j > 0 && (
                        <span aria-hidden className="text-[#B38B49]">
                          ·
                        </span>
                      )}
                      <Link
                        href={`/themes/${s.slug}`}
                        title={s.about}
                        className={cn(
                          "text-[#1C3557] underline decoration-[#B38B49]/40 underline-offset-4 transition-colors hover:decoration-[#B38B49]",
                          focusRing,
                        )}
                      >
                        {s.title}
                      </Link>
                    </span>
                  ))}
                </p>

                {total > 0 && (
                  <p className="mt-3 text-[13px] text-[#876428]">
                    {[
                      c.therapists.length && `${c.therapists.length} фахівців`,
                      c.articles.length && `${c.articles.length} статей`,
                      c.lectures.length && `${c.lectures.length} лекцій`,
                      c.events.length && `${c.events.length} груп`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {/* ── Перетини ── */}
        <div className="mt-20 border-t border-[#142744]/10 pt-10">
          <h2
            className={`text-2xl font-normal ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Перетини
          </h2>
          <p className={`mt-2 max-w-xl text-[15px] leading-relaxed ${ink.muted}`}>
            Теми не живуть окремо. Найцікавіше починається там, де одна переходить в іншу.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {CROSSINGS.map(([a, b]) => {
              const ta = findTheme(a)?.entry;
              const tb = findTheme(b)?.entry;
              if (!ta || !tb) return null;
              return (
                <li
                  key={`${a}-${b}`}
                  className="border-[#142744]/12 flex items-stretch overflow-hidden rounded-full border bg-[#FFFDF8]"
                >
                  <Link
                    href={`/themes/${a}`}
                    className={cn(
                      "inline-flex min-h-[44px] items-center pl-4 pr-2 text-sm text-[#1C3557] hover:bg-[#142744]/[0.04]",
                      focusRing,
                    )}
                  >
                    {ta.title}
                  </Link>
                  <span aria-hidden className="self-center text-[#B38B49]">
                    ↔
                  </span>
                  <Link
                    href={`/themes/${b}`}
                    className={cn(
                      "inline-flex min-h-[44px] items-center pl-2 pr-4 text-sm text-[#1C3557] hover:bg-[#142744]/[0.04]",
                      focusRing,
                    )}
                  >
                    {tb.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Далі ── */}
        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            href="/therapists"
            className={cn(
              "inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Простір фахівців
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href="/library"
            className={cn(
              "border-[#142744]/22 inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-6 text-sm font-medium text-[#142744]",
              "transition-colors hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Бібліотека
          </Link>
        </div>
      </div>
    </div>
  );
}
