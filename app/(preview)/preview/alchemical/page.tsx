import Link from "next/link";

import { LogoAlchemical } from "@/components/brand/vsi/logo-alchemical";

const P = {
  bg: "#F2EAD0",
  paper: "#FAF3DC",
  ink: "#1A1410",
  inkSoft: "#4A3D2E",
  sepia: "#6B5A3D",
  gold: "#C8A95F",
  goldDeep: "#A0843E",
  vermillion: "#A8442A",
  lapis: "#4A5D7E",
  line: "#D5C99A",
};

const SERIF = "var(--f-cormorant)";
const MONO = "var(--f-mono)";

export default function AlchemicalPreview() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: P.bg,
        color: P.ink,
        fontFamily: SERIF,
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence baseFrequency='0.45' seed='11'/><feColorMatrix values='0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.08'/></svg>\")",
      }}
    >
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: P.ink }}>
        <div className="container py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/">
              <LogoAlchemical
                className="text-4xl"
                style={{ fontFamily: SERIF, fontWeight: 500 }}
                dotColor={P.gold}
              />
            </Link>
            <nav
              className="hidden gap-8 text-xs md:flex"
              style={{ color: P.inkSoft, fontFamily: MONO }}
            >
              <a href="#" className="hover:text-black">
                opus.
              </a>
              <a href="#" className="hover:text-black">
                adepti.
              </a>
              <a href="#" className="hover:text-black">
                liber.
              </a>
            </nav>
            <a
              href="#"
              className="border px-4 py-1.5 text-xs"
              style={{ borderColor: P.vermillion, color: P.vermillion, fontFamily: MONO }}
            >
              intra ›
            </a>
          </div>
          <div className="mt-3 text-center text-xs italic" style={{ color: P.sepia }}>
            ☉ Unus Mundus ☽ — усі як один світ
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b" style={{ borderColor: P.line }}>
        <div className="container py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <div
              className="text-[11px] uppercase"
              style={{ color: P.vermillion, letterSpacing: "0.26em", fontFamily: MONO }}
            >
              Аналітично орієнтована психотерапія
            </div>

            <h1
              className="mt-9 text-5xl leading-[1.02] md:text-[5.5rem]"
              style={{ fontFamily: SERIF, fontWeight: 500 }}
            >
              На глибині
              <br />
              <em style={{ color: P.vermillion }}>усі</em> — одне{" "}
              <span style={{ color: P.gold }}>ціле</span>.
            </h1>

            <p
              className="mx-auto mt-9 max-w-xl text-lg leading-relaxed md:text-xl"
              style={{ color: P.inkSoft }}
            >
              Терапія — це сучасна назва алхімії душі. Тривала робота, де розділене згущується назад
              у цілісність.
            </p>

            {/* Три первоначала */}
            <div className="mt-12 flex items-start justify-center gap-10">
              {[
                { sym: "☉", lat: "Sulphur", uk: "душа" },
                { sym: "☽", lat: "Sal", uk: "тіло" },
                { sym: "☿", lat: "Mercurius", uk: "дух" },
              ].map((s) => (
                <div key={s.sym} className="text-center">
                  <div className="text-3xl" style={{ color: P.gold }}>
                    {s.sym}
                  </div>
                  <div className="mt-1.5 text-[10px]" style={{ color: P.sepia, fontFamily: MONO }}>
                    {s.lat}
                  </div>
                  <div className="text-[10px] italic" style={{ color: P.sepia }}>
                    {s.uk}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-3">
              <a
                href="#"
                className="px-7 py-3 text-sm"
                style={{ background: P.vermillion, color: P.bg, fontFamily: MONO }}
              >
                знайти adeptum →
              </a>
              <a
                href="#"
                className="border-2 px-7 py-3 text-sm"
                style={{ borderColor: P.ink, color: P.ink, fontFamily: MONO }}
              >
                про opus magnum
              </a>
            </div>
          </div>

          {/* Велика демонстрація знака */}
          <div
            className="mx-auto mt-24 max-w-3xl border py-16 text-center"
            style={{ borderColor: P.line, background: P.paper }}
          >
            <LogoAlchemical
              className="text-[5.5rem] md:text-[9rem]"
              style={{ fontFamily: SERIF, fontWeight: 500 }}
              dotColor={P.gold}
            />
            <div
              className="mx-auto mt-8 max-w-md px-6 text-sm italic leading-relaxed"
              style={{ color: P.sepia }}
            >
              Крапля первісної матерії зривається, падає по дузі й осідає в посудині — де пульсує
              золотом. Solve et Coagula: розділи, щоб згустити наново.
            </div>
          </div>
        </div>
      </section>

      {/* QUATTUOR GRADUS */}
      <section>
        <div className="container py-24">
          <h2
            className="mx-auto max-w-3xl text-center text-3xl italic md:text-4xl"
            style={{ fontFamily: SERIF }}
          >
            Quattuor gradus operis — чотири стадії
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-sm" style={{ color: P.sepia }}>
            Класичні фази внутрішньої трансформації: від чорноти до золота.
          </p>

          <div
            className="mx-auto mt-14 grid max-w-5xl gap-px md:grid-cols-4"
            style={{ background: P.line }}
          >
            {[
              {
                lat: "Nigredo",
                uk: "Чорнота",
                c: "#1A1410",
                body: "Зустріч із тінню. Розкладання звичних опор.",
              },
              {
                lat: "Albedo",
                uk: "Білість",
                c: "#E8DBB4",
                body: "Очищення, відновлення душі-Anima.",
              },
              {
                lat: "Citrinitas",
                uk: "Жовтизна",
                c: P.gold,
                body: "Свідома мудрість, перші проблиски Self.",
              },
              {
                lat: "Rubedo",
                uk: "Червінь",
                c: P.vermillion,
                body: "Інтеграція — цілісність як золото філософа.",
              },
            ].map((s) => (
              <div key={s.lat} className="p-8" style={{ background: P.paper }}>
                <div
                  className="grid h-11 w-11 place-items-center rounded-full text-lg"
                  style={{ background: s.c, color: s.c === "#1A1410" ? P.gold : P.ink }}
                >
                  ☥
                </div>
                <h3 className="mt-5 text-2xl italic" style={{ fontFamily: SERIF }}>
                  {s.lat}
                </h3>
                <div className="text-[10px]" style={{ color: P.sepia, fontFamily: MONO }}>
                  · {s.uk}
                </div>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: P.inkSoft }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EPIGRAPH */}
      <section className="border-y" style={{ borderColor: P.line, background: P.paper }}>
        <div className="container py-28">
          <figure className="mx-auto max-w-3xl text-center">
            <div className="text-2xl" style={{ color: P.gold }}>
              ☉ ☽ ☿
            </div>
            <blockquote
              className="mt-8 text-3xl italic leading-snug md:text-4xl"
              style={{ fontFamily: SERIF }}
            >
              «Алхіміки писали не про метали —
              <br />а про власну душу, переплавлену вогнем».
            </blockquote>
            <figcaption className="mt-8 text-xs" style={{ color: P.sepia, fontFamily: MONO }}>
              C. G. JUNG · Psychologie und Alchemie, 1944
            </figcaption>
          </figure>
        </div>
      </section>

      <footer className="border-t py-12" style={{ borderColor: P.line }}>
        <div className="container flex flex-col items-center gap-4">
          <LogoAlchemical
            className="text-2xl"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
            dotColor={P.gold}
            still
          />
          <div className="text-xs italic" style={{ color: P.sepia }}>
            ☉ VSI · Anno MMXXVI · Варіант 02 — Алхімічний «Prima Materia»
          </div>
        </div>
      </footer>
    </div>
  );
}
