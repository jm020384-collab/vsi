"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  LIBRARY_CATEGORIES,
  type LibraryCategory,
  type Material,
} from "@/components/preview/vsi/data";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

/**
 * Бібліотека — редакційна професійна добірка.
 *
 * Категорії — не рубрикатор симптомів, а поняття, з якими працює
 * аналітична традиція. Головний матеріал — великим планом.
 * `materials` приходить із сервера: демо-контент + реальні
 * опубліковані статті фахівців, змерджені в один список.
 */
export function LibraryClient({ materials }: { materials: Material[] }) {
  const [category, setCategory] = useState<LibraryCategory | null>(null);

  const items = useMemo(
    () => (category ? materials.filter((m) => m.categories.includes(category)) : materials),
    [category, materials],
  );

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl pt-10 text-center lg:pt-14">
        <Image
          src="/brand/motifs/library.png"
          alt=""
          aria-hidden
          width={112}
          height={112}
          priority
          className="mx-auto h-24 w-24 rounded-2xl border border-[#142744]/10 object-cover sm:h-28 sm:w-28"
        />
        <p className="mt-6 inline-flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
          Бібліотека
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
        </p>
        <h1
          className={`mt-5 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Тексти, лекції та дослідження
        </h1>
        <p className={`mx-auto mt-5 max-w-lg text-pretty text-[16px] leading-relaxed ${ink.muted}`}>
          Фахівці VSI пишуть і читають лекції не для реклами, а тому що думання — частина професії.
          Читайте, слухайте, рухайтесь за посиланнями далі.
        </p>
      </div>

      {/* ── Категорії ── */}
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Категорії бібліотеки">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={cn(
            "inline-flex items-center rounded-full border px-4 text-sm transition-all duration-200 motion-reduce:transition-none",
            touch,
            focusRing,
            category === null
              ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
              : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] hover:border-[#142744]/35",
          )}
        >
          Усі
        </button>
        {LIBRARY_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory((cur) => (cur === c ? null : c))}
            aria-pressed={category === c}
            className={cn(
              "inline-flex items-center rounded-full border px-4 text-sm transition-all duration-200 motion-reduce:transition-none",
              touch,
              focusRing,
              category === c
                ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
                : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] hover:border-[#142744]/35",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Матеріали ── */}
      <div className="mt-8" aria-live="polite">
        {items.length === 0 ? (
          <div className="border-[#142744]/18 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-14 text-center">
            <p className={`mx-auto max-w-md text-[15px] leading-relaxed ${ink.muted}`}>
              У цій категорії поки немає матеріалів — вони готуються.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/library/${m.id}`}
                  className={cn(
                    "group flex h-full flex-col overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]",
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
                    <h2
                      className={`mt-3 text-xl font-normal leading-snug ${ink.strong}`}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {m.title}
                    </h2>
                    <p
                      className={`mt-2 line-clamp-3 flex-1 text-[14px] leading-relaxed ${ink.muted}`}
                    >
                      {m.excerpt}
                    </p>
                    <p className={`mt-4 flex items-center gap-2 text-[13px] ${ink.soft}`}>
                      {m.author}
                      <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                      <Clock3 className="h-3.5 w-3.5" aria-hidden />
                      {m.readingMinutes} хв
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
