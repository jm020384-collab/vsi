import Image from "next/image";
import Link from "next/link";
import { Compass, Heart, Leaf, RefreshCw, Sparkles, User } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { focusRing, ink } from "../theme";

/**
 * Шість входів у теми — коротка назва під колом.
 *
 * Повні назви тем («Я і мій внутрішній світ») живуть на сторінці теми;
 * тут потрібне одне слово, щоб ряд читався як ряд, а не як список.
 * Кожен запис може мати власну картинку у /brand/motifs/themes —
 * якщо файлу немає, показуємо лінійну іконку того ж настрою.
 */
const ENTRIES: {
  slug: string;
  label: string;
  icon: React.ElementType;
  image?: string;
}[] = [
  { slug: "inner-life", label: "Внутрішній світ", icon: User },
  { slug: "me-and-other", label: "Стосунки", icon: Heart },
  { slug: "identity", label: "Ідентичність", icon: Compass },
  { slug: "in-transition", label: "Зміни", icon: RefreshCw },
  { slug: "my-history", label: "Історія", icon: Leaf },
  { slug: "know-myself", label: "Сенс", icon: Sparkles },
];

export function ThemeCircles() {
  return (
    <section id="themes" className="bg-[#F8F4EC]">
      <Wrap className="py-14 lg:py-20">
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
          {ENTRIES.map(({ slug, label, icon: Icon, image }) => (
            <li key={slug}>
              <Link
                href={`/themes/${slug}`}
                className={cn("group flex flex-col items-center gap-3 rounded-xl py-1", focusRing)}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid h-[86px] w-[86px] place-items-center rounded-full border border-[#B38B49]/45 bg-[#FFFDF8]/60",
                    "transition-colors duration-300 group-hover:border-[#B38B49] motion-reduce:transition-none",
                  )}
                >
                  {image ? (
                    <Image src={image} alt="" width={48} height={48} className="h-11 w-11" />
                  ) : (
                    <Icon className="h-8 w-8 text-[#B38B49]" strokeWidth={1.1} />
                  )}
                </span>
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
