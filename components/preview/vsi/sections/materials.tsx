import { ArrowUpRight, Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Eyebrow, SectionTitle, Wrap } from "../ui";
import { MATERIALS, type Material } from "../data";
import { focusRing, ink } from "../theme";

function KindTag({ kind }: { kind: Material["kind"] }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#142744]/15 bg-[#F8F4EC] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
      {kind}
    </span>
  );
}

function Meta({ m }: { m: Material }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1 text-sm", ink.soft)}>
      <span>{m.author}</span>
      <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5" aria-hidden />
        {m.readingMinutes} хв
      </span>
    </div>
  );
}

export function Materials() {
  const [featured, ...rest] = MATERIALS;
  if (!featured) return null;

  return (
    <section id="materials" className="bg-[#FFFDF8]">
      <Wrap className="py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>Матеріали</Eyebrow>
            <SectionTitle className="mt-6">Читати, щоб зрозуміти — до того, як почати</SectionTitle>
          </div>
          <ButtonLink href="#" variant="outline" className="shrink-0">
            Усі матеріали
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Головний матеріал */}
          <a
            href="#"
            className={cn(
              "border-[#142744]/12 group relative flex flex-col justify-end overflow-hidden rounded-2xl border p-7 sm:p-9",
              "min-h-[340px] bg-[#142744] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_-20px_rgba(20,39,68,0.42)]",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              focusRing,
            )}
          >
            {/* Аркова графіка як тло — той самий мотив контейнера */}
            <svg
              aria-hidden
              viewBox="0 0 400 300"
              className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 opacity-[0.42]"
              fill="none"
            >
              <path
                d="M 60 280 L 60 140 A 90 90 0 0 1 240 140 L 240 280"
                stroke="#E9DECE"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
              <circle cx="150" cy="150" r="52" fill="#E9DECE" fillOpacity="0.10" />
              <circle
                cx="150"
                cy="150"
                r="52"
                stroke="#E9DECE"
                strokeOpacity="0.22"
                strokeWidth="1"
              />
              <path
                d="M 78 132 A 106 106 0 0 1 150 44"
                stroke="#B38B49"
                strokeOpacity="0.75"
                strokeWidth="1.25"
                strokeLinecap="round"
              />
              <circle cx="150" cy="44" r="3.5" fill="#B38B49" />
            </svg>

            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-[#F8F4EC]/25 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#E9DECE]">
                {featured.kind}
              </span>
              <h3
                className="mt-5 max-w-md text-3xl font-normal leading-tight text-[#F8F4EC] sm:text-4xl"
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                {featured.title}
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#C9C7D1]">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#AAA8B5]">
                <span>{featured.author}</span>
                <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden />
                  {featured.readingMinutes} хв
                </span>
              </div>
            </div>
          </a>

          {/* Решта */}
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((m) => (
              <li key={m.id}>
                <a
                  href="#"
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-[#142744]/10 bg-[#F8F4EC] p-6",
                    "hover:border-[#142744]/22 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFFDF8] hover:shadow-[0_12px_30px_-16px_rgba(20,39,68,0.3)]",
                    "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                    focusRing,
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <KindTag kind={m.kind} />
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-[#5C6672] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#142744] motion-reduce:transition-none"
                      aria-hidden
                    />
                  </div>

                  <h3
                    className={cn("mt-4 text-2xl font-normal leading-snug", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {m.title}
                  </h3>
                  <p className={cn("mt-2.5 flex-1 text-[15px] leading-relaxed", ink.muted)}>
                    {m.excerpt}
                  </p>
                  <div className="mt-5">
                    <Meta m={m} />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
