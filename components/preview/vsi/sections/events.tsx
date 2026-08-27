import { CalendarDays, MapPin, Monitor, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { EVENTS, FORMAT_LABEL } from "../data";
import { focusRing, ink, touch } from "../theme";

export function Events() {
  return (
    <section id="events" className="bg-[#F8F4EC]">
      <Wrap className="py-20 lg:py-28">
        <div className="max-w-2xl">
          <Eyebrow>Групи та події</Eyebrow>
          <SectionTitle className="mt-6">Робота, яка можлива тільки разом</SectionTitle>
          <Lead className="mt-6">
            Групове поле показує те, що в індивідуальній роботі лишається непоміченим: як ви входите
            в контакт, коли поруч кілька людей.
          </Lead>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {EVENTS.map((e) => {
            const full = e.seatsLeft === 0;
            const taken = e.seatsTotal - e.seatsLeft;
            const pct = Math.round((taken / e.seatsTotal) * 100);

            return (
              <li
                key={e.id}
                className={cn(
                  "group flex flex-col rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-[#142744]/20 hover:shadow-[0_16px_36px_-18px_rgba(20,39,68,0.28)]",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                    {e.type}
                  </span>
                  {full ? (
                    <span className="text-xs font-medium text-[#8A4B33]">Місць немає</span>
                  ) : (
                    <span className="text-xs font-medium text-[#245A41]">
                      Вільно {e.seatsLeft} з {e.seatsTotal}
                    </span>
                  )}
                </div>

                <h3
                  className={cn("mt-4 text-2xl font-normal leading-snug", ink.strong)}
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {e.title}
                </h3>
                <p className={cn("mt-2.5 flex-1 text-[15px] leading-relaxed", ink.muted)}>
                  {e.description}
                </p>

                <dl className={cn("mt-5 space-y-2 text-sm", ink.body)}>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Дата</dt>
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
                    <dd>{e.date}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Формат</dt>
                    {e.format === "offline" ? (
                      <MapPin className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
                    ) : (
                      <Monitor className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
                    )}
                    <dd>{FORMAT_LABEL[e.format]}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="sr-only">Ведучий</dt>
                    <Users className="h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
                    <dd>{e.lead}</dd>
                  </div>
                </dl>

                {/* Заповненість — тонка смуга, золото лише як заливка */}
                <div className="mt-5">
                  <div
                    className="h-1 w-full overflow-hidden rounded-full bg-[#142744]/[0.09]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Заповненість групи: ${pct}%`}
                  >
                    <div
                      className={cn("h-full rounded-full", full ? "bg-[#B8785E]" : "bg-[#B38B49]")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  {full ? (
                    <a
                      href="#"
                      className={cn(
                        "border-[#142744]/22 inline-flex w-full items-center justify-center rounded-xl border px-5 text-sm font-medium text-[#142744]",
                        "transition-colors hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
                        touch,
                        focusRing,
                      )}
                    >
                      У лист очікування
                    </a>
                  ) : (
                    <ButtonLink href="#" className="w-full">
                      Долучитися
                    </ButtonLink>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Wrap>
    </section>
  );
}
