import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { SocialSupportForm } from "@/components/preview/vsi/social-support-form";

export const metadata: Metadata = {
  title: "Соціальна підтримка",
  description:
    "Програма соціальної психологічної підтримки VSI: допомога для людей з обмеженими фінансовими можливостями за зниженою вартістю.",
};

/** Мови беремо з довідника — той самий список, що в анкеті фахівця. */
async function loadLanguages() {
  const languages = await prisma.language.findMany({ select: { code: true, nameUk: true } });
  // Той самий порядок, що й в анкеті: найуживаніші вгорі, «Інша» — в кінці.
  const order = ["uk", "ru", "en", "pl", "de", "fr", "es", "it", "cs", "pt", "other"];
  const rank = (code: string) => {
    const i = order.indexOf(code);
    return i === -1 ? order.length : i;
  };
  return languages.sort(
    (a, b) => rank(a.code) - rank(b.code) || a.nameUk.localeCompare(b.nameUk, "uk"),
  );
}

const PARAGRAPHS = [
  "VSI створює програму соціальної психологічної підтримки для людей, які потребують професійної психологічної допомоги, але наразі мають обмежені фінансові можливості.",
  "До програми добровільно долучаються фахівці VSI, які готові працювати з клієнтами в межах соціальної програми за зниженою вартістю.",
  "Людина може подати заявку, описати свій запит, вказати доступний бюджет та зручний час для зустрічей.",
  "Ми розглядаємо заявку протягом 48 годин.",
  "Якщо серед фахівців, які беруть участь у програмі, є спеціаліст, який відповідає запиту, бюджету та доступному часу, ми зв'язуємося із заявником за вказаними контактами.",
];

export default async function SocialSupportPage() {
  const languages = await loadLanguages();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl pt-10 text-center lg:pt-14">
        <p className="inline-flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
          Соціальна підтримка
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
        </p>
        <h1
          className={cn(
            "mt-5 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl",
            ink.strong,
          )}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Соціальна психологічна підтримка
        </h1>
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        {PARAGRAPHS.map((p) => (
          <p key={p} className={cn("mt-4 text-pretty text-[16px] leading-[1.75]", ink.body)}>
            {p}
          </p>
        ))}

        {/*
          Застереження стоїть окремо від основного тексту навмисно: воно
          має бути помічене до подання заявки, а не загубитися в абзацах.
        */}
        <p
          className={cn(
            "mt-6 border-l-2 border-[#B38B49]/50 pl-4 text-[15px] leading-relaxed",
            ink.muted,
          )}
        >
          Подання заявки не гарантує автоматичного підбору фахівця. Можливість участі залежить від
          поточної доступності спеціалістів.
        </p>

        <SocialSupportForm languages={languages} />
      </div>
    </div>
  );
}
