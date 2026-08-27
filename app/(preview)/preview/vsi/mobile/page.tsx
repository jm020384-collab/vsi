import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LogoVsi } from "@/components/brand/vsi/logo-vsi";
import { PhoneFrame } from "@/components/preview/vsi/mobile/phone-frame";
import { ScreenHome } from "@/components/preview/vsi/mobile/screen-home";
import { ScreenSearch } from "@/components/preview/vsi/mobile/screen-search";
import { ScreenGroups } from "@/components/preview/vsi/mobile/screen-groups";
import { PaperTexture } from "@/components/preview/vsi/decor";
import { Eyebrow, SectionTitle, Lead } from "@/components/preview/vsi/ui";
import { focusRing, vsiTokens } from "@/components/preview/vsi/theme";

export default function VsiMobilePage() {
  return (
    <div style={vsiTokens} className="relative min-h-screen bg-[#F8F4EC] antialiased" lang="uk">
      <style>{`
        body > header, body > footer { display: none !important; }
      `}</style>

      <div className="pointer-events-none fixed inset-0 z-[1]">
        <PaperTexture />
      </div>

      <div
        className="relative z-[2] mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 lg:px-10"
        style={{ fontFamily: "var(--vsi-sans), system-ui, sans-serif" }}
      >
        {/* Шапка showcase */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <LogoVsi
            className="text-[2rem] text-[#142744]"
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          />
          <Link
            href="/preview/vsi"
            className={`border-[#142744]/22 inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-5 text-sm font-medium text-[#142744] transition-colors hover:bg-[#142744]/[0.04] motion-reduce:transition-none ${focusRing}`}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            До desktop-версії
          </Link>
        </div>

        <div className="mt-12 max-w-2xl">
          <Eyebrow>Mobile</Eyebrow>
          <SectionTitle className="mt-6">Три ключові екрани</SectionTitle>
          <Lead className="mt-5">
            Той самий бренд у щільнішому ритмі: арка лишається смисловим центром, але поступається
            місцем першій дії. Нижня навігація — п&apos;ять розділів, кожна ціль не менша за
            44&nbsp;px.
          </Lead>
        </div>

        {/* Три екрани */}
        <div className="mt-14 flex snap-x snap-mandatory gap-10 overflow-x-auto pb-6 lg:gap-14">
          <PhoneFrame
            label="Головна"
            caption="Hero, аркова композиція, добірка фахівців і матеріалів."
            className="snap-start"
          >
            <ScreenHome />
          </PhoneFrame>

          <PhoneFrame
            label="Пошук фахівця"
            caption="Пошук, фільтри-чіпи з горизонтальним скролом, компактні картки."
            className="snap-start"
          >
            <ScreenSearch />
          </PhoneFrame>

          <PhoneFrame
            label="Групи та матеріали"
            caption="Таби спільноти, заповненість груп, лист очікування."
            className="snap-start"
          >
            <ScreenGroups />
          </PhoneFrame>
        </div>

        {/* Стани інтерфейсу */}
        <div className="mt-20 max-w-2xl">
          <Eyebrow>Стани</Eyebrow>
          <SectionTitle className="mt-6">Завантаження і порожній результат</SectionTitle>
          <Lead className="mt-5">
            Обидва стани тримають ту саму сітку, що й результати — щоб перехід не зсував layout.
            Скелетон вимикається при prefers-reduced-motion.
          </Lead>
        </div>

        <div className="mt-14 flex gap-10 overflow-x-auto pb-6 lg:gap-14">
          <PhoneFrame
            label="Loading state"
            caption="Скелетони повторюють висоту реальних карток — без стрибка контенту."
          >
            <ScreenSearch state="loading" />
          </PhoneFrame>

          <PhoneFrame
            label="Empty state"
            caption="Порожня арка як метафора: контейнер є, вмісту поки немає. Два виходи замість глухого кута."
          >
            <ScreenSearch state="empty" />
          </PhoneFrame>
        </div>
      </div>
    </div>
  );
}
