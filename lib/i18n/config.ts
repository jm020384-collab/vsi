/**
 * Мови публічної частини сайту.
 *
 * Українська — основна й лишається за звичними адресами. Російська —
 * ті самі сторінки з префіксом /ru: middleware прибирає префікс і передає
 * мову заголовком, тож сторінки в коді не дублюються.
 *
 * Файл без залежностей від Node: його читає і middleware (Edge).
 */
export type Locale = "uk" | "ru";

export const LOCALE_HEADER = "x-vsi-locale";
const RU_PREFIX = "/ru";

/**
 * Що має російську версію — лише те, що бачать клієнти.
 *
 * Це білий список навмисно: усе інше (кабінет, адмінка, вхід) за адресою
 * з /ru перенаправляється на звичайну, де працює перевірка доступу.
 */
const LOCALIZED_ROOTS = [
  "/therapists",
  "/specialists",
  "/themes",
  "/explore",
  "/library",
  "/events",
  "/social-support",
  "/pro-metod",
  "/privacy",
  "/terms",
  "/offline",
];

export function isLocalizable(path: string): boolean {
  return path === "/" || LOCALIZED_ROOTS.some((r) => path === r || path.startsWith(`${r}/`));
}

export function splitLocale(pathname: string): { locale: Locale; path: string } {
  if (pathname === RU_PREFIX) return { locale: "ru", path: "/" };
  if (pathname.startsWith(`${RU_PREFIX}/`)) {
    return { locale: "ru", path: pathname.slice(RU_PREFIX.length) };
  }
  return { locale: "uk", path: pathname };
}

/** Адреса тієї самої сторінки потрібною мовою; чужі адреси не чіпає. */
export function localizeHref(href: string, locale: Locale): string {
  if (locale !== "ru" || !href.startsWith("/") || href.startsWith("//")) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  if (!isLocalizable(path)) return href;
  return `${RU_PREFIX}${path === "/" ? "" : path}${cut === -1 ? "" : href.slice(cut)}`;
}
