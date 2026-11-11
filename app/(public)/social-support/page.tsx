import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, Info, Leaf, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { ARCH_CLIP_PATH } from "@/components/preview/vsi/decor";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export const metadata: Metadata = {
  title: "Соціальна підтримка",
  description:
    "Програма соціальної психологічної підтримки VSI: допомога для людей з обмеженими фінансовими можливостями за зниженою вартістю.",
};

const PILLARS = [
  {
    icon: Users,
    title: "За участі фахівців VSI",
    text: "До програми добровільно долучаються психологи та психотерапевти платформи, які працюють у межах соціальної програми за зниженою вартістю.",
  },
  {
    icon: Leaf,
    title: "Індивідуальний підхід",
    text: "Ви подаєте заявку, описуєте свій запит, вказуєте доступний бюджет та зручний час для зустрічей.",
  },
  {
    icon: Clock,
    title: "Розгляд заявки — до 48 годин",
    text: "Ми розглядаємо вашу заявку протягом 48 годин і зв'язуємося з вами, якщо є фахівець, який відповідає вашому запиту та доступності.",
  },
];

export default function SocialSupportPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-24 sm:px-8 lg:px-10">
      {/* ── Знайомство з програмою ── */}
      <section className="grid items-center gap-10 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16 lg:pt-16">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#876428]">
            Програма VSI
          </p>
          <h1
            className={cn(
              "mt-5 text-balance text-4xl font-normal leading-[1.08] sm:text-5xl lg:text-[3.4rem]",
              ink.strong,
            )}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Соціальна психологічна підтримка
          </h1>
          <p className={cn("mt-6 max-w-lg text-pretty text-[17px] leading-[1.7]", ink.body)}>
            Програма для людей, які потребують професійної психологічної допомоги, але наразі мають
            обмежені фінансові можливості.
          </p>
          <span aria-hidden className="mt-8 block h-px w-28 bg-[#B38B49]/60" />
        </div>

        {/*
          Арка — той самий мотив, що в портретах фахівців: форма задана
          спільною ARCH_CLIP_PATH, щоб обриси ніде не розходились.
        */}
        <div className="relative mx-auto w-full max-w-[400px]">
          <svg
            aria-hidden
            viewBox="0 0 400 420"
            className="pointer-events-none absolute -left-12 -top-8 h-[calc(100%+4rem)] w-[calc(100%+6rem)] overflow-visible"
            fill="none"
          >
            <path
              d="M 18 404 A 186 206 0 0 1 390 404"
              stroke="#B38B49"
              strokeOpacity="0.45"
              strokeWidth="1"
            />
            <circle cx="18" cy="404" r="5.5" fill="#B38B49" />
          </svg>

          <div className="relative aspect-[4/5] w-full">
            {/*
              Форму задаємо через SVG, а не CSS clip-path: координати арки
              описані в частках бокса (clipPathUnits="objectBoundingBox"),
              і CSS прочитав би їх як пікселі.
            */}
            <svg width="0" height="0" aria-hidden className="absolute">
              <defs>
                <clipPath id="vsi-social-arch" clipPathUnits="objectBoundingBox">
                  <path d={ARCH_CLIP_PATH} />
                </clipPath>
              </defs>
            </svg>
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: "url(#vsi-social-arch)" }}
            >
              <Image
                src="/brand/motifs/hero.png"
                alt="Гори в ранковому серпанку — спокійний краєвид, мотив програми"
                fill
                priority
                sizes="(min-width: 1024px) 400px, 90vw"
                className="object-cover object-[62%_center]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Три опори програми ── */}
      <ul className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8 lg:mt-20 lg:gap-12">
        {PILLARS.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <span
              aria-hidden
              className="grid h-14 w-14 place-items-center rounded-full border border-[#B38B49]/40"
            >
              <Icon className="h-6 w-6 text-[#B38B49]" strokeWidth={1.2} />
            </span>
            <h2
              className={cn("mt-5 text-[22px] font-normal leading-snug", ink.strong)}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              {title}
            </h2>
            <p className={cn("mt-3 text-[15px] leading-relaxed", ink.muted)}>{text}</p>
          </li>
        ))}
      </ul>

      {/* ── Заклик ── */}
      <div className="mt-14 flex justify-center lg:mt-16">
        <Link
          href="/social-support/apply"
          className={cn(
            "group inline-flex min-h-[60px] items-center gap-3 rounded-full bg-[#142744] px-10 text-[17px] font-medium text-[#F8F4EC]",
            "transition-colors hover:bg-[#1C3557] motion-reduce:transition-none",
            focusRing,
          )}
        >
          Подати заявку на підтримку
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </Link>
      </div>

      {/*
        Застереження окремою смугою: воно має бути помічене до подання
        заявки, а не загубитися серед решти тексту.
      */}
      <div className="mt-10 flex items-start gap-3 rounded-2xl bg-[#142744]/[0.04] px-6 py-5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#876428]" strokeWidth={1.4} aria-hidden />
        <p className={cn("text-[15px] leading-relaxed", ink.muted)}>
          Подання заявки не гарантує автоматичного підбору фахівця. Можливість участі в програмі
          залежить від поточної доступності спеціалістів.
        </p>
      </div>

      {/* ── Вхід для фахівців ── */}
      <section className="relative mt-20 lg:mt-24">
        <svg
          aria-hidden
          viewBox="0 0 220 220"
          className="pointer-events-none absolute -left-16 -top-10 hidden h-56 w-56 lg:block"
          fill="none"
        >
          <path
            d="M 8 212 A 104 104 0 0 1 212 212"
            stroke="#B38B49"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </svg>

        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-xl">
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="h-5 w-5 text-[#B38B49]"
              fill="currentColor"
            >
              <path d="M8 0.8c.4 3.6 3.6 6.8 7.2 7.2-3.6.4-6.8 3.6-7.2 7.2-.4-3.6-3.6-6.8-7.2-7.2C4.4 7.6 7.6 4.4 8 .8Z" />
            </svg>
            <h2
              className={cn("mt-4 text-[28px] font-normal leading-snug sm:text-[32px]", ink.strong)}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Для фахівців
            </h2>
            <p className={cn("mt-4 text-[15px] leading-relaxed", ink.muted)}>
              Якщо ви хочете долучитися до програми соціальної підтримки VSI та працювати з
              клієнтами за зниженою вартістю, ви можете активувати відповідну опцію у своєму
              професійному кабінеті.
            </p>
          </div>

          <Link
            href="/dashboard/contact"
            className={cn(
              "inline-flex min-h-[56px] shrink-0 items-center gap-2.5 rounded-full border border-[#B38B49]/55 px-8 text-[16px] font-medium text-[#142744]",
              "transition-colors hover:border-[#B38B49] hover:bg-[#B38B49]/[0.07] motion-reduce:transition-none",
              focusRing,
            )}
          >
            <User className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            Перейти до кабінету
          </Link>
        </div>
      </section>
    </div>
  );
}
