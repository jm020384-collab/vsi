"use client";

import { createContext, useContext, useMemo } from "react";

import type { Locale } from "./config";
import { createTranslator, type Messages, type Translate } from "./translate";

const I18nContext = createContext<{ locale: Locale; tr: Translate }>({
  locale: "uk",
  tr: createTranslator(null),
});

/**
 * Словник приходить пропом із сервера лише для російської версії, тому
 * українським відвідувачам він не завантажується зовсім.
 */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages | null;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, tr: createTranslator(messages) }), [locale, messages]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
