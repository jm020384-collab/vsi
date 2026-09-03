import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { AvatarPortrait } from "../decor";
import { THERAPISTS } from "../data";
import { focusRing, ink } from "../theme";

const COUNT = 4;

/**
 * Знайомство з фахівцями: портрет ліворуч, представлення праворуч.
 *
 * Горизонтальна картка навмисно коротка — ім'я, кваліфікація і теми.
 * Ціни, рейтингів і кнопок «забронювати» тут немає: на головній ідеться
 * про знайомство, а не про вибір за прайсом.
 */
export function SpecialistsRow() {
  const items = THERAPISTS.slice(0, COUNT);

  return (
    <section id="therapists" className="bg-[#F8F4EC]">
      <Wrap className="py-4 lg:py-6">
        <div className="rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]/70 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={cn("text-[13px] font-medium uppercase tracking-[0.18em]", ink.strong)}>
              Познайомитися з фахівцями
            </h2>
            <Link
              href="/therapists"
              className={cn(
                "group/all inline-flex items-center gap-1.5 text-[13px] text-[#1C3557]",
                "hover:text-[#142744]",
                focusRing,
              )}
            >
              Усі фахівці
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
          </div>

          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((t, i) => (
              <li key={t.id}>
                <Link
                  href={`/specialists/${t.id}`}
                  className={cn(
                    "group flex h-full gap-3.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-3",
                    "transition-colors duration-300 hover:border-[#142744]/25 motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <AvatarPortrait
                    name={t.name}
                    seed={i}
                    photo={t.photo}
                    arch={t.portraitStyle === "arch"}
                    sizes="96px"
                    className="aspect-[3/4] w-[84px] shrink-0 overflow-hidden rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn("text-[15px] leading-snug", ink.strong)}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {t.name}
                    </p>
                    <p className={cn("mt-1 text-[12px] leading-snug", ink.muted)}>{t.status}</p>
                    {t.topics.length > 0 && (
                      <p className={cn("mt-2 text-[11px] leading-relaxed", ink.soft)}>
                        {t.topics.slice(0, 3).join(" · ")}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
