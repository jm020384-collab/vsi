import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { EventComposer } from "@/components/dashboard/event-composer";
import { EventDeleteButton } from "@/components/dashboard/event-delete-button";

export const metadata: Metadata = { title: "Події · Кабінет фахівця" };

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

export default async function DashboardEventsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  const events = therapist
    ? await prisma.event.findMany({
        where: { hostId: therapist.id },
        orderBy: { startsAt: "desc" },
        include: {
          _count: { select: { registrations: { where: { status: "REGISTERED" } } } },
          registrations: {
            where: { status: "REGISTERED" },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" },
          },
        },
      })
    : [];

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">Події</p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Мої події
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Лекції, семінари, супервізійні та інтервізійні групи — публікуються одразу, без модерації.
      </p>

      {!therapist ? (
        <p className={cn("mt-8 text-[15px]", ink.muted)}>
          Спершу заповніть{" "}
          <a href="/dashboard/profile" className="underline">
            анкету профілю
          </a>
          .
        </p>
      ) : (
        <>
          {events.length > 0 && (
            <ul className="mt-8 space-y-3">
              {events.map((e) => (
                <li key={e.id} className="rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      {e.imageUrl && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F8F4EC]">
                          <Image
                            src={e.imageUrl}
                            alt=""
                            aria-hidden
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="inline-flex items-center rounded-full bg-[#1C3557]/[0.08] px-2.5 py-1 font-medium text-[#1C3557]">
                            {EVENT_TYPE_LABEL[e.type]}
                          </span>
                          <span className={ink.soft}>
                            {e._count.registrations} записаних
                            {e.seatsTotal ? ` з ${e.seatsTotal}` : ""}
                          </span>
                        </div>
                        <h2
                          className={cn("mt-1.5 truncate text-lg font-normal", ink.strong)}
                          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                        >
                          {e.title}
                        </h2>
                        <p className={cn("mt-0.5 flex items-center gap-1.5 text-[13px]", ink.soft)}>
                          <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                          {e.startsAt.toLocaleString("uk-UA", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <EventDeleteButton eventId={e.id} />
                  </div>

                  {e.registrations.length > 0 && (
                    <div className="mt-4 border-t border-[#142744]/[0.07] pt-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#5C6672]">
                        Зареєстровані
                      </p>
                      <ul className="mt-2 space-y-1">
                        {e.registrations.map((r) => (
                          <li key={r.id} className="flex flex-wrap items-baseline gap-x-2 text-sm">
                            <span className={ink.body}>
                              {r.user?.name ?? r.guestName ?? "Без імені"}
                            </span>
                            <span className={cn("text-[13px]", ink.soft)}>
                              {r.user?.email ?? r.guestEmail}
                              {r.guestPhone ? ` · ${r.guestPhone}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}

          <EventComposer />
        </>
      )}
    </div>
  );
}
