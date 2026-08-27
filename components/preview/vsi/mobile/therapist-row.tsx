import { BadgeCheck, CalendarCheck, ChevronRight, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { AvatarPortrait } from "../decor";
import { FORMAT_LABEL, type Therapist } from "../data";
import { VSI } from "../theme";

function yearsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} рік`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} роки`;
  return `${n} років`;
}

/** Компактний рядок фахівця — щільніший за десктопну картку. */
export function TherapistRow({ therapist: t, seed = 0 }: { therapist: Therapist; seed?: number }) {
  return (
    <a
      href="#"
      className={cn(
        "flex min-h-[44px] gap-3.5 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5",
        "transition-colors duration-200 active:bg-[#F0EBE0] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3557] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EC]",
      )}
    >
      <AvatarPortrait
        name={t.name}
        seed={seed}
        photo={t.photo}
        arch={t.portraitStyle === "arch"}
        sizes="76px"
        className="h-[92px] w-[76px] shrink-0 overflow-hidden rounded-xl"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="text-[17px] font-medium leading-tight text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {t.name}
          </h3>
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#5C6672]" aria-hidden />
        </div>

        <p className="mt-0.5 truncate text-[13px] text-[#5C6672]">{t.approach}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#4A5568]">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#5C6672]" aria-hidden />
            {yearsLabel(t.yearsOfPractice)}
          </span>
          <span className="inline-flex items-center gap-1">
            <BadgeCheck className="h-3.5 w-3.5 text-[#1C3557]" aria-hidden />
            Перевірено
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-[#142744]">
            від {t.priceFrom.toLocaleString("uk-UA")} {t.currency}
          </span>
          <span className="text-[12px] text-[#5C6672]">{FORMAT_LABEL[t.format]}</span>
        </div>

        {t.acceptingNew && (
          <span
            className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ background: "rgba(47,107,79,0.10)", color: "#245A41" }}
          >
            <CalendarCheck className="h-3 w-3" aria-hidden />
            Приймає нових клієнтів
          </span>
        )}
      </div>
    </a>
  );
}

/** Loading state для мобільного списку. */
export function TherapistRowSkeleton() {
  return (
    <div
      className="flex gap-3.5 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5"
      role="status"
      aria-label="Завантаження"
    >
      <div className="vsi-m-shimmer h-[92px] w-[76px] shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2 py-1">
        <div className="vsi-m-shimmer h-4 w-2/3 rounded" />
        <div className="vsi-m-shimmer h-3 w-1/2 rounded" />
        <div className="vsi-m-shimmer h-3 w-3/4 rounded" />
        <div className="vsi-m-shimmer h-5 w-2/5 rounded-full" />
      </div>

      <style>{`
        .vsi-m-shimmer {
          background: linear-gradient(100deg, ${VSI.stone}55 30%, ${VSI.white} 50%, ${VSI.stone}55 70%);
          background-size: 220% 100%;
          animation: vsiMShimmer 1.6s ease-in-out infinite;
        }
        @keyframes vsiMShimmer {
          from { background-position: 180% 0; }
          to   { background-position: -60% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .vsi-m-shimmer { animation: none; background: ${VSI.stone}66; }
        }
      `}</style>
    </div>
  );
}
