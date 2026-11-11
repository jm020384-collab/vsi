import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { focusRing, ink } from "@/components/preview/vsi/theme";
import { SocialSupportForm } from "@/components/preview/vsi/social-support-form";

export const metadata: Metadata = {
  title: "Заявка на соціальну підтримку",
  description:
    "Подати заявку на участь у програмі соціальної психологічної підтримки VSI: запит, доступний бюджет і зручний час.",
};

/** Мови беремо з довідника — той самий список, що в анкеті фахівця. */
async function loadLanguages() {
  const languages = await prisma.language.findMany({ select: { code: true, nameUk: true } });
  const order = ["uk", "ru", "en", "pl", "de", "fr", "es", "it", "cs", "pt", "other"];
  const rank = (code: string) => {
    const i = order.indexOf(code);
    return i === -1 ? order.length : i;
  };
  return languages.sort(
    (a, b) => rank(a.code) - rank(b.code) || a.nameUk.localeCompare(b.nameUk, "uk"),
  );
}

export default async function SocialSupportApplyPage() {
  const languages = await loadLanguages();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 pt-10 sm:px-8 lg:px-10 lg:pt-14">
      <div className="mx-auto max-w-xl">
        <Link
          href="/social-support"
          className={cn(
            "inline-flex items-center gap-1.5 text-[13px] text-[#1C3557] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          До програми
        </Link>

        <h1
          className={cn(
            "mt-5 text-balance text-3xl font-normal leading-tight sm:text-4xl",
            ink.strong,
          )}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Заявка на підтримку
        </h1>
        <p className={cn("mt-4 text-pretty text-[16px] leading-[1.75]", ink.body)}>
          Опишіть свій запит, вкажіть доступний бюджет і зручний час. Ми розглянемо заявку протягом
          48 годин і зв&apos;яжемося з вами, якщо серед фахівців програми буде той, хто відповідає
          вашому запиту та доступності.
        </p>

        <SocialSupportForm languages={languages} />
      </div>
    </div>
  );
}
