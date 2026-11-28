import Link from "@/components/i18n/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { FORMAT_LABEL, type PublicEvent } from "../data";
import { focusRing, ink } from "../theme";
import { getI18n } from "@/lib/i18n/server";

const COUNT = 3;

/**
 * Найближчі події — справжні, з бази (lib/events.ts).
 *
 * Якщо опублікованих подій немає, рядок не показуємо зовсім: порожній
 * блок із заголовком «Найближче…» і без подій гірший за його відсутність.
 */
export async function EventsRow({ events }: { events: PublicEvent[] }) {
  const { tr } = await getI18n();
  const items = events.slice(0, COUNT);
  if (items.length === 0) return null;

  return (
    <section id="events" className="bg-[#F8F4EC]">
      <Wrap className="py-7 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className={cn("text-[13px] font-medium uppercase tracking-[0.18em]", ink.strong)}>
            {tr("Найближче в аналітичному середовищі")}
          </h2>
          <Link
            href="/events"
            className={cn(
              "group/all inline-flex items-center gap-1.5 text-[13px] text-[#1C3557]",
              "hover:text-[#142744]",
              focusRing,
            )}
          >
            {tr("Усі події")}
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </Link>
        </div>

        <ul className="mt-4 grid gap-4 lg:grid-cols-3">
          {items.map((e) => (
            <li key={e.id}>
              <Link
                href={`/events#${e.slug}`}
                className={cn(
                  "group flex h-full items-start gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-4",
                  "transition-colors duration-300 hover:border-[#142744]/25 motion-reduce:transition-none",
                  focusRing,
                )}
              >
                <span className="shrink-0 text-center">
                  {e.day && e.month ? (
                    <>
                      <span
                        className={cn("block text-[26px] leading-none", ink.strong)}
                        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                      >
                        {e.day}
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[10px] uppercase tracking-[0.12em]",
                          ink.soft,
                        )}
                      >
                        {e.month.slice(0, 4)}
                      </span>
                    </>
                  ) : (
                    <span
                      className={cn(
                        "block max-w-[64px] text-[11px] uppercase leading-tight tracking-[0.1em]",
                        ink.soft,
                      )}
                    >
                      {e.shortWhen}
                    </span>
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[15px] leading-snug", ink.strong)}>
                    {e.title}
                  </span>
                  <span className={cn("mt-1.5 block text-[12px]", ink.soft)}>
                    {tr(e.typeLabel)} · {tr(FORMAT_LABEL[e.format]).toLowerCase()} · {e.lead}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
