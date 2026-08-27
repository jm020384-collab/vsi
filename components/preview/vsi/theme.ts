import type { CSSProperties } from "react";

/**
 * VSI · Дизайн-токени
 *
 * Палітра бренд-борду: Midnight Blue, Warm Ivory, Parchment,
 * Muted Gold, Lavender Ash, Muted Clay, Graphite, Warm White.
 *
 * Загальний тон — теплий папір і повітря. Глибокий синій — текст,
 * знак і рідкісні глибокі площини. Золото — лише делікатний лінійний
 * декор та маленькі сфери, ніколи не основний текст на світлому.
 */

export const VSI = {
  midnight: "#142744", // Midnight Blue
  navy: "#1C3557", // Deep Navy
  ivory: "#F8F4EC", // Warm Ivory
  parchment: "#E9DECE", // Parchment
  gold: "#B38B49", // Muted Gold
  lavender: "#AAA8B5", // Lavender Ash
  clay: "#B8785E", // Muted Clay
  graphite: "#29323B", // Graphite
  white: "#FFFDF8", // Warm White

  /** Похідні для градієнтів і лінійного декору */
  goldBright: "#D9B269", // світлий край золотого штриха
  goldDeep: "#8F6B2A", // золото, безпечне як текст великих кеглів (4.4:1)

  /* Аліаси для сумісності зі старими посиланнями в компонентах */
  blue: "#142744",
  blueSoft: "#1C3557",
  sand: "#F8F4EC",
  stone: "#E9DECE",
  ink: "#29323B",
  inkMuted: "#5C6672",
} as const;

/**
 * Ті самі кольори у форматі shadcn (`H S% L%`).
 *
 * Проєкт глобально живе на палітрі «Червона книга», заданій у
 * app/globals.css. Тут ми перевизначаємо ті самі змінні локально,
 * тож існуючі Button / Badge / Card звучать у бренді vsi без форку.
 * Inline-style виграє специфічністю і в light, і в dark.
 */
export const vsiTokens: CSSProperties = {
  "--background": "40 46% 95%", // Warm Ivory
  "--foreground": "216 55% 17%", // Midnight Blue

  "--card": "43 100% 99%", // Warm White
  "--card-foreground": "216 55% 17%",

  "--popover": "43 100% 99%",
  "--popover-foreground": "216 55% 17%",

  "--primary": "215 51% 23%", // Deep Navy
  "--primary-foreground": "43 100% 99%",

  "--secondary": "36 38% 86%", // Parchment
  "--secondary-foreground": "216 55% 17%",

  "--muted": "36 38% 90%",
  "--muted-foreground": "210 18% 34%",

  /**
   * Accent — Muted Gold. Свідомо НЕ використовується як колір тексту
   * на світлому тлі (контраст ~2.9:1 — нижче AA). Тільки заливки,
   * штрихи 1px, сфери й розділювачі. Для золотих слів у великих
   * заголовках існує VSI.goldDeep.
   */
  "--accent": "37 42% 49%",
  "--accent-foreground": "216 55% 17%",

  "--destructive": "17 39% 42%",
  "--destructive-foreground": "43 100% 99%",

  "--border": "36 30% 80%",
  "--input": "36 30% 76%",
  "--ring": "215 51% 23%",

  "--radius": "0.875rem",
} as CSSProperties;

/**
 * Текстові кольори, безпечні за WCAG AA на Warm Ivory (#F8F4EC).
 */
export const ink = {
  /** #142744 → 13.6:1 */
  strong: "text-[#142744]",
  /** #29323B → 10.7:1 */
  body: "text-[#29323B]",
  /** #4A5568 → 6.5:1 */
  muted: "text-[#4A5568]",
  /** #5C6672 → 5.1:1 — мінімум для дрібного тексту */
  soft: "text-[#5C6672]",
} as const;

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3557] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EC]";

export const focusRingDark =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B38B49] focus-visible:ring-offset-2 focus-visible:ring-offset-[#142744]";

/** Мінімальний touch target — 44px за WCAG 2.5.5. */
export const touch = "min-h-[44px] min-w-[44px]";
