import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { focusRing, ink } from "@/components/preview/vsi/theme";
import { EventComposer } from "@/components/dashboard/event-composer";

export const metadata: Metadata = { title: "Редагування події · Кабінет фахівця" };

/**
 * Дата для input[type=datetime-local] береться в тому ж поясі, в якому
 * вона й показується у списку — тобто локальному для сервера. Якби ми
 * взяли UTC, збережений час зсувався б на кожному редагуванні.
 */
function toDateTimeLocal(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/** Те саме для input[type=date] — лише дата, без часу. */
function toDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: { host: { select: { userId: true } } },
  });

  // Чужу подію не показуємо навіть у режимі перегляду: 404, а не «немає прав»,
  // щоб не підтверджувати саме існування чужого запису.
  if (!event?.host || event.host.userId !== session.user.id) notFound();

  return (
    <div>
      <Link
        href="/dashboard/events"
        className={cn(
          "inline-flex items-center gap-1.5 text-[13px] text-[#1C3557] hover:text-[#142744]",
          focusRing,
        )}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        До моїх подій
      </Link>

      <h1
        className={cn("mt-4 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Редагування події
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Зміни зʼявляються на сторінці подій одразу. Ті, хто вже записався, лишаються записаними.
      </p>

      <EventComposer
        initial={{
          id: event.id,
          title: event.title,
          description: event.description,
          imageUrl: event.imageUrl,
          type: event.type,
          format: event.format,
          startsAt: toDateTimeLocal(event.startsAt),
          recurrence: event.recurrence,
          recurrenceEndsAt: event.recurrenceEndsAt ? toDateOnly(event.recurrenceEndsAt) : null,
          seatsTotal: event.seatsTotal,
          audience: event.audience,
          price: event.price,
          contactName: event.contactName,
          contactEmail: event.contactEmail,
          contactPhone: event.contactPhone,
        }}
      />
    </div>
  );
}
