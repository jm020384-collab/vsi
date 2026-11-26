import type { Locale } from "@/lib/i18n/config";
import { intlLocale } from "@/lib/i18n/translate";

export const EVENT_RECURRENCES = ["ONCE", "WEEKLY", "BIWEEKLY", "MONTHLY"] as const;
export type EventRecurrence = (typeof EVENT_RECURRENCES)[number];

export const RECURRENCE_LABEL: Record<EventRecurrence, string> = {
  ONCE: "Одна зустріч",
  WEEKLY: "Щотижня",
  BIWEEKLY: "Раз на два тижні",
  MONTHLY: "Раз на місяць",
};

const WEEKDAY_EVERY: string[] = [
  "щонеділі",
  "щопонеділка",
  "щовівторка",
  "щосереди",
  "щочетверга",
  "щоп'ятниці",
  "щосуботи",
];

const WEEKDAY_NAME: string[] = [
  "неділя",
  "понеділок",
  "вівторок",
  "середа",
  "четвер",
  "п'ятниця",
  "субота",
];

/** Слова, з яких складається підпис розкладу, — двома мовами сайту. */
const SCHEDULE_WORDS = {
  uk: {
    every: WEEKDAY_EVERY,
    day: WEEKDAY_NAME,
    at: "о",
    kyiv: "за Києвом",
    biweekly: "Раз на два тижні",
    monthly: "Раз на місяць",
    from: "з",
    until: "до",
  },
  ru: {
    every: [
      "каждое воскресенье",
      "каждый понедельник",
      "каждый вторник",
      "каждую среду",
      "каждый четверг",
      "каждую пятницу",
      "каждую субботу",
    ],
    day: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
    at: "в",
    kyiv: "по Киеву",
    biweekly: "Раз в две недели",
    monthly: "Раз в месяц",
    from: "с",
    until: "до",
  },
};

/**
 * Час подій — київський «настінний» час.
 *
 * Фахівець пише в анкеті годину за Києвом, і в базі вона лежить так,
 * ніби це UTC: «17:00» зберігається як 17:00Z і так само показується.
 * Раніше це трималося лише на тому, що сервер стоїть в UTC: на машині
 * з іншим поясом та сама подія показувала іншу годину, а підпису, чий
 * це час, не було зовсім. Тепер і запис, і показ явно працюють в UTC.
 *
 * Наслідок: startsAt не є справжньою миттю. Порівнювати його можна лише
 * з kyivWallNow(), а в календарі чи нагадування віддавати тільки після
 * перерахунку з київського поясу.
 */
const FLOATING = "UTC";

/** «Зараз» у тому самому вигляді, у якому лежить startsAt. */
export function kyivWallNow(now: Date = new Date()): Date {
  const wall = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Kyiv",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(now);
  return new Date(`${wall.replace(" ", "T")}Z`);
}

/** Значення input[type=datetime-local] або [type=date] без зсуву поясів. */
export function parseEventDateTime(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::\d{2})?)?$/.exec(value);
  if (!m) return null;
  // Дату без години ставимо на полудень — так день не «з'їжджає».
  return new Date(Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, m[4] ? +m[4] : 12, m[5] ? +m[5] : 0));
}

function timeLabel(date: Date, locale: Locale): string {
  return date.toLocaleTimeString(intlLocale(locale), {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FLOATING,
  });
}

export function dayLabel(date: Date, locale: Locale = "uk"): string {
  return date.toLocaleDateString(intlLocale(locale), {
    day: "numeric",
    month: "long",
    timeZone: FLOATING,
  });
}

/**
 * Людський підпис розкладу: «Щосереди о 18:30, з 20 вересня».
 *
 * День тижня не зберігається окремо — він завжди виводиться з дати
 * першої зустрічі, тож не може розійтися з нею.
 */
export function scheduleLabel(
  event: {
    startsAt: Date;
    recurrence: EventRecurrence;
    recurrenceEndsAt: Date | null;
  },
  locale: Locale = "uk",
): string {
  const { startsAt, recurrence, recurrenceEndsAt } = event;
  const w = SCHEDULE_WORDS[locale];
  const at = `${w.at} ${timeLabel(startsAt, locale)} ${w.kyiv}`;

  if (recurrence === "ONCE") {
    return `${dayLabel(startsAt, locale)} ${at}`;
  }

  const weekday = startsAt.getUTCDay();
  const head =
    recurrence === "WEEKLY"
      ? `${w.every[weekday]} ${at}`
      : recurrence === "BIWEEKLY"
        ? `${w.biweekly}, ${w.day[weekday]} ${at}`
        : `${w.monthly}, ${w.day[weekday]} ${at}`;

  const parts = [head.charAt(0).toUpperCase() + head.slice(1)];
  if (startsAt.getTime() > kyivWallNow().getTime()) {
    parts.push(`${w.from} ${dayLabel(startsAt, locale)}`);
  }
  if (recurrenceEndsAt) parts.push(`${w.until} ${dayLabel(recurrenceEndsAt, locale)}`);
  return parts.join(", ");
}

/**
 * Умова видимості події на публічній сторінці.
 *
 * Одноразова зникає після своєї дати. Регулярна — ні: група, що почалася
 * місяць тому і триває, має лишатися на сайті, інакше фільтр за startsAt
 * ховав би саме те, до чого ще можна приєднатися.
 */
export function upcomingEventFilter(now: Date = kyivWallNow()) {
  return {
    OR: [
      { recurrence: "ONCE" as const, startsAt: { gte: now } },
      {
        recurrence: { not: "ONCE" as const },
        OR: [{ recurrenceEndsAt: null }, { recurrenceEndsAt: { gte: now } }],
      },
    ],
  };
}
