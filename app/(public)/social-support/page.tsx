import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Clock, FileText, Info, Leaf, Sparkle, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export const metadata: Metadata = {
  title: "Соціальна підтримка",
  description:
    "Програма соціальної психологічної підтримки VSI: допомога для людей з обмеженими фінансовими можливостями за зниженою вартістю.",
};

const PILLARS = [
  {
    icon: Users,
    title: "Професійна підтримка",
    text: "Від фахівців VSI, які добровільно долучаються до програми.",
  },
  {
    icon: Leaf,
    title: "Доступні умови",
    text: "Робота в межах соціальної програми за зниженою вартістю.",
  },
  {
    icon: FileText,
    title: "Проста заявка",
    text: "Опишіть свій запит, вкажіть бюджет та зручний час для зустрічей.",
  },
  {
    icon: Clock,
    title: "Розгляд — до 48 годин",
    text: "Ми розглянемо вашу заявку та зв'яжемося з вами, якщо знайдемо відповідного фахівця.",
  },
];

const STEPS = [
  "Ви подаєте заявку через форму на сайті.",
  "Ми розглядаємо її протягом 48 годин.",
  "Якщо є відповідний фахівець, ми зв'язуємося з вами для подальших кроків.",
];

export default function SocialSupportPage() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-24 sm:px-8 lg:px-10">
      {/* ── Знайомство з програмою ── */}
      <section className="grid items-center gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-12 lg:pt-14">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#876428]">
            Програма VSI
          </p>
          <h1
            className={cn(
              "mt-5 text-balance text-[2.6rem] font-normal leading-[1.1] sm:text-5xl",
              ink.strong,
            )}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Соціальна психологічна підтримка
          </h1>
          <p className={cn("mt-6 max-w-md text-pretty text-[17px] leading-[1.7]", ink.body)}>
            Програма для людей, які потребують професійної психологічної допомоги, але наразі мають
            обмежені фінансові можливості.
          </p>
          <span aria-hidden className="mt-8 block h-px w-28 bg-[#B38B49]/60" />
        </div>

        {/*
          Ілюстрація без рамки: її власне тло — той самий кремовий, що й у
          сторінки, тож вона зливається з полотном. Рамка лише намалювала б
          зайвий прямокутник навколо того, що й так ціле.
        */}
        <div className="relative mx-auto w-full max-w-[440px]">
          <Image
            src="/brand/motifs/social-support.png"
            alt="Одна людина сидить, інша простягає їй руку; довкола — арка, гори й вода в теплому вранішньому світлі"
            width={1672}
            height={941}
            priority
            sizes="(min-width: 1024px) 440px, 90vw"
            className="h-auto w-full"
          />
        </div>
      </section>

      {/*
        Чотири опори з тонкими розділювачами — як у макеті. Лінії малюємо
        через border-left у колонок, а не окремими елементами: інакше при
        переносі на вузькому екрані вони висіли б у порожнечі.
      */}
      <ul className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-y-0">
        {PILLARS.map(({ icon: Icon, title, text }, i) => (
          <li
            key={title}
            className={cn(
              // Розділювач — ліва межа сусіда, а не окрема лінія: при
              // переносі колонок окрема лінія висіла б у порожнечі.
              "lg:px-6",
              i % 2 === 1 && "sm:border-l sm:border-[#B38B49]/25 sm:pl-7",
              i > 0 && "lg:border-l lg:border-[#B38B49]/25",
              i === 0 && "lg:pl-0",
            )}
          >
            <span
              aria-hidden
              className="grid h-12 w-12 place-items-center rounded-full border border-[#B38B49]/40"
            >
              <Icon className="h-5 w-5 text-[#B38B49]" strokeWidth={1.2} />
            </span>
            <h2
              className={cn("mt-4 text-[21px] font-normal leading-snug", ink.strong)}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              {title}
            </h2>
            <p className={cn("mt-3 text-[14px] leading-relaxed", ink.muted)}>{text}</p>
          </li>
        ))}
      </ul>

      {/* ── Заклик ── */}
      <div className="mt-14 flex justify-center">
        <Link
          href="/social-support/apply"
          className={cn(
            "group inline-flex min-h-[62px] items-center gap-3 rounded-full bg-[#142744] px-12 text-[17px] font-medium text-[#F8F4EC]",
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
      <div className="mt-10 flex items-start gap-4 rounded-2xl bg-[#B38B49]/[0.07] px-7 py-6">
        <span
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#B38B49]/45"
        >
          <Info className="h-4 w-4 text-[#876428]" strokeWidth={1.4} />
        </span>
        <p className={cn("text-[15px] leading-relaxed", ink.muted)}>
          Подання заявки не гарантує автоматичного підбору фахівця. Можливість участі в програмі
          залежить від поточної доступності спеціалістів.
        </p>
      </div>

      {/* ── Для фахівців · Як це працює ── */}
      <section className="relative mt-20">
        <svg
          aria-hidden
          viewBox="0 0 260 260"
          className="pointer-events-none absolute -left-20 -top-12 hidden h-64 w-64 lg:block"
          fill="none"
        >
          <path
            d="M 10 250 A 124 124 0 0 1 250 206"
            stroke="#B38B49"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </svg>

        <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-4">
              <Users className="h-7 w-7 shrink-0 text-[#B38B49]" strokeWidth={1.2} aria-hidden />
              <h2
                className={cn("text-[30px] font-normal leading-snug", ink.strong)}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                Для фахівців
              </h2>
            </div>
            <p className={cn("mt-5 max-w-md text-[15px] leading-relaxed", ink.muted)}>
              Якщо ви хочете долучитися до програми соціальної підтримки VSI та працювати з
              клієнтами за зниженою вартістю, ви можете активувати відповідну опцію у своєму
              професійному кабінеті.
            </p>
            <Link
              href="/dashboard/contact"
              className={cn(
                "mt-8 inline-flex min-h-[54px] items-center gap-2.5 rounded-full border border-[#B38B49]/55 px-8 text-[15px] font-medium text-[#142744]",
                "transition-colors hover:border-[#B38B49] hover:bg-[#B38B49]/[0.07] motion-reduce:transition-none",
                focusRing,
              )}
            >
              <User className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Перейти до кабінету
            </Link>
          </div>

          <div className="lg:border-l lg:border-[#B38B49]/25 lg:pl-16">
            <div className="flex items-center gap-4">
              <Sparkle className="h-6 w-6 shrink-0 text-[#B38B49]" strokeWidth={1.2} aria-hidden />
              <h2
                className={cn("text-[30px] font-normal leading-snug", ink.strong)}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                Як це працює
              </h2>
            </div>

            <ol className="mt-6 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#B38B49]/45 text-[15px] text-[#876428]"
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {i + 1}
                  </span>
                  <p className={cn("pt-1.5 text-[15px] leading-relaxed", ink.muted)}>{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
