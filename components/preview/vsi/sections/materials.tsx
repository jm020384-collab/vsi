import Image from "next/image";
import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Eyebrow, SectionTitle, Wrap } from "../ui";
import { MATERIALS } from "../data";
import { focusRing, ink } from "../theme";

const FEATURED_COUNT = 3;

/** Тизер бібліотеки — та сама картка, що на /library, лише коротший ряд. */
export function Materials() {
  const items = MATERIALS.slice(0, FEATURED_COUNT);
  if (items.length === 0) return null;

  return (
    <section id="materials" className="bg-[#FFFDF8]">
      <Wrap className="py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>З бібліотеки</Eyebrow>
            <SectionTitle className="mt-6">Читати, щоб зрозуміти — до того, як почати</SectionTitle>
          </div>
          <ButtonLink href="/library" variant="outline" className="shrink-0">
            Усі матеріали
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <li key={m.id}>
              <a
                href={`/library/${m.id}`}
                className={cn(
                  "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#F8F4EC]",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-[#142744]/20 hover:shadow-[0_18px_40px_-18px_rgba(20,39,68,0.28)]",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  focusRing,
                )}
              >
                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-[#F0EAD9]">
                  {m.imageUrl ? (
                    <Image
                      src={m.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[#B9AE95]">
                      <BookOpen className="h-8 w-8" aria-hidden />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <span className="inline-flex w-fit items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                    {m.kind}
                  </span>
                  <h3
                    className={cn("mt-3 text-xl font-normal leading-snug", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed",
                      ink.muted,
                    )}
                  >
                    {m.excerpt}
                  </p>
                  <p className={cn("mt-4 flex items-center gap-2 text-[13px]", ink.soft)}>
                    {m.author}
                    <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                    <Clock3 className="h-3.5 w-3.5" aria-hidden />
                    {m.readingMinutes} хв
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
