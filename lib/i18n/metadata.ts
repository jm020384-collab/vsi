import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/brand";
import { localizeHref, type Locale } from "./config";

/**
 * Назва, опис і мовні відповідники сторінки.
 *
 * Пошуковику треба знати, що українська й російська адреси — одна
 * сторінка двома мовами, а не дублі: для цього canonical веде на себе, а
 * hreflang перелічує обидві. Основною для всіх інших лишається українська.
 *
 * title і description приходять уже перекладеними.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  { title, description }: { title: Metadata["title"]; description?: string },
): Metadata {
  const url = localizeHref(path, locale);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { uk: path, ru: localizeHref(path, "ru"), "x-default": path },
    },
    // openGraph сторінки замінює кореневий цілком, тому картинку й назву
    // сайту доводиться повторити тут.
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: locale === "ru" ? "ru_RU" : "uk_UA",
      url,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
    },
  };
}
