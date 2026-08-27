import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * Великі заголовки та знак.
 *
 * `latin-ext` тут обов'язковий: у ньому живе безкрапкова «ı» (U+0131),
 * з якої зібрано логотип. `cyrillic` — для українських заголовків.
 */
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--vsi-serif",
  display: "swap",
});

/** Інтерфейс і основний текст. */
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--vsi-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "vsi — прототип платформи",
  description:
    "Аналітично орієнтована психотерапія: простір довіри, професійної етики та аналітичної глибини.",
  robots: { index: false, follow: false },
};

export default function VsiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${cormorant.variable} ${inter.variable}`}>{children}</div>;
}
