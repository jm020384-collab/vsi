import type { DayPart, SessionFormat, SocialSupportStatus, Weekday } from "@prisma/client";

/**
 * Спільні підписи програми соціальної підтримки.
 *
 * Живуть окремо від серверних дій: файл із "use server" може
 * експортувати лише асинхронні функції, а ці сталі потрібні і формі,
 * і кабінету, і адмінці.
 */

export const WEEKDAYS: { value: Weekday; label: string; short: string }[] = [
  { value: "MON", label: "Понеділок", short: "Пн" },
  { value: "TUE", label: "Вівторок", short: "Вт" },
  { value: "WED", label: "Середа", short: "Ср" },
  { value: "THU", label: "Четвер", short: "Чт" },
  { value: "FRI", label: "П'ятниця", short: "Пт" },
  { value: "SAT", label: "Субота", short: "Сб" },
  { value: "SUN", label: "Неділя", short: "Нд" },
];

export const WEEKDAY_VALUES = WEEKDAYS.map((d) => d.value);

export const DAY_PARTS: { value: DayPart; label: string }[] = [
  { value: "MORNING", label: "Ранок" },
  { value: "DAYTIME", label: "День" },
  { value: "EVENING", label: "Вечір" },
];

export const DAY_PART_VALUES = DAY_PARTS.map((d) => d.value);

export const SOCIAL_STATUS_LABEL: Record<SocialSupportStatus, string> = {
  NEW: "Нова",
  REVIEWING: "На розгляді",
  SPECIALIST_FOUND: "Фахівця знайдено",
  CONTACTED: "Зв'язалися",
  CLOSED: "Закрито",
};

export const SOCIAL_STATUS_ORDER: SocialSupportStatus[] = [
  "NEW",
  "REVIEWING",
  "SPECIALIST_FOUND",
  "CONTACTED",
  "CLOSED",
];

/**
 * Формат очима заявника.
 *
 * Той самий SessionFormat, але BOTH тут означає «не має значення», а не
 * «працюю і так, і так» — підписи фахівця сюди не годяться.
 */
export const APPLICANT_FORMAT_LABEL: Record<SessionFormat, string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Не має значення",
};

export const THERAPIST_FORMAT_LABEL: Record<SessionFormat, string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Онлайн і очно",
};

/** Валюти, які пропонуємо у формі. Вільне введення не потрібне. */
export const SOCIAL_CURRENCIES = ["UAH", "EUR", "USD", "CAD", "PLN", "GBP"];

/** Суми зберігаємо в мінімальних одиницях — як priceFrom у профілі. */
export function formatSocialAmount(minor: number, currency: string): string {
  return `${Math.round(minor / 100)} ${currency}`;
}

export function weekdayLabels(days: Weekday[]): string {
  if (days.length === 0) return "—";
  const order = new Map(WEEKDAYS.map((d, i) => [d.value, i]));
  return [...days]
    .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
    .map((d) => WEEKDAYS.find((w) => w.value === d)?.short ?? d)
    .join(", ");
}

export function dayPartLabels(parts: DayPart[]): string {
  if (parts.length === 0) return "—";
  const order = new Map(DAY_PARTS.map((d, i) => [d.value, i]));
  return [...parts]
    .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))
    .map((p) => DAY_PARTS.find((d) => d.value === p)?.label ?? p)
    .join(", ");
}
