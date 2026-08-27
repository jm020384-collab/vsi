import type { Metadata } from "next";
import Link from "next/link";
import {
  Unbounded,
  Manrope,
  Nunito,
  Cormorant_Garamond,
  Spectral,
  IBM_Plex_Mono,
} from "next/font/google";
import { ChevronLeft } from "lucide-react";

/** Модерн — Unbounded (Kyiv Type Foundry), характерний геометричний */
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--f-unbounded",
  display: "swap",
});

/** Модерн — текст */
const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-manrope",
  display: "swap",
});

/** Природний — м'який заокруглений */
const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-nunito",
  display: "swap",
});

/** Алхімічний — благородний серіф */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--f-cormorant",
  display: "swap",
});

/** Природний — серіф для заголовків */
const spectral = Spectral({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--f-spectral",
  display: "swap",
});

/** Алхімічний — латинські позначки і символи */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--f-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vsi — дизайн-галерея",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        unbounded.variable,
        manrope.variable,
        nunito.variable,
        cormorant.variable,
        spectral.variable,
        plexMono.variable,
      ].join(" ")}
    >
      <div className="sticky top-0 z-50 border-b border-black/10 bg-white/80 px-4 py-2 backdrop-blur">
        <div className="container flex items-center justify-between text-xs text-neutral-600">
          <Link href="/preview" className="inline-flex items-center gap-1 hover:text-black">
            <ChevronLeft className="h-3.5 w-3.5" />
            Усі варіанти
          </Link>
          <span className="tracking-[0.2em]">vsi · дизайн-галерея</span>
          <Link href="/" className="hover:text-black">
            На сайт →
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
