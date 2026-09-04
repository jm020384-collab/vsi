import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { focusRing, ink } from "../theme";

/**
 * Шість входів у теми — коротка назва під колом.
 *
 * Повні назви тем («Я і мій внутрішній світ») живуть на сторінці теми;
 * тут потрібне одне слово, щоб ряд читався як ряд, а не як список.
 * Кожне коло — власний знак із /brand/motifs/themes: золота лінійна
 * графіка на прозорому тлі. Обідок намальований у самому файлі, тож
 * рамку й підкладку в розмітці не робимо — знак лягає прямо на фон.
 */
const ENTRIES = [
  { slug: "inner-life", label: "Внутрішній світ" },
  { slug: "me-and-other", label: "Стосунки" },
  { slug: "identity", label: "Ідентичність" },
  { slug: "in-transition", label: "Зміни" },
  { slug: "my-history", label: "Історія" },
  { slug: "know-myself", label: "Сенс" },
];

export function ThemeCircles() {
  return (
    <section id="themes" className="bg-[#F8F4EC]">
      <Wrap className="py-10 lg:py-12">
        <p
          className={cn(
            "flex items-center justify-center gap-3 text-center text-[11px] font-medium uppercase tracking-[0.22em]",
            ink.soft,
          )}
        >
          <span aria-hidden className="h-px w-8 bg-[#B38B49]/60" />
          Почати можна з того, що важливо саме зараз
          <span aria-hidden className="h-px w-8 bg-[#B38B49]/60" />
        </p>

        <ul className="mt-9 grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-6">
          {ENTRIES.map(({ slug, label }) => (
            <li key={slug}>
              <Link
                href={`/themes/${slug}`}
                className={cn("group flex flex-col items-center gap-3 rounded-xl py-1", focusRing)}
              >
                <Image
                  src={`/brand/motifs/themes/${slug}.png`}
                  alt=""
                  aria-hidden
                  width={512}
                  height={512}
                  sizes="(min-width: 1024px) 112px, 92px"
                  className={cn(
                    "h-[92px] w-[92px] sm:h-[112px] sm:w-[112px]",
                    "transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transition-none",
                  )}
                />
                <span
                  className={cn(
                    "text-center text-[11px] font-medium uppercase leading-tight tracking-[0.14em]",
                    ink.muted,
                    "group-hover:text-[#142744]",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Wrap>
    </section>
  );
}
