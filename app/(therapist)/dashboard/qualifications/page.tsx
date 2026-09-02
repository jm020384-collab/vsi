import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { EducationEditor } from "@/components/dashboard/education-editor";

export const metadata: Metadata = { title: "Кваліфікації · Кабінет фахівця" };

export default async function QualificationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    include: { documents: { orderBy: { createdAt: "desc" } } },
  });

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
        Кваліфікації
      </p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Освіта та навчання
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Вища освіта, перепідготовка, курси, майстер-класи, конференції. Скан прикріплювати не
        обов&apos;язково — навчання можна просто описати або позначити як таке, що триває. Самі
        файли не публікуються: вони лише підтверджують кваліфікацію для VSI.
      </p>

      <div className="mt-8 max-w-lg">
        {therapist ? (
          <EducationEditor
            initialItems={therapist.documents.map((d) => ({
              id: d.id,
              fileName: d.fileName,
              docType: d.docType,
              status: d.status,
              reviewNote: d.reviewNote,
              institution: d.institution,
              specialization: d.specialization,
              yearFrom: d.yearFrom,
              yearTo: d.yearTo,
              inProgress: d.inProgress,
            }))}
          />
        ) : (
          <p className={cn("text-[15px]", ink.muted)}>
            Спершу заповніть{" "}
            <a href="/dashboard/profile" className="underline">
              анкету профілю
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
