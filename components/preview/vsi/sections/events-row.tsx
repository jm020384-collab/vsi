import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { EVENTS, FORMAT_LABEL } from "../data";
import { focusRing, ink } from "../theme";

const COUNT = 3;

const MONTHS = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

/**
 * Дата великим планом ліворуч від назви.
 *
 * У демо-даних дата — вільний рядок («12 вересня, 18:30», «Щосереди,
 * 19:00»), тож розбираємо її м'яко: якщо числа немає (регулярна група),
 * показуємо саму назву періодичності замість числа й місяця.
 */
function splitDate(raw: string): { day?: string; month?: string; fallback?: string } {
  const range = raw.match(/^(\d{1,2})[–-]\d{1,2}\s+([А-Яа-яЇїІіЄєҐґ]+)/);
  if (range?.[1] && range[2]) {
    return { day: range[1], month: range[2].slice(0, 4) };
  }

  const m = raw.match(/(\d{1,2})\s+([А-Яа-яЇїІіЄєҐґ]+)/);
  const word = m?.[2]?.slice(0, 4).toLowerCase();
  if (m?.[1] && word && MONTHS.some((mo) => mo.startsWith(word))) {
    return { day: m[1], month: m[2]!.slice(0, 4) };
  }

  return { fallback: raw.split(",")[0] };
}

export function EventsRow() {
  const items = EVENTS.slice(0, COUNT);

  return (
    <section id="events" className="bg-[#F8F4EC]">
      <Wrap className="py-10 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={cn("text-[13px] font-medium uppercase tracking-[0.18em]", ink.strong)}>
            Найближче в аналітичному середовищі
          </h2>
          <Link
            href="/events"
            className={cn(
              "group/all inline-flex items-center gap-1.5 text-[13px] text-[#1C3557]",
              "hover:text-[#142744]",
              focusRing,
            )}
          >
            Усі події
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 lg:grid-cols-3">
          {items.map((e) => {
            const { day, month, fallback } = splitDate(e.date);
            return (
              <li key={e.id}>
                <Link
                  href="/events"
                  className={cn(
                    "group flex h-full items-start gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-4",
                    "transition-colors duration-300 hover:border-[#142744]/25 motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <span className="shrink-0 text-center">
                    {day ? (
                      <>
                        <span
                          className={cn("block text-[26px] leading-none", ink.strong)}
                          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                        >
                          {day}
                        </span>
                        <span
                          className={cn(
                            "mt-1 block text-[10px] uppercase tracking-[0.12em]",
                            ink.soft,
                          )}
                        >
                          {month}
                        </span>
                      </>
                    ) : (
                      <span
                        className={cn(
                          "block max-w-[64px] text-[11px] uppercase leading-tight tracking-[0.1em]",
                          ink.soft,
                        )}
                      >
                        {fallback}
                      </span>
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={cn("block text-[15px] leading-snug", ink.strong)}>
                      {e.title}
                    </span>
                    <span className={cn("mt-1.5 block text-[12px]", ink.soft)}>
                      {e.type} · {FORMAT_LABEL[e.format].toLowerCase()} · {e.lead}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}
