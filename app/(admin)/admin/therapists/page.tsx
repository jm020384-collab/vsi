import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { TherapistReviewCard } from "@/components/admin/therapist-review-card";
import { TherapistStatusRow } from "@/components/admin/therapist-status-row";
import { DocumentReviewRow } from "@/components/admin/document-review-row";

function yearsLabel(from: number | null, to: number | null) {
  if (from && to) return from === to ? `${from}` : `${from}–${to}`;
  return from ? `з ${from}` : to ? `${to}` : null;
}

export const metadata: Metadata = { title: "Фахівці · Адмін-панель" };

export default async function AdminTherapistsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [pending, active, suspended, documents] = await Promise.all([
    prisma.therapistProfile.findMany({
      where: { status: "PENDING", deletedAt: null },
      include: {
        user: { select: { email: true, emailVerified: true, createdAt: true, lastLoginAt: true } },
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
    // Лише записи з файлом: текстовий опис навчання перевіряти нічим.
    prisma.verificationDocument.findMany({
      where: {
        OR: [{ fileUrl: { not: null } }, { fileKey: { not: null } }],
        therapist: { deletedAt: null, status: { in: ["PENDING", "APPROVED"] } },
      },
      select: {
        id: true,
        fileUrl: true,
        fileName: true,
        status: true,
        createdAt: true,
        institution: true,
        yearFrom: true,
        yearTo: true,
        entry: { select: { title: true, institution: true, startYear: true, endYear: true } },
        therapist: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Групуємо за фахівцем; ті, у кого є неперевірене, — нагорі.
  const byTherapist = new Map<string, { fullName: string; docs: typeof documents }>();
  for (const d of documents) {
    const group = byTherapist.get(d.therapist.id) ?? { fullName: d.therapist.fullName, docs: [] };
    group.docs.push(d);
    byTherapist.set(d.therapist.id, group);
  }
  const waiting = (g: { docs: typeof documents }) =>
    g.docs.filter((d) => d.status === "PENDING").length;
  const documentGroups = [...byTherapist.entries()].sort(
    ([, a], [, b]) => waiting(b) - waiting(a) || a.fullName.localeCompare(b.fullName, "uk"),
  );
  const waitingTotal = documents.filter((d) => d.status === "PENDING").length;

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
                emailVerified: !!t.user.emailVerified,
                registeredAt: t.user.createdAt.toISOString(),
                lastLoginAt: t.user.lastLoginAt?.toISOString() ?? null,
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
                  institution: d.institution,
                  specialization: d.specialization,
                  yearFrom: d.yearFrom,
                  yearTo: d.yearTo,
                  inProgress: d.inProgress,
                })),
              }}
            />
          ))}
        </div>
      </section>

      {/*
        Перевірка дипломів окремо від схвалення анкети: файли додають і
        вже схвалені фахівці, а позначка «Документ перевірено VSI» у
        публічному профілі з'являється лише після рішення тут.
      */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold">Документи про освіту</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {documents.length === 0
            ? "Фахівці ще не завантажували файлів."
            : `Очікують перевірки: ${waitingTotal} із ${documents.length}. Файли бачите лише ви — у профілі з'являється тільки позначка.`}
        </p>

        {documentGroups.map(([therapistId, group]) => (
          <Card key={therapistId} className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-sm font-semibold">{group.fullName}</h3>
              <ul className="mt-1">
                {group.docs.map((d) => (
                  <DocumentReviewRow
                    key={d.id}
                    doc={{
                      id: d.id,
                      label:
                        d.entry?.title ??
                        d.entry?.institution ??
                        d.institution ??
                        d.fileName ??
                        "Документ",
                      attached: !!d.entry,
                      detail: d.entry
                        ? [
                            d.entry.title ? d.entry.institution : null,
                            yearsLabel(d.entry.startYear, d.entry.endYear),
                          ]
                            .filter(Boolean)
                            .join(" · ") || null
                        : yearsLabel(d.yearFrom, d.yearTo),
                      fileUrl: d.fileUrl,
                      fileName: d.fileName,
                      status: d.status,
                      uploadedAt: d.createdAt.toISOString(),
                    }}
                  />
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
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
