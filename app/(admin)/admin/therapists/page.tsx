import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { TherapistReviewCard } from "@/components/admin/therapist-review-card";
import { TherapistStatusRow } from "@/components/admin/therapist-status-row";

export const metadata: Metadata = { title: "Фахівці · Адмін-панель" };

export default async function AdminTherapistsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [pending, active, suspended] = await Promise.all([
    prisma.therapistProfile.findMany({
      where: { status: "PENDING", deletedAt: null },
      include: {
        user: { select: { email: true } },
        documents: { orderBy: { createdAt: "desc" } },
        specializations: { include: { specialization: true } },
        languages: { include: { language: true } },
      },
      orderBy: { publishedAt: "asc" },
    }),
    prisma.therapistProfile.findMany({
      where: { status: "APPROVED", deletedAt: null },
      select: { id: true, fullName: true, city: true, user: { select: { email: true } } },
      orderBy: { fullName: "asc" },
    }),
    prisma.therapistProfile.findMany({
      where: { status: "SUSPENDED", deletedAt: null },
      select: { id: true, fullName: true, city: true, user: { select: { email: true } } },
      orderBy: { fullName: "asc" },
    }),
  ]);

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-semibold">Фахівці</h1>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">На модерації</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {pending.length === 0
            ? "Немає анкет, що очікують розгляду."
            : `Анкет, що очікують розгляду: ${pending.length}`}
        </p>

        <div className="mt-6 flex flex-col gap-6">
          {pending.map((t) => (
            <TherapistReviewCard
              key={t.id}
              therapist={{
                id: t.id,
                fullName: t.fullName,
                email: t.user.email,
                city: t.city,
                yearsExperience: t.yearsExperience,
                sessionFormat: t.sessionFormat,
                contactEmail: t.contactEmail,
                contactPhone: t.contactPhone,
                bio: t.bio,
                professionalTitle: t.professionalTitle,
                analyticalOrientation: t.analyticalOrientation,
                ageGroups: t.ageGroups,
                workFormats: t.workFormats,
                professionalInterests: t.professionalInterests,
                associations: t.associations,
                supervisionStatus: t.supervisionStatus,
                personalTherapyStatus: t.personalTherapyStatus,
                specializations: t.specializations.map((s) => s.specialization.nameUk),
                languages: t.languages.map((l) => l.language.nameUk),
                submittedAt: (t.publishedAt ?? t.createdAt).toISOString(),
                documents: t.documents.map((d) => ({
                  id: d.id,
                  fileName: d.fileName,
                  fileUrl: d.fileUrl,
                  docType: d.docType,
                  status: d.status,
                })),
              }}
            />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold">Активні профілі</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {active.length === 0 ? "Немає активних профілів." : `Активних: ${active.length}`}
        </p>

        {active.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <ul>
                {active.map((t) => (
                  <TherapistStatusRow
                    key={t.id}
                    id={t.id}
                    fullName={t.fullName}
                    email={t.user.email}
                    city={t.city}
                    mode="active"
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </section>

      {suspended.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold">Призупинені профілі</h2>
          <p className="mt-1 text-sm text-muted-foreground">Призупинених: {suspended.length}</p>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <ul>
                {suspended.map((t) => (
                  <TherapistStatusRow
                    key={t.id}
                    id={t.id}
                    fullName={t.fullName}
                    email={t.user.email}
                    city={t.city}
                    mode="suspended"
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
