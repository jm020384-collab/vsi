import { prisma } from "@/lib/db";
import type { Format, PublicEvent } from "@/components/preview/vsi/data";
import { registrationClosedReason } from "@/lib/event-registration";
import { dayLabel, scheduleLabel, upcomingEventFilter } from "@/lib/event-recurrence";

export const EVENT_TYPE_LABEL: Record<string, string> = {
  LECTURE: "Лекція",
  SEMINAR: "Семінар",
  CONFERENCE: "Конференція",
  SUPERVISION_GROUP: "Супервізійна група",
  INTERVISION_GROUP: "Інтервізійна група",
  READING_GROUP: "Читацька група",
  TRAINING_PROGRAM: "Навчальна програма",
  WORKSHOP: "Воркшоп",
};

export const EVENT_FORMAT: Record<"ONLINE" | "OFFLINE" | "BOTH", Format> = {
  ONLINE: "online",
  OFFLINE: "offline",
  BOTH: "both",
};

/**
 * Найближчі публічні події — єдине джерело подій на головній і на
 * сторінках тем.
 *
 * Раніше до справжніх підмішувалися вигадані групи й семінари з data.ts
 * (ведучі Левченко, Ткаченко), тож люди бачили події, яких не існує.
 * Події «для фахівців» сюди не потрапляють: ці сторінки бачать усі.
 *
 * День і місяць для плитки дати є лише в одноразових подій. У регулярної
 * групи «дата» — це початок серії, а не наступна зустріч, тож замість
 * числа показуємо розклад («Щосереди»).
 */
export async function loadUpcomingEvents(): Promise<PublicEvent[]> {
  const rows = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      audience: { not: "PROFESSIONALS" },
      ...upcomingEventFilter(),
    },
    include: {
      host: { select: { fullName: true } },
      _count: { select: { registrations: { where: { status: "REGISTERED" } } } },
    },
    orderBy: { startsAt: "asc" },
  });

  return rows.map((e) => {
    const dateLabel = scheduleLabel(e);
    const once = e.recurrence === "ONCE";
    const [day, month] = once ? dayLabel(e.startsAt).split(" ") : [];

    return {
      id: e.id,
      slug: e.slug,
      typeLabel: EVENT_TYPE_LABEL[e.type] ?? e.type,
      title: e.title,
      description: e.description,
      dateLabel,
      day,
      month,
      // «Щосереди о 18:30, з 20 вересня» → «Щосереди»
      shortWhen: dateLabel.split(/,| о /)[0] ?? dateLabel,
      format: EVENT_FORMAT[e.format],
      seatsTotal: e.seatsTotal,
      seatsLeft: e.seatsTotal ? Math.max(0, e.seatsTotal - e._count.registrations) : null,
      closedReason: registrationClosedReason(e, e._count.registrations),
      lead: e.host?.fullName ?? "VSI",
    };
  });
}
