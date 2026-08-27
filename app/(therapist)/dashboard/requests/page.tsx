import { redirect } from "next/navigation";
import { Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { RequestCloseButton } from "@/components/dashboard/request-close-button";

const STATUS_LABEL: Record<"NEW" | "VIEWED" | "REPLIED" | "CLOSED", string> = {
  NEW: "Нове",
  VIEWED: "Переглянуто",
  REPLIED: "Відповідано",
  CLOSED: "Опрацьовано",
};

const STATUS_TONE: Record<keyof typeof STATUS_LABEL, string> = {
  NEW: "bg-[#B38B49]/[0.14] text-[#876428]",
  VIEWED: "bg-[#1C3557]/[0.08] text-[#1C3557]",
  REPLIED: "bg-[#1C3557]/[0.08] text-[#1C3557]",
  CLOSED: "bg-[#29323B]/[0.07] text-[#4A5568]",
};

export default async function RequestsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  // Відкриття списку саме і є «переглядом» — фіксуємо це до вибірки,
  // щоб перший рендер уже показував актуальний статус.
  if (therapist) {
    await prisma.contactRequest.updateMany({
      where: { therapistId: therapist.id, status: "NEW" },
      data: { status: "VIEWED" },
    });
  }

  const requests = therapist
    ? await prisma.contactRequest.findMany({
        where: { therapistId: therapist.id },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
    : [];

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
        Звернення
      </p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Перше знайомство
      </h1>
      <p className={cn("mt-3 max-w-md text-[15px] leading-relaxed", ink.muted)}>
        Лише перший контакт — без клінічних нотаток, діагнозів чи записів сесій.
      </p>

      <div className="mt-8">
        {requests.length === 0 ? (
          <div className="border-[#142744]/18 flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-[#FFFDF8]/60 px-6 py-14 text-center">
            <Inbox className="h-7 w-7 text-[#8C93A0]" aria-hidden />
            <p className={cn("text-[15px]", ink.muted)}>Поки немає звернень.</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <li key={r.id} className="rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn("font-medium", ink.strong)}>{r.patientName}</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        STATUS_TONE[r.status],
                      )}
                    >
                      {STATUS_LABEL[r.status]}
                    </span>
                  </div>
                  <span className={cn("text-xs", ink.soft)}>
                    {r.createdAt.toLocaleString("uk-UA")}
                  </span>
                </div>
                <div className={cn("mt-1 text-sm", ink.soft)}>{r.patientEmail}</div>
                {r.preferredTime && (
                  <div className={cn("mt-1 text-xs", ink.soft)}>Бажаний час: {r.preferredTime}</div>
                )}
                <p className={cn("mt-3 whitespace-pre-line text-[15px] leading-relaxed", ink.body)}>
                  {r.message}
                </p>
                {r.status !== "CLOSED" && (
                  <div className="mt-4">
                    <RequestCloseButton requestId={r.id} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
