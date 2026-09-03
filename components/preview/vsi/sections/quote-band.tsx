import { Wrap } from "../ui";
import { VSI } from "../theme";

/**
 * Стрічка-цитата на глибокому синьому — мотив бренд-борду.
 *
 * Ліворуч і праворуч — делікатне золоте лінійне мереживо.
 * Під цитатою — ряд кіл, що поступово наповнюються золотом:
 * зміна станів, від порожнього до цілого. Жодних місячних фаз —
 * лише геометрія наповнення.
 */

/** Ряд станів: порожнє коло → повне. */
function StateCircles() {
  const steps = [0, 0.2, 0.45, 0.7, 1];
  return (
    <svg viewBox="0 0 300 36" className="h-8 w-[240px] sm:w-[280px]" aria-hidden fill="none">
      {steps.map((fill, i) => {
        const cx = 30 + i * 60;
        return (
          <g key={i}>
            {i > 0 && (
              <line
                x1={cx - 42}
                y1="18"
                x2={cx - 18}
                y2="18"
                stroke={VSI.gold}
                strokeOpacity="0.35"
                strokeWidth="1"
                strokeDasharray="1 5"
              />
            )}
            <circle
              cx={cx}
              cy="18"
              r="11"
              stroke={VSI.goldBright}
              strokeOpacity="0.8"
              strokeWidth="1.25"
              fill={VSI.gold}
              fillOpacity={fill * 0.9}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Кутове мереживо: чверть розетки з тонких променів. */
function CornerRays({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      fill="none"
      className={`h-40 w-40 ${flip ? "-scale-x-100" : ""}`}
    >
      <g stroke={VSI.gold} strokeWidth="1">
        <circle cx="0" cy="100" r="72" strokeOpacity="0.3" />
        <circle cx="0" cy="100" r="110" strokeOpacity="0.18" strokeDasharray="1 6" />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = -Math.PI / 2 + (i * Math.PI) / 8;
          const r1 = 118;
          const r2 = i % 2 === 0 ? 168 : 140;
          return (
            <line
              key={i}
              x1={0 + r1 * Math.cos(a)}
              y1={100 + r1 * Math.sin(a)}
              x2={0 + r2 * Math.cos(a)}
              y2={100 + r2 * Math.sin(a)}
              strokeOpacity={i % 2 === 0 ? 0.4 : 0.22}
            />
          );
        })}
        <circle cx="0" cy="100" r="5" fill={VSI.gold} fillOpacity="0.6" stroke="none" />
      </g>
    </svg>
  );
}

export function QuoteBand() {
  return (
    <section aria-label="Цитата" className="bg-[#F8F4EC]">
      <Wrap className="py-4 lg:py-6">
        <figure className="relative overflow-hidden rounded-3xl bg-[#142744] px-6 py-14 sm:px-12 lg:py-16">
          {/* Кутове золоте мереживо */}
          <div className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 opacity-80">
            <CornerRays />
          </div>
          <div className="pointer-events-none absolute -right-2 top-1/2 -translate-y-1/2 opacity-80">
            <CornerRays flip />
          </div>

          {/* М'яке світло з центру */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(52% 80% at 50% 50%, rgba(233,222,206,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <blockquote
              className="text-balance text-2xl font-normal italic leading-snug text-[#F8F4EC] sm:text-3xl"
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              «Там, де зустрічаються усвідомлення і співчуття, починається свобода вибору.»
            </blockquote>
            <figcaption className="mt-5 text-[13px] uppercase tracking-[0.2em] text-[#AAA8B5]">
              Карл Густав Юнг
            </figcaption>

            <div className="mt-8 flex justify-center">
              <StateCircles />
            </div>
          </div>
        </figure>
      </Wrap>
    </section>
  );
}
