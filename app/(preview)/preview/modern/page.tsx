import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { LogoModern } from "@/components/brand/vsi/logo-modern";

const P = {
  bg: "#F4F3F0",
  surface: "#FFFFFF",
  ink: "#111112",
  inkSoft: "#55554F",
  muted: "#8A8985",
  accent: "#FF4A1C",
  line: "#DEDCD6",
};

const DISPLAY = "var(--f-unbounded)";
const TEXT = "var(--f-manrope)";

export default function ModernPreview() {
  return (
    <div className="min-h-screen" style={{ background: P.bg, color: P.ink, fontFamily: TEXT }}>
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: P.line }}>
        <div className="container flex h-20 items-center justify-between">
          <Link href="/">
            <LogoModern
              className="text-3xl font-semibold"
              style={{ fontFamily: DISPLAY }}
              dotColor={P.accent}
            />
          </Link>
          <nav
            className="hidden gap-9 text-[13px] font-medium md:flex"
            style={{ color: P.inkSoft }}
          >
            <a href="#" className="hover:text-black">
              Метод
            </a>
            <a href="#" className="hover:text-black">
              Фахівці
            </a>
            <a href="#" className="hover:text-black">
              Журнал
            </a>
          </nav>
          <a
            href="#"
            className="rounded-full px-5 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-85"
            style={{ background: P.ink, color: P.bg }}
          >
            Знайти фахівця
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b" style={{ borderColor: P.line }}>
        <div className="container py-24 md:py-36">
          <div className="grid gap-14 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.26em]"
                style={{ color: P.accent }}
              >
                Аналітично орієнтована психотерапія
              </div>
              <h1
                className="mt-8 text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.045em] md:text-[6rem]"
                style={{ fontFamily: DISPLAY }}
              >
                Ми — одне
                <br />
                ціле. Просто
                <br />
                <span style={{ color: P.accent }}>розділені</span> собою.
              </h1>
            </div>

            <div className="md:col-span-4">
              <p className="text-lg leading-relaxed" style={{ color: P.inkSoft }}>
                <strong className="font-semibold" style={{ color: P.ink }}>
                  VSI
                </strong>{" "}
                — простір, де знаходять фахівця й читають про глибинний метод. Без алгоритмів. Без
                рейтингів. Без поспіху.
              </p>
              <div className="mt-8 flex flex-col gap-3">
                <a
                  href="#"
                  className="group flex items-center justify-between rounded-full px-6 py-4 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: P.ink, color: P.bg }}
                >
                  Знайти фахівця
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#"
                  className="group flex items-center justify-between rounded-full border px-6 py-4 text-sm font-semibold"
                  style={{ borderColor: P.ink, color: P.ink }}
                >
                  Про метод
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Велика демонстрація знака */}
          <div
            className="mt-24 flex flex-col items-center gap-6 rounded-2xl py-20"
            style={{ background: P.surface }}
          >
            <LogoModern
              className="text-[6rem] font-semibold md:text-[10rem]"
              style={{ fontFamily: DISPLAY }}
              dotColor={P.accent}
            />
            <div
              className="max-w-md px-6 text-center text-sm leading-relaxed"
              style={{ color: P.muted }}
            >
              Крапка відривається й летить по параболі вправо. Індивід, що вийшов із цілого — і
              повертається до нього. Цикл замикається кожні п'ять секунд.
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES — числова сітка */}
      <section className="border-b" style={{ borderColor: P.line }}>
        <div className="container py-24">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2
                className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-5xl"
                style={{ fontFamily: DISPLAY }}
              >
                Три
                <br />
                принципи.
              </h2>
            </div>
            <div className="md:col-span-8">
              <div className="space-y-px" style={{ background: P.line }}>
                {[
                  [
                    "01",
                    "Пошук без алгоритму",
                    "Фільтри за містом, форматом, спеціалізацією, ціною. Ви обираєте — не стрічка за вас.",
                  ],
                  [
                    "02",
                    "Ручна верифікація",
                    "Кожен профіль з'являється у каталозі лише після перевірки дипломів.",
                  ],
                  [
                    "03",
                    "Глибина замість швидкості",
                    "Журнал лонгрідів про сновидіння, тінь, індивідуацію. Не для кліків.",
                  ],
                ].map(([n, t, b]) => (
                  <div
                    key={n}
                    className="grid grid-cols-12 gap-6 py-9"
                    style={{ background: P.bg }}
                  >
                    <div
                      className="col-span-2 text-2xl font-semibold tracking-tight"
                      style={{ fontFamily: DISPLAY, color: P.accent }}
                    >
                      {n}
                    </div>
                    <div className="col-span-10">
                      <h3 className="text-2xl font-semibold tracking-tight">{t}</h3>
                      <p
                        className="mt-2 max-w-xl text-sm leading-relaxed"
                        style={{ color: P.inkSoft }}
                      >
                        {b}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section style={{ background: P.ink, color: P.bg }}>
        <div className="container py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p
              className="text-3xl font-medium leading-[1.15] tracking-[-0.03em] md:text-5xl"
              style={{ fontFamily: DISPLAY }}
            >
              «Хто дивиться зовні — мріє.
              <br />
              Хто дивиться всередину — <span style={{ color: P.accent }}>пробуджується</span>».
            </p>
            <div
              className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: P.muted }}
            >
              Карл Густав Юнг
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: P.line }}>
        <div className="container flex flex-col items-center gap-4 py-14">
          <LogoModern
            className="text-2xl font-semibold"
            style={{ fontFamily: DISPLAY }}
            dotColor={P.accent}
            still
          />
          <div className="text-xs" style={{ color: P.muted }}>
            © 2026 VSI · Варіант 01 — Модерн «Орбіта»
          </div>
        </div>
      </footer>
    </div>
  );
}
