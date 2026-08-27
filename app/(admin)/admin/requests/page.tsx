import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Звернення · Адмін-панель" };

const STATUS_LABEL: Record<"NEW" | "VIEWED" | "REPLIED" | "CLOSED", string> = {
  NEW: "Нове",
  VIEWED: "Переглянуто",
  REPLIED: "Відповідано",
  CLOSED: "Опрацьовано",
};

const STATUS_VARIANT: Record<keyof typeof STATUS_LABEL, "warning" | "secondary" | "success"> = {
  NEW: "warning",
  VIEWED: "secondary",
  REPLIED: "secondary",
  CLOSED: "success",
};

export default async function AdminRequestsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const requests = await prisma.contactRequest.findMany({
    include: { therapist: { select: { fullName: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold">Звернення</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {requests.length === 0 ? "Звернень ще немає." : `Усього звернень: ${requests.length}`}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Копія всіх звернень клієнтів до фахівців — хто, до кого і з чим звернувся.
      </p>

      {requests.length > 0 && (
        <ul className="mt-8 space-y-4">
          {requests.map((r) => (
            <li key={r.id}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">{r.patientName}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-medium">{r.therapist.fullName}</span>
                      <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {r.createdAt.toLocaleString("uk-UA")}
                    </span>
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">
                    {r.patientEmail}
                    {r.patientPhone && ` · ${r.patientPhone}`}
                    {r.preferredTime && ` · Бажаний час: ${r.preferredTime}`}
                  </div>
                  <p className="mt-3 whitespace-pre-line text-sm">{r.message}</p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
