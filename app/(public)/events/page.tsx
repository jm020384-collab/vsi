import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Monitor, Users, Wallet } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { EVENTS, FORMAT_LABEL } from "@/components/preview/vsi/data";
import { EventInterestButtons } from "@/components/preview/vsi/event-interest-buttons";
import { ink } from "@/components/preview/vsi/theme";

export const metadata: Metadata = {
  title: "Події",
  description: "Групи, семінари та інтенсиви VSI: робота, яка можлива тільки разом.",
};

const EVENT_TYPE_LABEL: Record<string, string> = {
  LECTURE: "Лекція",
  SEMINAR: "Семінар",
  CONFERENCE: "Конференція",
  SUPERVISION_GROUP: "Супервізійна група",
  INTERVISION_GROUP: "Інтервізійна група",
  READING_GROUP: "Читацька група",
  TRAINING_PROGRAM: "Навчальна програма",
  WORKSHOP: "Воркшоп",
};

const REAL_FORMAT: Record<"ONLINE" | "OFFLINE" | "BOTH", "online" | "offline" | "both"> = {
  ONLINE: "online",
  OFFLINE: "offline",
  BOTH: "both",
};

interface EventViewModel {
  id: string;
  slug: string | null;
  isReal: boolean;
  typeLabel: string;
  title: string;
  description: string;
  imageUrl: string | null;
  dateLabel: string;
  format: "online" | "offline" | "both";
  seatsLeft: number | null;
  seatsTotal: number | null;
  leadLabel: string;
  leadSlug: string | null;
  myStatus: "SAVED" | "REGISTERED" | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  price: number | null;
}

async function loadEvents(): Promise<{ events: EventViewModel[]; isLoggedIn: boolean }> {
  const session = await auth();
  const isProfessional = session?.user.role === "THERAPIST" || session?.user.role === "ADMIN";

  const real = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startsAt: { gte: new Date() },
      // Події для фахівців ховаємо від неавторизованих і клієнтів —
      // audience: "PROFESSIONALS" видно лише THERAPIST/ADMIN.
      ...(isProfessional ? {} : { audience: { not: "PROFESSIONALS" } }),
    },
    include: {
      host: { select: { fullName: true, slug: true } },
      registrations: session?.user ? { where: { userId: session.user.id } } : false,
      _count: { select: { registrations: { where: { status: "REGISTERED" } } } },
    },
    orderBy: { startsAt: "asc" },
  });

  const realVms: EventViewModel[] = real.map((e) => ({
    id: e.id,
    slug: e.slug,
    isReal: true,
    typeLabel: EVENT_TYPE_LABEL[e.type] ?? e.type,
    title: e.title,
    description: e.description,
    imageUrl: e.imageUrl,
    dateLabel: e.startsAt.toLocaleString("uk-UA", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    }),
    format: REAL_FORMAT[e.format],
    seatsLeft: e.seatsTotal ? Math.max(0, e.seatsTotal - e._count.registrations) : null,
    seatsTotal: e.seatsTotal,
    leadLabel: e.host?.fullName ?? "VSI",
    leadSlug: e.host?.slug ?? null,
    myStatus: (Array.isArray(e.registrations) ? e.registrations[0]?.status : null) ?? null,
    contactName: e.contactName,
    contactEmail: e.contactEmail,
    contactPhone: e.contactPhone,
    price: e.price,
  }));

  const demoVms: EventViewModel[] = EVENTS.map((e) => ({
    id: e.id,
    slug: null,
    isReal: false,
    typeLabel: e.type,
    title: e.title,
    description: e.description,
    imageUrl: null,
    dateLabel: e.date,
    format: e.format,
    seatsLeft: e.seatsLeft,
    seatsTotal: e.seatsTotal,
    leadLabel: e.lead,
    leadSlug: null,
    myStatus: null,
    contactName: null,
    contactEmail: null,
    contactPhone: null,
    price: null,
  }));

  return { events: [...realVms, ...demoVms], isLoggedIn: !!session?.user };
}

export default async function EventsPage() {
  const { events, isLoggedIn } = await loadEvents();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-2xl pt-10 text-center lg:pt-14">
        <Image
          src="/brand/motifs/community.png"
          alt=""
          aria-hidden
          width={112}
          height={112}
          priority
          className="mx-auto h-24 w-24 rounded-2xl border border-[#142744]/10 object-cover sm:h-28 sm:w-28"
        />
        <p className="mt-6 inline-flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
          Події
          <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
        </p>
        <h1
          className={`mt-5 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Групи, семінари, інтенсиви
        </h1>
        <p className={`mx-auto mt-5 max-w-lg text-pretty text-[16px] leading-relaxed ${ink.muted}`}>
          Групове поле показує те, що в індивідуальній роботі лишається непоміченим: як ви входите в
          контакт, коли поруч кілька людей.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-2">
        {events.map((e) => {
          const full = e.seatsLeft === 0;
          const pct =
            e.seatsTotal && e.seatsLeft !== null
              ? Math.round(((e.seatsTotal - e.seatsLeft) / e.seatsTotal) * 100)
              : null;
          return (
            <li
              key={e.id}
              id={e.slug ?? undefined}
              className="flex scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]"
            >
              {e.imageUrl && (
                <div className="relative h-40 w-full shrink-0 bg-[#F8F4EC]">
                  <Image
                    src={e.imageUrl}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[#1C3557]">
                    {e.typeLabel}
                  </span>
                  {e.seatsTotal !== null &&
                    e.seatsLeft !== null &&
                    (full ? (
                      <span className="text-xs font-medium text-[#8A4B33]">Місць немає</span>
                    ) : (
                      <span className="text-xs font-medium text-[#245A41]">
                        Вільно {e.seatsLeft} з {e.seatsTotal}
                      </span>
                    ))}
                </div>

                <h2
                  className={cn("mt-3 text-2xl font-normal leading-snug", ink.strong)}
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {e.title}
                </h2>
                <p className={cn("mt-2 flex-1 text-[15px] leading-relaxed", ink.muted)}>
                  {e.description}
                </p>

                <dl className={cn("mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm", ink.body)}>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Дата</dt>
                    <CalendarDays className="h-4 w-4 text-[#5C6672]" aria-hidden />
                    <dd>{e.dateLabel}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Формат</dt>
                    {e.format === "offline" ? (
                      <MapPin className="h-4 w-4 text-[#5C6672]" aria-hidden />
                    ) : (
                      <Monitor className="h-4 w-4 text-[#5C6672]" aria-hidden />
                    )}
                    <dd>{FORMAT_LABEL[e.format]}</dd>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <dt className="sr-only">Ведучий</dt>
                    <Users className="h-4 w-4 text-[#5C6672]" aria-hidden />
                    <dd>
                      {e.leadSlug ? (
                        <Link href={`/specialists/${e.leadSlug}`} className="hover:underline">
                          {e.leadLabel}
                        </Link>
                      ) : (
                        e.leadLabel
                      )}
                    </dd>
                  </div>
                  {e.price !== null && (
                    <div className="flex items-center gap-1.5">
                      <dt className="sr-only">Вартість</dt>
                      <Wallet className="h-4 w-4 text-[#5C6672]" aria-hidden />
                      <dd>{e.price === 0 ? "Безкоштовно" : `${e.price} грн`}</dd>
                    </div>
                  )}
                </dl>

                {(e.contactName || e.contactEmail) && (
                  <p className={cn("mt-3 text-[13px]", ink.soft)}>
                    Питання про подію: {e.contactName}
                    {e.contactName && e.contactEmail && " · "}
                    {e.contactEmail && (
                      <a href={`mailto:${e.contactEmail}`} className="underline">
                        {e.contactEmail}
                      </a>
                    )}
                    {e.contactPhone && ` · ${e.contactPhone}`}
                  </p>
                )}

                {pct !== null && (
                  <div
                    className="mt-4 h-1 w-full overflow-hidden rounded-full bg-[#142744]/[0.09]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Заповненість: ${pct}%`}
                  >
                    <div
                      className={cn("h-full rounded-full", full ? "bg-[#B8785E]" : "bg-[#B38B49]")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}

                {e.isReal && (
                  <EventInterestButtons
                    eventId={e.id}
                    initialStatus={e.myStatus}
                    isLoggedIn={isLoggedIn}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
