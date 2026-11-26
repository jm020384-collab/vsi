import type { Locale } from "./config";

/**
 * Переклад за самим українським рядком: tr("Записатися").
 *
 * Український текст лишається просто в коді, а словник ru.json зіставляє
 * його з російським. Якщо перекладу немає (наприклад, текст змінили),
 * показується оригінал — порожнього місця не буває. Пропуски ловить
 * pnpm i18n:check.
 */
export type Messages = Record<string, string>;
export type Vars = Record<string, string | number>;
export type Translate = (uk: string, vars?: Vars) => string;

export function interpolate(text: string, vars?: Vars): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}

export function createTranslator(messages: Messages | null): Translate {
  return (uk, vars) => interpolate(messages?.[uk] ?? uk, vars);
}

/** Форма слова для числа; правило однакове в українській і російській. */
export function pluralForm<T>(n: number, forms: readonly [T, T, T]): T {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function intlLocale(locale: Locale): string {
  return locale === "ru" ? "ru-RU" : "uk-UA";
}
