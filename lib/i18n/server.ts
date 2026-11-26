import { headers } from "next/headers";

import { LOCALE_HEADER, localizeHref, type Locale } from "./config";
import { createTranslator } from "./translate";
import ru from "./ru.json";

/** Мова поточного запиту. Не викликати всередині unstable_cache. */
export async function getLocale(): Promise<Locale> {
  return (await headers()).get(LOCALE_HEADER) === "ru" ? "ru" : "uk";
}

export async function getI18n() {
  const locale = await getLocale();
  return {
    locale,
    tr: createTranslator(locale === "ru" ? ru : null),
    href: (path: string) => localizeHref(path, locale),
  };
}
