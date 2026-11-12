"use client";

import { useState } from "react";

export interface ChartPoint {
  /** YYYY-MM-DD */
  day: string;
  value: number;
  /** Рядки підказки: спершу значення, потім підпис. */
  details: { value: number; label: string }[];
}

const DAY_FORMAT = new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "short" });
const FULL_FORMAT = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "long",
  weekday: "short",
});

const asDate = (day: string) => new Date(`${day}T12:00:00Z`);

/** Найближча зверху «кругла» межа осі: 1, 2, 5, 10, 20, 50… */
function niceMax(max: number) {
  if (max <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 5, 10].find((m) => m * pow >= max) ?? 10;
  return step * pow;
}

/**
 * Стовпчики за днями. Одна серія — тож без легенди: що саме намальовано,
 * каже заголовок над графіком. Значення кожного дня доступне в підказці
 * (наведенням або клавіатурою) і в таблиці під графіками.
 */
export function VisitsChart({ points, label }: { points: ChartPoint[]; label: string }) {
  const [active, setActive] = useState<number | null>(null);

  const top = niceMax(Math.max(...points.map((p) => p.value), 0));
  const ticks = [top, top / 2, 0];
  // Підписів дат небагато: перший, останній і кілька між ними.
  const every = Math.max(1, Math.ceil(points.length / 6));
  const current = active === null ? null : points[active];

  return (
    <div className="relative">
      <div className="flex gap-3">
        {/* Вісь значень */}
        <div
          className="flex h-44 w-8 shrink-0 flex-col justify-between text-right text-[11px] tabular-nums text-muted-foreground"
          aria-hidden
        >
          {ticks.map((t) => (
            <span key={t} className="-translate-y-1/2 first:translate-y-0 last:translate-y-0">
              {t}
            </span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          {/* Сітка: три волосяні лінії, що не сперечаються з даними */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44" aria-hidden>
            {ticks.map((t, i) => (
              <span
                key={t}
                className="absolute inset-x-0 h-px bg-border"
                style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          <ul
            className="relative flex h-44 items-end"
            aria-label={label}
            onMouseLeave={() => setActive(null)}
          >
            {points.map((p, i) => (
              <li key={p.day} className="flex h-full min-w-0 flex-1 justify-center">
                {/* Ціль наведення — уся колонка, а не лише сам стовпчик */}
                <button
                  type="button"
                  className="group flex h-full w-full items-end justify-center px-px outline-none"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${FULL_FORMAT.format(asDate(p.day))}: ${p.details
                    .map((d) => `${d.value} ${d.label}`)
                    .join(", ")}`}
                >
                  <span
                    className={
                      "w-full max-w-[24px] rounded-t-[4px] transition-colors motion-reduce:transition-none " +
                      (active === i
                        ? "bg-[#B38B49]"
                        : "bg-[#142744] group-focus-visible:bg-[#B38B49]")
                    }
                    style={{
                      height: `${(p.value / top) * 100}%`,
                      // Нуль теж має бути видно як день без візитів, а не як діру.
                      minHeight: p.value > 0 ? 2 : 1,
                      opacity: p.value > 0 ? 1 : 0.25,
                    }}
                  />
                </button>
              </li>
            ))}
          </ul>

          {/* Вісь дат */}
          <div className="mt-2 flex text-[11px] text-muted-foreground" aria-hidden>
            {points.map((p, i) => (
              <span key={p.day} className="min-w-0 flex-1 text-center">
                {i % every === 0 || i === points.length - 1 ? (
                  <span className="inline-block whitespace-nowrap">
                    {DAY_FORMAT.format(asDate(p.day))}
                  </span>
                ) : null}
              </span>
            ))}
          </div>

          {current && active !== null && (
            <div
              role="status"
              className="pointer-events-none absolute top-0 z-10 w-max max-w-[220px] rounded-md border border-border bg-background px-3 py-2 text-xs shadow-md"
              style={{
                left: `${((active + 0.5) / points.length) * 100}%`,
                transform: `translateX(${active > points.length / 2 ? "calc(-100% - 10px)" : "10px"})`,
              }}
            >
              <div className="text-muted-foreground">{FULL_FORMAT.format(asDate(current.day))}</div>
              {current.details.map((d) => (
                <div key={d.label} className="mt-1">
                  <span className="text-sm font-semibold tabular-nums text-foreground">
                    {d.value}
                  </span>{" "}
                  <span className="text-muted-foreground">{d.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
