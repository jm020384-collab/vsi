import { CalendarDays, Clock3, Monitor, MapPin, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { EVENTS, FORMAT_LABEL, MATERIALS } from "../data";
import { VSI } from "../theme";
import { BottomNav } from "./bottom-nav";

/**
 * Мініатюра групи: синій тайл із золотою лінійною діаграмою —
 * мотив бренд-борду. Три варіанти: орбіта, наповнення, розетка.
 */
function GroupThumb({ index }: { index: number }) {
  const v = index % 3;
  return (
    <svg viewBox="0 0 64 64" className="h-[52px] w-[52px] shrink-0 rounded-xl" aria-hidden>
      <rect width="64" height="64" rx="12" fill="#142744" />
      {v === 0 && (
        <g fill="none">
          <ellipse
            cx="32"
            cy="32"
            rx="22"
            ry="9"
            transform="rotate(-24 32 32)"
            stroke={VSI.gold}
            strokeOpacity="0.75"
            strokeWidth="1.25"
          />
          <circle cx="32" cy="32" r="7" fill="#E9DECE" fillOpacity="0.25" />
          <circle cx="48" cy="22" r="3.5" fill={VSI.gold} />
        </g>
      )}
      {v === 1 && (
        <g fill="none">
          <circle
            cx="32"
            cy="32"
            r="17"
            stroke="#E9DECE"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="1 4"
          />
          <circle cx="32" cy="32" r="10" stroke={VSI.gold} strokeOpacity="0.8" strokeWidth="1.25" />
          <path d="M 32 22 A 10 10 0 0 1 32 42 Z" fill={VSI.gold} fillOpacity="0.7" />
        </g>
      )}
      {v === 2 && (
        <g stroke={VSI.gold} fill="none" strokeWidth="1">
          <circle cx="32" cy="32" r="9" strokeOpacity="0.8" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            return (
              <line
                key={i}
                x1={32 + 13 * Math.cos(a)}
                y1={32 + 13 * Math.sin(a)}
                x2={32 + (i % 2 === 0 ? 20 : 16) * Math.cos(a)}
                y2={32 + (i % 2 === 0 ? 20 : 16) * Math.sin(a)}
                strokeOpacity={i % 2 === 0 ? 0.7 : 0.4}
              />
            );
          })}
          <circle cx="32" cy="32" r="2.5" fill={VSI.gold} stroke="none" />
        </g>
      )}
    </svg>
  );
}

/** Екран 3 · Групи та матеріали */
export function ScreenGroups() {
  return (
    <div className="flex min-h-full flex-col bg-[#F8F4EC]">
      <div className="flex-1 pt-12">
        <div className="bg-[#F8F4EC]/94 sticky top-0 z-10 border-b border-[#142744]/[0.07] px-5 pb-0 pt-3 backdrop-blur-md">
          <h1
            className="text-[26px] font-normal text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Спільнота
          </h1>

          {/* Таби */}
          <div role="tablist" aria-label="Розділи спільноти" className="mt-3 flex gap-1">
            {[
              { label: "Групи та події", active: true },
              { label: "Матеріали", active: false },
            ].map((t) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={t.active}
                className={cn(
                  "relative min-h-[44px] px-3 text-[15px] transition-colors motion-reduce:transition-none",
                  t.active ? "font-medium text-[#142744]" : "text-[#5C6672]",
                )}
              >
                {t.label}
                {t.active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#B38B49]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Групи */}
        <div className="px-5 pt-4">
          <ul className="space-y-3">
            {EVENTS.map((e, idx) => {
              const full = e.seatsLeft === 0;
              const pct = Math.round(((e.seatsTotal - e.seatsLeft) / e.seatsTotal) * 100);

              return (
                <li key={e.id} className="rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-4">
                  <div className="flex items-center gap-3">
                    <GroupThumb index={idx} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                          {e.type}
                        </span>
                        <span
                          className={cn(
                            "text-[12px] font-medium",
                            full ? "text-[#8A4B33]" : "text-[#245A41]",
                          )}
                        >
                          {full ? "Місць немає" : `Вільно ${e.seatsLeft} з ${e.seatsTotal}`}
                        </span>
                      </div>
                      <h2
                        className="text-[19px] font-normal leading-snug text-[#142744]"
                        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                      >
                        {e.title}
                      </h2>
                    </div>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[#4A5568]">{e.description}</p>

                  <dl className="mt-3 space-y-1.5 text-[13px] text-[#4A5568]">
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Дата</dt>
                      <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#5C6672]" aria-hidden />
                      <dd>{e.date}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Формат</dt>
                      {e.format === "offline" ? (
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5C6672]" aria-hidden />
                      ) : (
                        <Monitor className="h-3.5 w-3.5 shrink-0 text-[#5C6672]" aria-hidden />
                      )}
                      <dd>{FORMAT_LABEL[e.format]}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <dt className="sr-only">Ведучий</dt>
                      <Users className="h-3.5 w-3.5 shrink-0 text-[#5C6672]" aria-hidden />
                      <dd>{e.lead}</dd>
                    </div>
                  </dl>

                  <div
                    className="mt-3.5 h-1 w-full overflow-hidden rounded-full bg-[#142744]/[0.09]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Заповненість: ${pct}%`}
                  >
                    <div
                      className={cn("h-full rounded-full", full ? "bg-[#B8785E]" : "bg-[#B38B49]")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <a
                    href="#"
                    className={cn(
                      "mt-3.5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl text-[14px] font-medium",
                      "transition-colors motion-reduce:transition-none",
                      full
                        ? "border-[#142744]/22 border text-[#142744] active:bg-[#142744]/[0.05]"
                        : "bg-[#1C3557] text-[#FFFDF8] active:bg-[#142744]",
                    )}
                  >
                    {full ? "У лист очікування" : "Долучитися"}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Матеріали — прев'ю другого табу */}
        <div className="px-5 pb-8 pt-8">
          <h2
            className="text-[20px] font-normal text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Свіжі матеріали
          </h2>

          <ul className="mt-3 space-y-2.5">
            {MATERIALS.slice(0, 3).map((m) => (
              <li key={m.id}>
                <a
                  href="#"
                  className="flex items-start gap-3 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5 transition-colors active:bg-[#F0EBE0] motion-reduce:transition-none"
                >
                  {/* Мініатюра — аркова графіка замість фото */}
                  <svg viewBox="0 0 60 60" className="h-14 w-14 shrink-0 rounded-lg" aria-hidden>
                    <rect width="60" height="60" rx="8" fill="#142744" />
                    <path
                      d="M 16 48 L 16 30 A 14 14 0 0 1 44 30 L 44 48"
                      stroke="#E9DECE"
                      strokeOpacity="0.32"
                      strokeWidth="1"
                      fill="none"
                    />
                    <circle cx="30" cy="33" r="9" fill="#E9DECE" fillOpacity="0.22" />
                    <circle cx="38" cy="20" r="2.2" fill="#B38B49" />
                  </svg>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                      {m.kind}
                    </span>
                    <h3
                      className="mt-1 text-[15px] font-medium leading-snug text-[#142744]"
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {m.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-[#5C6672]">
                      <Clock3 className="h-3 w-3" aria-hidden />
                      {m.readingMinutes} хв
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomNav active="community" />
    </div>
  );
}
