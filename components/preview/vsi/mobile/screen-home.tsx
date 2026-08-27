import { ArrowRight, Bell } from "lucide-react";

import { LogoVsi } from "@/components/brand/vsi/logo-vsi";
import { THERAPISTS } from "../data";
import { VSI } from "../theme";
import { TherapistRow } from "./therapist-row";
import { BottomNav } from "./bottom-nav";

/**
 * Екран 1 · Головна
 *
 * Персоналізований простір користувача — мотив бренд-борду:
 * привітання, синя картка «Ваш простір» із золотим лінійним
 * декором, популярні теми з мініатюрами-пейзажами, рекомендовані
 * фахівці.
 */

/** Мініатюра теми: маленький пейзаж у кольорах бренду. */
function TopicThumb({ variant }: { variant: 0 | 1 | 2 }) {
  return (
    <svg
      viewBox="0 0 120 76"
      className="h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      {variant === 0 && (
        <>
          {/* Тривога: неспокійні пагорби, маленьке світло */}
          <rect width="120" height="76" fill="#D9D5DC" />
          <path d="M 0 52 Q 22 34 44 50 T 90 46 T 120 52 L 120 76 L 0 76 Z" fill="#A3A4B6" />
          <path d="M 0 60 Q 30 46 62 58 T 120 58 L 120 76 L 0 76 Z" fill="#8B8A9C" />
          <circle cx="88" cy="26" r="9" fill="#FBF4E2" opacity="0.9" />
        </>
      )}
      {variant === 1 && (
        <>
          {/* Близькість: дві арки, що перетинаються */}
          <rect width="120" height="76" fill="#EDE4D3" />
          <path
            d="M 24 76 L 24 42 A 20 20 0 0 1 64 42 L 64 76"
            fill="none"
            stroke="#1C3557"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          <path
            d="M 52 76 L 52 46 A 20 20 0 0 1 92 46 L 92 76"
            fill="none"
            stroke="#8F6B2A"
            strokeOpacity="0.65"
            strokeWidth="1.5"
          />
          <circle cx="58" cy="38" r="4" fill={VSI.gold} />
        </>
      )}
      {variant === 2 && (
        <>
          {/* Сенси: горизонт і сходинки світла */}
          <rect width="120" height="76" fill="#E5DECF" />
          <line x1="0" y1="46" x2="120" y2="46" stroke="#B7A98F" strokeWidth="1" />
          <rect x="46" y="58" width="28" height="5" fill="#CFC3AC" />
          <rect x="50" y="52" width="20" height="5" fill="#DDD2BE" />
          <circle cx="60" cy="34" r="10" fill="#FBF4E2" />
          <circle
            cx="60"
            cy="34"
            r="15"
            fill="none"
            stroke={VSI.gold}
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeDasharray="1 4"
          />
        </>
      )}
    </svg>
  );
}

const TOPICS: { title: string; variant: 0 | 1 | 2 }[] = [
  { title: "Тривога та стрес", variant: 0 },
  { title: "Стосунки та близькість", variant: 1 },
  { title: "Самопізнання та сенси", variant: 2 },
];

export function ScreenHome() {
  return (
    <div className="flex min-h-full flex-col bg-[#F8F4EC]">
      <div className="flex-1 pt-12">
        {/* Header: знак + сповіщення */}
        <div className="flex items-center justify-between px-5 py-2">
          <LogoVsi
            className="text-[1.75rem] text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          />
          <button
            type="button"
            aria-label="Сповіщення"
            className="grid h-11 w-11 place-items-center rounded-full text-[#142744] transition-colors active:bg-[#142744]/[0.06] motion-reduce:transition-none"
          >
            <Bell className="h-[20px] w-[20px]" strokeWidth={1.6} aria-hidden />
          </button>
        </div>

        {/* Привітання */}
        <div className="px-5 pt-2">
          <h1
            className="text-[26px] font-normal leading-tight text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Доброго дня, Олено
          </h1>
          <p className="mt-1 text-[14px] text-[#5C6672]">Продовжимо шлях до себе?</p>
        </div>

        {/* Ваш простір — синя картка із золотим мереживом */}
        <div className="px-5 pt-4">
          <div className="relative overflow-hidden rounded-2xl bg-[#142744] p-5">
            {/* Золота орбіта + сфера */}
            <svg
              aria-hidden
              viewBox="0 0 160 160"
              className="pointer-events-none absolute -right-6 -top-6 h-36 w-36"
              fill="none"
            >
              <ellipse
                cx="80"
                cy="80"
                rx="64"
                ry="26"
                transform="rotate(-24 80 80)"
                stroke={VSI.gold}
                strokeOpacity="0.55"
                strokeWidth="1.25"
              />
              <circle
                cx="80"
                cy="80"
                r="42"
                stroke="#E9DECE"
                strokeOpacity="0.2"
                strokeWidth="1"
                strokeDasharray="1 5"
              />
              <circle cx="128" cy="52" r="7" fill={VSI.gold} />
              <circle cx="80" cy="80" r="18" fill="#E9DECE" fillOpacity="0.16" />
            </svg>

            <div className="relative max-w-[210px]">
              <h2
                className="text-[19px] font-normal leading-snug text-[#F8F4EC]"
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                Ваш простір
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#C9C7D1]">
                Нотатки після сесій, збережені матеріали та ваш маршрут у терапії.
              </p>
              <p className="mt-3 text-[12px] text-[#AAA8B5]">Наступна сесія — завтра, 18:00</p>
              <a
                href="#"
                className="mt-3.5 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#F8F4EC] px-4 text-[13px] font-medium text-[#142744] transition-colors active:bg-[#E9DECE] motion-reduce:transition-none"
              >
                Продовжити шлях
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Популярні теми */}
        <div className="mt-7 pl-5">
          <div className="flex items-baseline justify-between pr-5">
            <h2
              className="text-[20px] font-normal text-[#142744]"
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Популярні теми
            </h2>
            <a
              href="#"
              className="inline-flex min-h-[44px] items-center text-[13px] text-[#1C3557]"
            >
              Усі
            </a>
          </div>

          <div className="-mb-2 flex gap-3 overflow-x-auto pb-2 pr-5 pt-1">
            {TOPICS.map((t) => (
              <a
                key={t.title}
                href="#"
                className="w-[124px] shrink-0 overflow-hidden rounded-xl border border-[#142744]/10 bg-[#FFFDF8] transition-colors active:bg-[#F0EBE0] motion-reduce:transition-none"
              >
                <div className="h-[76px]">
                  <TopicThumb variant={t.variant} />
                </div>
                <div className="px-2.5 py-2.5 text-[12px] font-medium leading-snug text-[#142744]">
                  {t.title}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Рекомендовані фахівці */}
        <div className="mt-7 px-5 pb-8">
          <div className="flex items-baseline justify-between">
            <h2
              className="text-[20px] font-normal text-[#142744]"
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Рекомендовані фахівці
            </h2>
            <a
              href="#"
              className="inline-flex min-h-[44px] items-center text-[13px] text-[#1C3557]"
            >
              Усі
            </a>
          </div>

          <div className="mt-2 space-y-2.5">
            {THERAPISTS.slice(0, 3).map((t, i) => (
              <TherapistRow key={t.id} therapist={t} seed={i} />
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}
