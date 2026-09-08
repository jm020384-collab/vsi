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

function timeLabel(date: Date): string {
  return date.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(date: Date): string {
  return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
}

/**
 * Людський підпис розкладу: «Щосереди о 18:30, з 20 вересня».
 *
 * День тижня не зберігається окремо — він завжди виводиться з дати
 * першої зустрічі, тож не може розійтися з нею.
 */
export function scheduleLabel(event: {
  startsAt: Date;
  recurrence: EventRecurrence;
  recurrenceEndsAt: Date | null;
}): string {
  const { startsAt, recurrence, recurrenceEndsAt } = event;
  const time = timeLabel(startsAt);

  if (recurrence === "ONCE") {
    return `${dayLabel(startsAt)} о ${time}`;
  }

  const weekday = startsAt.getDay();
  const head =
    recurrence === "WEEKLY"
      ? `${WEEKDAY_EVERY[weekday]} о ${time}`
      : recurrence === "BIWEEKLY"
        ? `Раз на два тижні, ${WEEKDAY_NAME[weekday]} о ${time}`
        : `Раз на місяць, ${WEEKDAY_NAME[weekday]} о ${time}`;

  const parts = [head.charAt(0).toUpperCase() + head.slice(1)];
  if (startsAt.getTime() > Date.now()) parts.push(`з ${dayLabel(startsAt)}`);
  if (recurrenceEndsAt) parts.push(`до ${dayLabel(recurrenceEndsAt)}`);
  return parts.join(", ");
}

/**
 * Умова видимості події на публічній сторінці.
 *
 * Одноразова зникає після своєї дати. Регулярна — ні: група, що почалася
 * місяць тому і триває, має лишатися на сайті, інакше фільтр за startsAt
 * ховав би саме те, до чого ще можна приєднатися.
 */
export function upcomingEventFilter(now: Date = new Date()) {
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
