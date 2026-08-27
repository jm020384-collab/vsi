import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Clock,
  Languages,
  MapPin,
  Monitor,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AvatarPortrait } from "./decor";
import { FORMAT_LABEL, specialistSpace, type Therapist } from "./data";
import { focusRing, ink, touch, VSI } from "./theme";

/** Відмінювання: 1 рік / 2 роки / 5 років. */
function yearsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} рік`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} роки`;
  return `${n} років`;
}

/** Маркер довіри — свідома заміна зірковому рейтингу. */
function TrustMark({
  icon: Icon,
  children,
  tone = "neutral",
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  tone?: "neutral" | "verified" | "open";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "verified" && "bg-[#1C3557]/[0.07] text-[#1C3557]",
        tone === "open" && "bg-[#2F6B4F]/[0.09] text-[#245A41]",
        tone === "neutral" && "bg-[#29323B]/[0.06] text-[#4A5568]",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

export function TherapistCard({
  therapist: t,
  seed = 0,
  className,
  variant = "full",
}: {
  therapist: Therapist;
  seed?: number;
  className?: string;
  /**
   * "editorial" — для сторінки знайомства: великий портрет, коротка
   * професійна позиція замість переліку фактів, без ціни й маркерів
   * довіри. "full" (за замовчуванням) — картка з фактами для головної
   * та тематичних сторінок, лишається без змін.
   */
  variant?: "full" | "editorial";
}) {
  if (variant === "editorial") {
    const quote = specialistSpace(t).position[0];
    return (
      <article
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]",
          "transition-all duration-300 hover:-translate-y-1 hover:border-[#142744]/20 hover:shadow-[0_18px_40px_-18px_rgba(20,39,68,0.28)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          className,
        )}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#B38B49] to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-70 motion-reduce:transition-none"
        />

        <div className="relative">
          <AvatarPortrait
            name={t.name}
            seed={seed}
            photo={t.photo}
            arch={t.portraitStyle === "arch"}
            className="aspect-[4/5] w-full"
          />
          {t.verified && (
            <span className="bg-[#FFFDF8]/92 absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-[#1C3557] shadow-sm backdrop-blur-sm">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              Профіль перевірено
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3
            className={cn("text-2xl font-medium leading-tight", ink.strong)}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {t.name}
          </h3>
          <p className={cn("mt-1 text-sm leading-snug", ink.muted)}>{t.status}</p>

          {quote && (
            <blockquote
              className={cn("mt-4 line-clamp-3 text-[15px] italic leading-relaxed", ink.body)}
            >
              «{quote}»
            </blockquote>
          )}

          {t.topics.length > 0 && (
            <p className={cn("mt-4 text-[13px]", ink.soft)}>{t.topics.slice(0, 4).join(" · ")}</p>
          )}

          <a
            href={`/specialists/${t.id}`}
            className={cn(
              "group/cta mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-[#1C3557]",
              "transition-colors hover:text-[#142744] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Познайомитися
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]",
        "transition-all duration-300 hover:-translate-y-1 hover:border-[#142744]/20 hover:shadow-[0_18px_40px_-18px_rgba(20,39,68,0.28)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* Золота волосина проявляється на hover — акцент, не текст */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#B38B49] to-transparent opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-70 motion-reduce:transition-none"
      />

      <div className="relative">
        <AvatarPortrait
          name={t.name}
          seed={seed}
          photo={t.photo}
          arch={t.portraitStyle === "arch"}
          className="aspect-[4/3] w-full"
        />

        {t.verified && (
          <span className="bg-[#FFFDF8]/92 absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-[#1C3557] shadow-sm backdrop-blur-sm">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            Профіль перевірено
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className={cn("text-2xl font-medium leading-tight", ink.strong)}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {t.name}
        </h3>
        <p className={cn("mt-1 text-sm leading-snug", ink.muted)}>{t.status}</p>

        {/* Напрям роботи */}
        <p className="border-[#142744]/12 mt-3 inline-flex w-fit items-center rounded-md border px-2 py-1 text-xs font-medium text-[#1C3557]">
          {t.approach}
        </p>

        {/* Маркери довіри — замість зірок */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          <TrustMark icon={Clock}>{yearsLabel(t.yearsOfPractice)} практики</TrustMark>
          {t.acceptingNew ? (
            <TrustMark icon={CalendarCheck} tone="open">
              Приймає нових клієнтів
            </TrustMark>
          ) : (
            <TrustMark icon={CalendarCheck}>Запис у лист очікування</TrustMark>
          )}
        </div>

        {/* Формат, мови, місто */}
        <dl className={cn("mt-4 space-y-1.5 text-sm", ink.body)}>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Формат</dt>
            <Monitor className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
            <dd>{FORMAT_LABEL[t.format]}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="sr-only">Мови</dt>
            <Languages className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
            <dd>{t.languages.join(", ")}</dd>
          </div>
          {t.city && (
            <div className="flex items-center gap-2">
              <dt className="sr-only">Місто</dt>
              <MapPin className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
              <dd>{t.city}</dd>
            </div>
          )}
        </dl>

        {/* Теми роботи */}
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Теми роботи">
          {t.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="rounded-full border border-[#142744]/10 bg-[#F8F4EC] px-2.5 py-1 text-xs text-[#4A5568]"
            >
              {topic}
            </li>
          ))}
        </ul>

        {/* Вартість + дія */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <div className={cn("text-[11px] uppercase tracking-[0.14em]", ink.soft)}>Сесія</div>
            <div className={cn("text-lg font-medium", ink.strong)}>
              від {t.priceFrom.toLocaleString("uk-UA")} {t.currency}
              <span className={cn("ml-1 text-sm font-normal", ink.soft)}>
                · {t.sessionMinutes} хв
              </span>
            </div>
          </div>

          <a
            href={`/specialists/${t.id}`}
            className={cn(
              "inline-flex items-center justify-center rounded-lg bg-[#1C3557] px-4 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
              touch,
              focusRing,
            )}
          >
            Відкрити простір
          </a>
        </div>
      </div>
    </article>
  );
}

/* ── Loading state ──────────────────────────────────────────── */

export function TherapistCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]"
      role="status"
      aria-label="Завантаження картки фахівця"
    >
      <div className="vsi-shimmer aspect-[4/3] w-full" />
      <div className="space-y-3 p-5">
        <div className="vsi-shimmer h-6 w-3/5 rounded" />
        <div className="vsi-shimmer h-4 w-4/5 rounded" />
        <div className="vsi-shimmer h-6 w-2/5 rounded-md" />
        <div className="flex gap-1.5 pt-1">
          <div className="vsi-shimmer h-6 w-28 rounded-full" />
          <div className="vsi-shimmer h-6 w-32 rounded-full" />
        </div>
        <div className="space-y-2 pt-1">
          <div className="vsi-shimmer h-4 w-1/2 rounded" />
          <div className="vsi-shimmer h-4 w-2/5 rounded" />
        </div>
        <div className="flex items-end justify-between pt-4">
          <div className="vsi-shimmer h-8 w-24 rounded" />
          <div className="vsi-shimmer h-11 w-40 rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Завантажуємо профіль…</span>

      <style>{`
        .vsi-shimmer {
          background: linear-gradient(
            100deg,
            ${VSI.stone}55 30%,
            ${VSI.white} 50%,
            ${VSI.stone}55 70%
          );
          background-size: 220% 100%;
          animation: vsiShimmer 1.6s ease-in-out infinite;
        }
        @keyframes vsiShimmer {
          from { background-position: 180% 0; }
          to   { background-position: -60% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsi-shimmer {
            animation: none;
            background: ${VSI.stone}66;
          }
        }
      `}</style>
    </div>
  );
}
