import { Hero } from "@/components/preview/vsi/sections/hero";
import { Themes } from "@/components/preview/vsi/sections/themes";
import { Approach } from "@/components/preview/vsi/sections/approach";
import { Therapists } from "@/components/preview/vsi/sections/therapists";
import { HowToChoose } from "@/components/preview/vsi/sections/how-to-choose";
import { QuoteBand } from "@/components/preview/vsi/sections/quote-band";
import { Materials } from "@/components/preview/vsi/sections/materials";
import { Events } from "@/components/preview/vsi/sections/events";
import { Ethics } from "@/components/preview/vsi/sections/ethics";
import { FinalCta } from "@/components/preview/vsi/sections/cta";
import { PaperTexture } from "@/components/preview/vsi/decor";

/**
 * Головна сторінка «vsi».
 *
 * Складається з секцій дизайн-системи vsi (components/preview/vsi).
 * Хедер і футер дає глобальний layout (SiteHeader / SiteFooter),
 * тому власні Header/Footer прототипу тут не підключаються.
 * Демо-дані секцій згодом заміняться на дані з Prisma.
 */
export default function HomePage() {
  return (
    <div className="relative">
      {/* Зерно теплого паперу поверх сторінки */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <PaperTexture className="!fixed" />
      </div>

      <div className="relative z-[2]">
        <Hero />
        <Themes />
        <Approach />
        <Therapists />
        <HowToChoose />
        <QuoteBand />
        <Materials />
        <Events />
        <Ethics />
        <FinalCta />
      </div>
    </div>
  );
}
