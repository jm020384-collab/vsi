import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, BadgeCheck, Clock, FileText, Inbox } from "lucide-react";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { focusRing, ink } from "@/components/preview/vsi/theme";

const STATUS_LABEL: Record<"DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED", string> = {
  DRAFT: "Чернетка",
  PENDING: "На розгляді",
  APPROVED: "Опубліковано",
  REJECTED: "Відхилено",
  SUSPENDED: "Призупинено",
};

const STATUS_NOTE: Record<keyof typeof STATUS_LABEL, string> = {
  DRAFT: "Заповніть профіль і завантажте документи для верифікації.",
  PENDING: "Адміністратор перевіряє ваші документи. Це може зайняти кілька днів.",
  APPROVED: "Профіль опубліковано в каталозі.",
  REJECTED: "Профіль відхилено. Перевірте коментар адміністратора.",
  SUSPENDED: "Профіль тимчасово призупинено.",
};

const STATUS_TONE: Record<keyof typeof STATUS_LABEL, string> = {
  DRAFT: "bg-[#29323B]/[0.07] text-[#4A5568]",
  PENDING: "bg-[#B38B49]/[0.14] text-[#876428]",
  APPROVED: "bg-[#2F6B4F]/[0.1] text-[#245A41]",
  REJECTED: "bg-[#8A4B33]/[0.1] text-[#8A4B33]",
  SUSPENDED: "bg-[#8A4B33]/[0.1] text-[#8A4B33]",
};

function Tile({
  title,
  href,
  cta,
  children,
}: {
  title: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6">
      <h2 className={cn("text-sm font-medium uppercase tracking-[0.1em]", ink.soft)}>{title}</h2>
      <div className="mt-3 flex-1">{children}</div>
      <Link
        href={href}
        className={cn(
          "group/cta mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#1C3557]",
          "transition-colors hover:text-[#142744] motion-reduce:transition-none",
          focusRing,
        )}
      >
        {cta}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
          aria-hidden
        />
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    include: { documents: true },
  });

  const requestsCount = therapist
    ? await prisma.contactRequest.count({ where: { therapistId: therapist.id, status: "NEW" } })
    : 0;

  const articlesCount = await prisma.article.count({ where: { authorId: session.user.id } });

  const pendingDocs = therapist
    ? therapist.documents.filter((d) => d.status === "PENDING").length
    : 0;

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">Огляд</p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Ваш професійний простір у VSI
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Профіль, публікації, звернення та професійний розвиток в одному середовищі.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          title="Статус профілю"
          href="/dashboard/profile"
          cta={therapist ? "Редагувати профіль" : "Створити профіль"}
        >
          {therapist ? (
            <>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  STATUS_TONE[therapist.status],
                )}
              >
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {STATUS_LABEL[therapist.status]}
              </span>
              <p className={cn("mt-3 text-[14px] leading-relaxed", ink.soft)}>
                {STATUS_NOTE[therapist.status]}
              </p>
              {(therapist.status === "REJECTED" || therapist.status === "SUSPENDED") &&
                therapist.reviewNote && (
                  <p className={cn("mt-2 text-[14px] italic leading-relaxed", ink.muted)}>
                    «{therapist.reviewNote}»
                  </p>
                )}
            </>
          ) : (
            <p className={cn("text-[14px] leading-relaxed", ink.soft)}>
              У вас ще немає профілю фахівця.
            </p>
          )}
        </Tile>

        <Tile title="Нові звернення" href="/dashboard/requests" cta="Переглянути">
          <div className={cn("flex items-center gap-2 text-3xl font-normal", ink.strong)}>
            <Inbox className="h-6 w-6 text-[#5C6672]" aria-hidden />
            {requestsCount}
          </div>
          <p className={cn("mt-1 text-[14px]", ink.soft)}>непрочитаних</p>
        </Tile>

        <Tile title="Публікації" href="/dashboard/articles" cta="Мої тексти">
          <div className={cn("flex items-center gap-2 text-3xl font-normal", ink.strong)}>
            <FileText className="h-6 w-6 text-[#5C6672]" aria-hidden />
            {articlesCount}
          </div>
          <p className={cn("mt-1 text-[14px]", ink.soft)}>
            {articlesCount === 0 ? "текстів поки немає" : "опублікованих і чернеток"}
          </p>
        </Tile>

        {therapist && pendingDocs > 0 && (
          <Tile title="Кваліфікації" href="/dashboard/qualifications" cta="Переглянути">
            <div className={cn("flex items-center gap-2 text-3xl font-normal", ink.strong)}>
              <Clock className="h-6 w-6 text-[#5C6672]" aria-hidden />
              {pendingDocs}
            </div>
            <p className={cn("mt-1 text-[14px]", ink.soft)}>на розгляді</p>
          </Tile>
        )}
      </div>
    </div>
  );
}
