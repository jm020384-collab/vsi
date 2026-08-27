import { Header } from "@/components/preview/vsi/sections/header";
import { Hero } from "@/components/preview/vsi/sections/hero";
import { Approach } from "@/components/preview/vsi/sections/approach";
import { Therapists } from "@/components/preview/vsi/sections/therapists";
import { HowToChoose } from "@/components/preview/vsi/sections/how-to-choose";
import { QuoteBand } from "@/components/preview/vsi/sections/quote-band";
import { Materials } from "@/components/preview/vsi/sections/materials";
import { Events } from "@/components/preview/vsi/sections/events";
import { Ethics } from "@/components/preview/vsi/sections/ethics";
import { FinalCta } from "@/components/preview/vsi/sections/cta";
import { Footer } from "@/components/preview/vsi/sections/footer";
import { PaperTexture } from "@/components/preview/vsi/decor";
import { vsiTokens } from "@/components/preview/vsi/theme";

export default function VsiHomePage() {
  return (
    <div
      /**
       * Токени vsi перевизначають глобальну палітру «Червона книга»
       * лише в межах цього піддерева — inline виграє специфічністю,
       * тож shadcn-компоненти всередині звучать у бренді vsi.
       */
      style={vsiTokens}
      className="relative min-h-screen bg-[#F8F4EC] antialiased"
      lang="uk"
    >
      {/*
        Прототип має власні Header і Footer. Глобальні SiteHeader /
        SiteFooter з app/layout.tsx тут зайві — вони дублюють навігацію
        і ламають композицію. Ховаємо лише поки відкрита ця сторінка.
      */}
      <style>{`
        body > header, body > footer { display: none !important; }
      `}</style>

      {/* Зерно теплого паперу поверх усієї сторінки */}
      <div className="pointer-events-none fixed inset-0 z-[1]">
        <PaperTexture />
      </div>

      <div
        className="relative z-[2]"
        style={{ fontFamily: "var(--vsi-sans), system-ui, sans-serif" }}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[#1C3557] focus:px-4 focus:py-3 focus:text-sm focus:text-[#FFFDF8]"
        >
          Перейти до основного вмісту
        </a>

        <Header />

        <main id="main">
          <Hero />
          <Approach />
          <Therapists />
          <HowToChoose />
          <QuoteBand />
          <Materials />
          <Events />
          <Ethics />
          <FinalCta />
        </main>

        <Footer />
      </div>
    </div>
  );
}
