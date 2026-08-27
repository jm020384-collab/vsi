import { Search, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { THERAPISTS } from "../data";
import { TherapistRow, TherapistRowSkeleton } from "./therapist-row";
import { BottomNav } from "./bottom-nav";

const CHIPS = ["Онлайн", "Юнгіанський аналіз", "Українська", "до 1500 грн", "Є місця"];

/**
 * Екран 2 · Пошук фахівця
 *
 * `state` перемикає демонстрацію: результати, завантаження або
 * порожній результат — щоб усі три стани було видно на showcase.
 */
export function ScreenSearch({ state = "results" }: { state?: "results" | "loading" | "empty" }) {
  return (
    <div className="flex min-h-full flex-col bg-[#F8F4EC]">
      <div className="flex-1 pt-12">
        {/* Заголовок + пошук */}
        <div className="bg-[#F8F4EC]/94 sticky top-0 z-10 border-b border-[#142744]/[0.07] px-5 pb-3 pt-3 backdrop-blur-md">
          <h1
            className="text-[26px] font-normal text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Пошук фахівця
          </h1>

          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#5C6672]"
                aria-hidden
              />
              <input
                type="search"
                defaultValue={state === "empty" ? "гештальт розстановки" : ""}
                placeholder="Тема, метод або ім'я"
                aria-label="Пошук фахівця"
                className={cn(
                  "h-12 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] pl-11 pr-3 text-[15px] text-[#142744]",
                  "placeholder:text-[#7A828C]",
                  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
                )}
              />
            </div>
            <button
              type="button"
              aria-label="Фільтри"
              className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#142744]/15 bg-[#FFFDF8] text-[#142744] transition-colors active:bg-[#F0EBE0] motion-reduce:transition-none"
            >
              <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden />
            </button>
          </div>

          {/* Чіпи фільтрів — горизонтальний скрол */}
          <div className="-mx-5 mt-3 overflow-x-auto px-5 pb-1">
            <div className="flex w-max gap-2">
              {CHIPS.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={i === 0}
                  className={cn(
                    "inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full border px-4 text-[13px]",
                    "transition-colors motion-reduce:transition-none",
                    i === 0
                      ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
                      : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] active:bg-[#F0EBE0]",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Результати */}
        <div className="px-5 pb-8 pt-4" aria-live="polite" aria-busy={state === "loading"}>
          {state === "loading" && (
            <>
              <div className="mb-3 h-4 w-32 rounded bg-[#E9DECE]/70" aria-hidden />
              <div className="space-y-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <TherapistRowSkeleton key={i} />
                ))}
              </div>
            </>
          )}

          {state === "results" && (
            <>
              <p className="mb-3 text-[13px] text-[#5C6672]">
                Знайдено {THERAPISTS.length} фахівців
              </p>
              <div className="space-y-2.5">
                {THERAPISTS.map((t, i) => (
                  <TherapistRow key={t.id} therapist={t} seed={i} />
                ))}
              </div>
            </>
          )}

          {state === "empty" && (
            <div className="border-[#142744]/18 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-5 py-12 text-center">
              {/* Порожня арка — той самий мотив контейнера, але без вмісту */}
              <svg viewBox="0 0 120 110" className="mx-auto h-24 w-24" fill="none" aria-hidden>
                <path
                  d="M 30 96 L 30 54 A 30 30 0 0 1 90 54 L 90 96"
                  stroke="#142744"
                  strokeOpacity="0.22"
                  strokeWidth="1.5"
                  strokeDasharray="4 5"
                />
                <line
                  x1="18"
                  y1="96"
                  x2="102"
                  y2="96"
                  stroke="#142744"
                  strokeOpacity="0.18"
                  strokeWidth="1.5"
                />
                <circle cx="60" cy="62" r="4" fill="#B38B49" fillOpacity="0.75" />
              </svg>

              <h2
                className="mt-4 text-[22px] font-normal leading-snug text-[#142744]"
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                Нічого не знайшли
              </h2>
              <p className="mx-auto mt-2.5 max-w-[280px] text-[14px] leading-relaxed text-[#4A5568]">
                На vsi працюють лише фахівці аналітичної традиції. Спробуйте інший запит — або
                залиште заявку на ручний підбір.
              </p>

              <div className="mt-6 flex flex-col gap-2.5">
                <a
                  href="#"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1C3557] text-[15px] font-medium text-[#FFFDF8] transition-colors active:bg-[#142744] motion-reduce:transition-none"
                >
                  Залишити заявку
                </a>
                <a
                  href="#"
                  className="border-[#142744]/22 inline-flex min-h-[48px] items-center justify-center rounded-xl border text-[15px] font-medium text-[#142744] transition-colors active:bg-[#142744]/[0.05] motion-reduce:transition-none"
                >
                  Скинути фільтри
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav active="search" />
    </div>
  );
}
