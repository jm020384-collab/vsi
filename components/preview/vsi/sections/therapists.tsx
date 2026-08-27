"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, SearchX, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { TherapistCard, TherapistCardSkeleton } from "../therapist-card";
import { THERAPISTS, type Format } from "../data";
import { focusRing, ink, touch } from "../theme";

type FormatFilter = "all" | Format;

const FORMAT_FILTERS: { value: FormatFilter; label: string }[] = [
  { value: "all", label: "Будь-який формат" },
  { value: "online", label: "Онлайн" },
  { value: "offline", label: "Очно" },
];

const APPROACHES = [
  "Юнгіанський аналіз",
  "Психоаналітична терапія",
  "Глибинна психологія",
  "Психодинамічна терапія",
  "Об'єктні стосунки",
];

export function Therapists() {
  const [format, setFormat] = useState<FormatFilter>("all");
  const [approach, setApproach] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Імітація мережевого запиту при зміні фільтрів — щоб було видно loading state
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, [format, approach]);

  const results = useMemo(
    () =>
      THERAPISTS.filter((t) => {
        const okFormat = format === "all" || t.format === format || t.format === "both";
        const okApproach = !approach || t.approach === approach;
        return okFormat && okApproach;
      }),
    [format, approach],
  );

  const chip = (active: boolean) =>
    cn(
      "inline-flex items-center rounded-full border px-4 text-sm transition-all duration-200 motion-reduce:transition-none",
      touch,
      focusRing,
      active
        ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
        : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] hover:border-[#142744]/35 hover:bg-[#142744]/[0.03]",
    );

  return (
    <section id="therapists" className="bg-[#F8F4EC]">
      <Wrap className="py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>Перевірені фахівці</Eyebrow>
            <SectionTitle className="mt-6">Кожен профіль проходить ручну перевірку</SectionTitle>
            <Lead className="mt-6">
              Ми звіряємо освіту, години особистого аналізу та супервізії, членство у професійних
              спільнотах. Без зіркових рейтингів — лише факти, які можна підтвердити документально.
            </Lead>
          </div>

          <ButtonLink href="/therapists" variant="outline" className="shrink-0">
            Усі фахівці
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>

        {/* ── Фільтри ── */}
        <div className="mt-12 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]/70 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex items-center gap-2 text-sm font-medium text-[#142744]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
            Фільтри
          </div>

          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Формат роботи">
            {FORMAT_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFormat(f.value)}
                aria-pressed={format === f.value}
                className={chip(format === f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap gap-2" role="group" aria-label="Напрям роботи">
            {APPROACHES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setApproach((cur) => (cur === a ? null : a))}
                aria-pressed={approach === a}
                className={chip(approach === a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* ── Результати ── */}
        <div className="mt-6" aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <TherapistCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <p className={cn("mb-5 text-sm", ink.soft)}>
                Знайдено {results.length} з {THERAPISTS.length} фахівців
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((t, i) => (
                  <TherapistCard key={t.id} therapist={t} seed={i} />
                ))}
              </div>
            </>
          ) : (
            /* ── Empty state ── */
            <div className="border-[#142744]/18 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-16 text-center">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#142744]/[0.05]"
                aria-hidden
              >
                <SearchX className="h-6 w-6 text-[#5C6672]" />
              </div>
              <h3
                className={cn("mt-5 text-2xl font-normal", ink.strong)}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                За цими фільтрами нікого не знайшли
              </h3>
              <p className={cn("mx-auto mt-3 max-w-md text-[15px] leading-relaxed", ink.muted)}>
                Спробуйте прибрати один із фільтрів. Або залиште заявку — ми підберемо фахівця
                вручну й повернемось протягом двох робочих днів.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormat("all");
                    setApproach(null);
                  }}
                  className={cn(
                    "inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
                    "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
                    touch,
                    focusRing,
                  )}
                >
                  Скинути фільтри
                </button>
                <ButtonLink href="#cta" variant="outline">
                  Залишити заявку
                </ButtonLink>
              </div>
            </div>
          )}
        </div>
      </Wrap>
    </section>
  );
}
