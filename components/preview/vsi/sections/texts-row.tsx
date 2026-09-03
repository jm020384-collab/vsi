import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { MATERIALS } from "../data";
import { focusRing, ink } from "../theme";

const COUNT = 3;

/** Аналітична думка: обкладинка ліворуч, заголовок і автор праворуч. */
export function TextsRow() {
  const items = MATERIALS.slice(0, COUNT);
  if (items.length === 0) return null;

  return (
    <section id="materials" className="bg-[#F8F4EC]">
      <Wrap className="py-4 lg:py-6">
        <div className="rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]/70 p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              className={cn("text-[15px] font-normal", ink.strong)}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Аналітична думка
            </h2>
            <Link
              href="/library"
              className={cn(
                "group/all inline-flex items-center gap-1.5 text-[13px] text-[#1C3557]",
                "hover:text-[#142744]",
                focusRing,
              )}
            >
              Уся бібліотека
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
          </div>

          <ul className="mt-5 grid gap-4 lg:grid-cols-3">
            {items.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/library/${m.id}`}
                  className={cn(
                    "group flex h-full gap-3.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-3",
                    "transition-colors duration-300 hover:border-[#142744]/25 motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  <span className="relative aspect-[4/3] w-[104px] shrink-0 overflow-hidden rounded-lg bg-[#F0EAD9]">
                    {m.imageUrl ? (
                      <Image
                        src={m.imageUrl}
                        alt=""
                        fill
                        sizes="104px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                      />
                    ) : (
                      <span className="grid h-full place-items-center text-[#B9AE95]">
                        <BookOpen className="h-6 w-6" aria-hidden />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn("block text-[15px] leading-snug", ink.strong)}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {m.title}
                    </span>
                    <span className={cn("mt-1.5 block text-[12px]", ink.muted)}>{m.author}</span>
                    <span className={cn("mt-0.5 block text-[11px]", ink.soft)}>
                      {m.readingMinutes} хв читання
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
