import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LogoModern } from "@/components/brand/vsi/logo-modern";
import { LogoAlchemical } from "@/components/brand/vsi/logo-alchemical";
import { LogoNatural } from "@/components/brand/vsi/logo-natural";

const VARIANTS = [
  {
    slug: "/preview/modern",
    number: "01",
    name: "Модерн",
    concept: "«Орбіта»",
    idea: "Крапка відривається й летить по параболі вправо — стає окремою точкою поруч зі словом. Індивід, що вийшов із цілого й лишився його частиною.",
    palette: ["#F4F3F0", "#111112", "#FF4A1C", "#8A8985"],
    fonts: "Unbounded + Manrope",
    logo: (
      <LogoModern className="text-5xl font-semibold" style={{ fontFamily: "var(--f-unbounded)" }} />
    ),
    bg: "#F4F3F0",
    fg: "#111112",
  },
  {
    slug: "/preview/alchemical",
    number: "02",
    name: "Алхімічний",
    concept: "«Prima Materia»",
    idea: "Крапля первісної матерії падає по дузі в посудину — і пульсує там золотом. Дистиляція як метафора: те, що було нерухомим угорі, опускається й повертається зміненим.",
    palette: ["#F2EAD0", "#1A1410", "#C8A95F", "#A8442A"],
    fonts: "Cormorant Garamond + Plex Mono",
    logo: (
      <LogoAlchemical
        className="text-5xl"
        style={{ fontFamily: "var(--f-cormorant)", fontWeight: 500 }}
      />
    ),
    bg: "#F2EAD0",
    fg: "#1A1410",
  },
  {
    slug: "/preview/natural",
    number: "03",
    name: "Природний",
    concept: "«Насінина»",
    idea: "Крапка падає — і проростає пагінцем із двома листками. Точка йде не для того, щоб зникнути, а щоб дати початок. Усі — з одного насіння.",
    palette: ["#FAF7F0", "#2F3D30", "#8B6F4E", "#9CB49A"],
    fonts: "Spectral + Nunito",
    logo: (
      <LogoNatural className="text-5xl font-semibold" style={{ fontFamily: "var(--f-nunito)" }} />
    ),
    bg: "#FAF7F0",
    fg: "#2F3D30",
  },
];

export default function VsiGalleryPage() {
  return (
    <main
      className="min-h-screen bg-neutral-50 py-16"
      style={{ fontFamily: "var(--f-manrope), system-ui, sans-serif" }}
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-neutral-500">
            Бренд-концепція
          </p>
          <h1
            className="mt-5 text-5xl font-semibold tracking-tight text-neutral-900 md:text-6xl"
            style={{ fontFamily: "var(--f-unbounded)" }}
          >
            VSI
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-neutral-700">
            <strong className="font-semibold">всі</strong> — як всесвіт, як цілісність, як
            об'єднання. На глибинному рівні ми є одним цілим.
          </p>
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-left">
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">
              Спільна ідея знака
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-700">
              Крапка над «i» падає вправо. Вона відділяється від літери — і слово втрачає
              завершеність, набуваючи руху. Це водночас{" "}
              <strong className="font-semibold">індивідуація</strong> (частина виходить із цілого) і{" "}
              <strong className="font-semibold">незамкненість</strong> (процес триває). У трьох
              варіантах падіння означає різне: орбіту, дистиляцію, проростання.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-3">
          {VARIANTS.map((v) => (
            <Link
              key={v.slug}
              href={v.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              {/* Живий логотип на власному тлі */}
              <div
                className="grid h-44 place-items-center border-b border-neutral-200"
                style={{ background: v.bg, color: v.fg }}
              >
                {v.logo}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                      {v.number}
                    </span>
                    <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">
                      {v.name}
                    </h2>
                    <div className="text-sm italic text-neutral-500">{v.concept}</div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-neutral-900" />
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">{v.idea}</p>

                <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                  <div className="flex -space-x-1">
                    {v.palette.map((c, i) => (
                      <span
                        key={i}
                        className="h-6 w-6 rounded-full ring-2 ring-white"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500">{v.fonts}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-neutral-500">
          Наведіть на картку або відкрийте варіант — анімація крапки працює живою. Далі можна
          змішувати: палітру з одного, знак з іншого.
        </p>
      </div>
    </main>
  );
}
