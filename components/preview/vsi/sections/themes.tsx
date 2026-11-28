import Link from "@/components/i18n/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { THEMES, themeContent, type Theme } from "../data";
import { focusRing, ink, VSI } from "../theme";
import { getI18n } from "@/lib/i18n/server";
import { countLabel } from "@/lib/i18n/counts";
import type { Translate } from "@/lib/i18n/translate";

/**
 * «Що привело вас сюди?» — тематичні входи.
 *
 * Не «яка у вас проблема», а п'ять великих тем внутрішнього життя.
 * Тема — зріз усієї платформи: фахівці, статті, лекції, групи.
 */

const NAVY = VSI.navy;
const GOLD = VSI.gold;

/** Мініатюрні лінійні знаки тем — той самий словник форм, що й у бренду. */
export function ThemeGlyph({ slug }: { slug: Theme["slug"] }) {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12" aria-hidden fill="none">
      {slug === "inner-life" && (
        <>
          {/* Внутрішнє життя: видиме над поверхнею, глибина під нею */}
          <line
            x1="12"
            y1="32"
            x2="52"
            y2="32"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.5"
          />
          <path d="M 21 32 A 11 11 0 0 1 43 32" stroke={NAVY} strokeWidth="1.3" />
          <path d="M 21 32 A 11 11 0 0 0 43 32 Z" fill={NAVY} fillOpacity="0.45" />
          <circle cx="32" cy="38" r="2.6" fill={GOLD} />
        </>
      )}
      {slug === "me-and-other" && (
        <>
          {/* Я та Інший: два кола і спільне поле */}
          <circle cx="26" cy="32" r="11" stroke={NAVY} strokeWidth="1.3" />
          <circle cx="38" cy="32" r="11" stroke={NAVY} strokeWidth="1.3" strokeOpacity="0.55" />
          <path
            d="M 32 22.8 A 11 11 0 0 1 32 41.2 A 11 11 0 0 1 32 22.8 Z"
            fill={GOLD}
            fillOpacity="0.35"
          />
        </>
      )}
      {slug === "my-history" && (
        <>
          {/* Історія: шари часу, що тримають теперішнє */}
          <path
            d="M 14 46 A 18 18 0 0 1 50 46"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.35"
          />
          <path
            d="M 19 46 A 13 13 0 0 1 45 46"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.6"
          />
          <path d="M 24 46 A 8 8 0 0 1 40 46" stroke={NAVY} strokeWidth="1.3" />
          <line
            x1="12"
            y1="46"
            x2="52"
            y2="46"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.5"
          />
          <circle cx="32" cy="42" r="2.6" fill={GOLD} />
        </>
      )}
      {slug === "in-transition" && (
        <>
          {/* Період змін: сфера над горизонтом, шлях угору */}
          <line
            x1="12"
            y1="40"
            x2="52"
            y2="40"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.5"
          />
          <circle cx="32" cy="40" r="9" stroke={NAVY} strokeWidth="1.3" strokeDasharray="1 4" />
          <circle cx="32" cy="26" r="6" fill={GOLD} fillOpacity="0.9" />
          <line
            x1="32"
            y1="35"
            x2="32"
            y2="49"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.4"
          />
        </>
      )}
      {slug === "identity" && (
        <>
          {/* Ідентичність і сенс: вісь і центр, який тримає */}
          <circle cx="32" cy="34" r="15" stroke={NAVY} strokeWidth="1.3" strokeOpacity="0.4" />
          <circle cx="32" cy="34" r="9" stroke={NAVY} strokeWidth="1.3" />
          <line
            x1="32"
            y1="12"
            x2="32"
            y2="25"
            stroke={NAVY}
            strokeWidth="1.3"
            strokeOpacity="0.6"
          />
          <circle cx="32" cy="34" r="3" fill={GOLD} />
        </>
      )}
      {slug === "know-myself" && (
        <>
          {/* Глибинне дослідження: орбіта навколо центру */}
          <ellipse
            cx="32"
            cy="32"
            rx="19"
            ry="8"
            transform="rotate(-24 32 32)"
            stroke={GOLD}
            strokeWidth="1.3"
            strokeOpacity="0.8"
          />
          <circle cx="32" cy="32" r="6.5" stroke={NAVY} strokeWidth="1.3" />
          <circle cx="32" cy="32" r="2.2" fill={NAVY} />
          <circle cx="46" cy="24" r="2.8" fill={GOLD} />
        </>
      )}
    </svg>
  );
}

function countsLine(theme: Theme, tr: Translate) {
  const c = themeContent(theme);
  const parts: string[] = [];
  if (c.therapists.length) parts.push(countLabel(c.therapists.length, "therapists", tr));
  if (c.articles.length) parts.push(countLabel(c.articles.length, "articles", tr));
  if (c.lectures.length) parts.push(countLabel(c.lectures.length, "lectures", tr));
  if (c.events.length) parts.push(countLabel(c.events.length, "groups", tr));
  return parts.join(" · ");
}

export async function Themes() {
  const { tr } = await getI18n();
  return (
    <section id="themes" className="bg-[#FFFDF8]">
      <Wrap className="py-14 lg:py-20">
        <div className="max-w-2xl">
          <Eyebrow>{tr("Тематичні входи")}</Eyebrow>
          <SectionTitle className="mt-4">{tr("Що привело вас сюди?")}</SectionTitle>
          <Lead className="mt-4">
            {tr(
              "Не діагноз і не «проблема» — тема. Оберіть ту, що відгукується: за нею відкриються фахівці, які з нею працюють, статті, лекції та групи.",
            )}
          </Lead>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {THEMES.map((theme) => (
            <li key={theme.slug} className="h-full">
              <Link
                href={`/themes/${theme.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-2xl border border-[#142744]/10 bg-[#F8F4EC] p-6",
                  "hover:border-[#142744]/22 transition-all duration-300 hover:-translate-y-1 hover:bg-[#FFFDF8] hover:shadow-[0_16px_36px_-18px_rgba(20,39,68,0.28)]",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  focusRing,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <ThemeGlyph slug={theme.slug} />
                  <ArrowRight
                    className="mt-1 h-4 w-4 shrink-0 text-[#5C6672] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[#142744] motion-reduce:transition-none"
                    aria-hidden
                  />
                </div>

                <h3
                  className={cn("mt-4 text-2xl font-normal leading-snug", ink.strong)}
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {tr(theme.title)}
                </h3>
                <p className={cn("mt-2 flex-1 text-[14px] leading-relaxed", ink.muted)}>
                  {tr(theme.subline)}
                </p>

                {/* Тема — зріз платформи: скільки за нею живого контенту */}
                <p className="mt-5 border-t border-[#142744]/[0.08] pt-3.5 text-[13px] text-[#876428]">
                  {countsLine(theme, tr)}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        {/* Тихий вихід для тих, хто не впізнав себе */}
        <p className={cn("mt-6 text-[15px]", ink.muted)}>
          {tr("Не впізнали себе в жодній темі?")}{" "}
          <Link
            href="/explore"
            className={cn(
              "font-medium text-[#1C3557] underline-offset-4 hover:underline",
              focusRing,
            )}
          >
            {tr("Відкрийте повну мапу тем")}
          </Link>{" "}
          {tr("або")}{" "}
          <Link
            href="/therapists"
            className={cn(
              "font-medium text-[#1C3557] underline-offset-4 hover:underline",
              focusRing,
            )}
          >
            {tr("перегляньте всіх фахівців")}
          </Link>
          .
        </p>
      </Wrap>
    </section>
  );
}
