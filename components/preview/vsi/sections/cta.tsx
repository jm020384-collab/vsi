import { ArrowRight } from "lucide-react";

import { ButtonLink, Lead, SectionTitle, Wrap } from "../ui";
import { HairLine } from "../decor";
import { ink } from "../theme";

/**
 * Фінальний CTA.
 *
 * Композиція дзеркалить hero, але згорнуту в одну вісь: арка позаду
 * тексту, сфера як внутрішній центр, одна золота точка. Замикання
 * сторінки тим самим мотивом, з якого вона почалась.
 */
export function FinalCta() {
  return (
    <section id="cta" className="relative overflow-hidden bg-[#F8F4EC]">
      {/* Аркова графіка позаду — велика, тиха, обрізана низом секції */}
      <svg
        aria-hidden
        viewBox="0 0 600 520"
        className="pointer-events-none absolute left-1/2 top-0 h-full w-[min(680px,110%)] -translate-x-1/2"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <radialGradient id="cta-orb" cx="40%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#FFFDF8" />
            <stop offset="52%" stopColor="#E9DECE" />
            <stop offset="100%" stopColor="#C9C2B8" />
          </radialGradient>
        </defs>

        <path
          d="M 110 520 L 110 250 A 190 190 0 0 1 490 250 L 490 520"
          stroke="#142744"
          strokeOpacity="0.14"
          strokeWidth="1"
        />
        <path
          d="M 178 520 L 178 288 A 122 122 0 0 1 422 288 L 422 520"
          stroke="#142744"
          strokeOpacity="0.09"
          strokeWidth="1"
        />
        <circle cx="300" cy="300" r="88" fill="url(#cta-orb)" opacity="0.55" />
        <line
          x1="60"
          y1="352"
          x2="540"
          y2="352"
          stroke="#142744"
          strokeOpacity="0.1"
          strokeWidth="1"
        />
        <path
          d="M 196 262 A 148 148 0 0 1 300 152"
          stroke="#B38B49"
          strokeOpacity="0.55"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="300" cy="152" r="4" fill="#B38B49" />
      </svg>

      <Wrap className="relative py-24 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <SectionTitle className="text-balance">Перший крок — це просто розмова</SectionTitle>
          <Lead className="mx-auto mt-6 max-w-xl">
            Оберіть фахівця самостійно або залиште запит — ми запропонуємо кілька варіантів, які
            підходять під вашу ситуацію, формат і бюджет.
          </Lead>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="#therapists" variant="primary">
              Знайти фахівця
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="#" variant="outline">
              Залишити запит на підбір
            </ButtonLink>
          </div>

          <HairLine className="mx-auto mt-12 max-w-sm" tone="gold" />

          <p className={`mt-6 text-sm ${ink.soft}`}>
            Підбір безкоштовний. Відповідь протягом двох робочих днів.
          </p>
        </div>
      </Wrap>
    </section>
  );
}
