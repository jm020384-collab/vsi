import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LogoNatural } from "@/components/brand/vsi/logo-natural";

const P = {
  bg: "#FAF7F0",
  paper: "#FFFDF8",
  ink: "#2F3D30",
  inkSoft: "#5B6A5C",
  clay: "#8B6F4E",
  clayLight: "#A98A63",
  sage: "#9CB49A",
  sageDeep: "#6E8C70",
  linen: "#EDE6D6",
};

const SERIF = "var(--f-spectral)";
const TEXT = "var(--f-nunito)";

/** Проросле насіння — велика ботанічна ілюстрація */
function SeedGrowth(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 300" fill="none" aria-hidden {...props}>
      {/* Лінія ґрунту */}
      <path
        d="M 10 240 Q 60 236 120 240 T 230 238"
        stroke={P.clay}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Коріння */}
      <g stroke={P.clay} strokeWidth="1.2" strokeLinecap="round" opacity="0.65" fill="none">
        <path d="M 120 240 C 118 258 108 272 92 284" />
        <path d="M 120 240 C 122 260 132 274 150 286" />
        <path d="M 120 245 C 120 262 120 276 120 290" />
        <path d="M 108 262 C 100 266 94 272 90 278" />
        <path d="M 134 266 C 142 270 148 276 152 282" />
      </g>
      {/* Стебло */}
      <path
        d="M 120 240 C 120 200 118 160 120 110"
        stroke={P.sageDeep}
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Листки — пари, що ростуть догори */}
      <g fill={P.sage}>
        <ellipse cx="86" cy="196" rx="30" ry="11" transform="rotate(-22 86 196)" opacity="0.9" />
        <ellipse cx="154" cy="182" rx="30" ry="11" transform="rotate(20 154 182)" opacity="0.75" />
        <ellipse cx="92" cy="152" rx="25" ry="9.5" transform="rotate(-26 92 152)" opacity="0.8" />
        <ellipse cx="150" cy="138" rx="25" ry="9.5" transform="rotate(24 150 138)" opacity="0.68" />
        <ellipse cx="100" cy="112" rx="19" ry="7.5" transform="rotate(-30 100 112)" opacity="0.7" />
        <ellipse cx="141" cy="102" rx="19" ry="7.5" transform="rotate(28 141 102)" opacity="0.6" />
      </g>
      {/* Прожилки на великих листках */}
      <g stroke={P.sageDeep} strokeWidth="0.8" opacity="0.4" fill="none">
        <path d="M 116 190 L 62 203" />
        <path d="M 124 178 L 180 172" />
      </g>
      {/* Верхівковий бутон */}
      <ellipse cx="120" cy="98" rx="6" ry="10" fill={P.sageDeep} opacity="0.85" />
      {/* Насінина-джерело в ґрунті */}
      <ellipse cx="120" cy="246" rx="7" ry="9" fill={P.clay} />
    </svg>
  );
}

export default function NaturalPreview() {
  return (
    <div className="min-h-screen" style={{ background: P.bg, color: P.ink, fontFamily: TEXT }}>
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: P.linen }}>
        <div className="container flex h-20 items-center justify-between">
          <Link href="/">
            <LogoNatural
              className="text-3xl font-bold"
              style={{ fontFamily: TEXT }}
              seedColor={P.clay}
              sproutColor={P.sageDeep}
            />
          </Link>
          <nav className="hidden gap-8 text-sm md:flex" style={{ color: P.inkSoft }}>
            <a href="#">Про метод</a>
            <a href="#">Фахівці</a>
            <a href="#">Журнал</a>
          </nav>
          <a
            href="#"
            className="rounded-full px-5 py-2.5 text-sm font-semibold"
            style={{ background: P.ink, color: P.bg }}
          >
            Знайти фахівця
          </a>
        </div>
      </header>

      {/* HERO */}
      <section>
        <div className="container py-20 md:py-28">
          <div className="grid items-center gap-14 md:grid-cols-12">
            <div className="md:col-span-7">
              <div
                className="text-[11px] font-semibold uppercase"
                style={{ color: P.clay, letterSpacing: "0.2em" }}
              >
                Аналітично орієнтована психотерапія
              </div>
              <h1
                className="mt-6 text-5xl leading-[1.06] md:text-[4.75rem]"
                style={{ fontFamily: SERIF, fontWeight: 400 }}
              >
                Усі з одного
                <br />
                <em style={{ color: P.clay }}>насіння</em>.
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed" style={{ color: P.inkSoft }}>
                <strong className="font-semibold" style={{ color: P.ink }}>
                  VSI
                </strong>{" "}
                — місце, де глибинна психологія росте, як рослина: повільно, ритмічно, з повагою до
                власних циклів.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{ background: P.clay, color: P.bg }}
                >
                  Знайти фахівця <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-semibold"
                  style={{ borderColor: P.clay, color: P.ink }}
                >
                  Про метод
                </a>
              </div>
            </div>

            <div className="md:col-span-5">
              <SeedGrowth className="mx-auto w-64 md:w-full md:max-w-sm" />
            </div>
          </div>

          {/* Велика демонстрація знака */}
          <div
            className="mt-20 rounded-3xl py-16 text-center"
            style={{
              background: P.paper,
              boxShadow: "0 1px 0 rgba(0,0,0,0.03), 0 20px 50px -30px rgba(47,61,48,0.25)",
            }}
          >
            <LogoNatural
              className="text-[5.5rem] font-bold md:text-[9rem]"
              style={{ fontFamily: TEXT }}
              seedColor={P.clay}
              sproutColor={P.sageDeep}
            />
            <div
              className="mx-auto mt-8 max-w-md px-6 text-sm leading-relaxed"
              style={{ color: P.inkSoft }}
            >
              Крапка падає — і проростає пагінцем із двома листками. Точка йде не для того, щоб
              зникнути, а щоб дати початок.
            </div>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="py-20" style={{ background: P.linen }}>
        <div className="container">
          <h2
            className="mx-auto max-w-2xl text-center text-3xl md:text-4xl"
            style={{ fontFamily: SERIF, fontWeight: 400 }}
          >
            Що ми вирощуємо разом
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Тілесна присутність",
                body: "Робота з тілом і відчуттями — не лише з думками. Психосоматика, дихання, заземлення.",
              },
              {
                title: "Глибинні образи",
                body: "Сни, активна уява, символи, архетипи. Розшифрування власної мови несвідомого.",
              },
              {
                title: "Терпіння процесу",
                body: "Не швидке полегшення, а тривала зустріч із собою. Без терміновості, без оцінок.",
              },
            ].map((c, i) => (
              <div
                key={c.title}
                className="rounded-2xl p-8"
                style={{
                  background: P.paper,
                  boxShadow: "0 1px 0 rgba(0,0,0,0.03), 0 10px 30px -18px rgba(47,61,48,0.18)",
                }}
              >
                {/* Маленький пагінець як маркер */}
                <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden>
                  <path
                    d="M 20 38 C 20 28 19 20 20 10"
                    stroke={P.sageDeep}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="10"
                    cy="16"
                    rx="9"
                    ry="4"
                    fill={P.sage}
                    transform="rotate(-26 10 16)"
                  />
                  {i > 0 && (
                    <ellipse
                      cx="30"
                      cy="13"
                      rx="9"
                      ry="4"
                      fill={P.sage}
                      opacity="0.75"
                      transform="rotate(24 30 13)"
                    />
                  )}
                  {i > 1 && (
                    <ellipse
                      cx="13"
                      cy="26"
                      rx="7"
                      ry="3.2"
                      fill={P.sage}
                      opacity="0.6"
                      transform="rotate(-22 13 26)"
                    />
                  )}
                </svg>
                <h3 className="mt-5 text-2xl" style={{ fontFamily: SERIF, fontWeight: 400 }}>
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: P.inkSoft }}>
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="container py-28">
        <figure className="mx-auto max-w-3xl">
          <div className="flex items-start gap-7">
            <div
              className="hidden h-20 w-1 shrink-0 rounded-full md:block"
              style={{ background: P.sage }}
            />
            <div>
              <blockquote
                className="text-2xl leading-snug md:text-3xl"
                style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300 }}
              >
                «Дерево, що хоче дотягтися до неба, мусить пустити коріння аж до пекла».
              </blockquote>
              <figcaption
                className="mt-6 text-[11px] font-semibold uppercase"
                style={{ color: P.clay, letterSpacing: "0.18em" }}
              >
                Карл Густав Юнг
              </figcaption>
            </div>
          </div>
        </figure>
      </section>

      <footer className="border-t py-12" style={{ borderColor: P.linen }}>
        <div className="container flex flex-col items-center gap-4">
          <LogoNatural
            className="text-2xl font-bold"
            style={{ fontFamily: TEXT }}
            seedColor={P.clay}
            sproutColor={P.sageDeep}
            still
          />
          <div className="text-xs" style={{ color: P.inkSoft }}>
            © 2026 VSI · Варіант 03 — Природний «Насінина»
          </div>
        </div>
      </footer>
    </div>
  );
}
