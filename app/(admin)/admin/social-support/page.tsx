import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { DayPart, SessionFormat, Weekday } from "@prisma/client";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SocialStatusSelect } from "@/components/admin/social-status-select";
import {
  APPLICANT_FORMAT_LABEL,
  DAY_PARTS,
  SOCIAL_STATUS_LABEL,
  THERAPIST_FORMAT_LABEL,
  WEEKDAYS,
  dayPartLabels,
  formatSocialAmount,
  weekdayLabels,
} from "@/lib/social-support";

export const metadata: Metadata = { title: "Соціальна підтримка · Адмін-панель" };

// Список залежить від заявок і від перемикачів фахівців — завжди свіжі дані.
export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function AdminSocialSupportPage({ searchParams }: { searchParams: Search }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const sp = await searchParams;
  const tab = one(sp.tab) === "specialists" ? "specialists" : "requests";
  const fLang = one(sp.lang);
  const fFormat = one(sp.format);
  const fDay = one(sp.day);
  const fPart = one(sp.part);
  const fSpec = one(sp.spec);

  const [requests, languages, specializations] = await Promise.all([
    tab === "requests"
      ? prisma.socialSupportRequest.findMany({
          include: { language: { select: { nameUk: true } } },
          orderBy: { createdAt: "desc" },
          take: 200,
        })
      : Promise.resolve([]),
    prisma.language.findMany({ select: { code: true, nameUk: true } }),
    prisma.specialization.findMany({
      select: { id: true, nameUk: true },
      orderBy: { nameUk: "asc" },
    }),
  ]);

  const specialists =
    tab === "specialists"
      ? await prisma.therapistProfile.findMany({
          where: {
            participatesInSocialSupport: true,
            deletedAt: null,
            ...(fLang ? { languages: { some: { languageCode: fLang } } } : {}),
            ...(fFormat ? { sessionFormat: fFormat as SessionFormat } : {}),
            ...(fDay ? { socialSupportDays: { has: fDay as Weekday } } : {}),
            ...(fPart ? { socialSupportDayParts: { has: fPart as DayPart } } : {}),
            ...(fSpec ? { specializations: { some: { specializationId: fSpec } } } : {}),
          },
          select: {
            id: true,
            slug: true,
            fullName: true,
            city: true,
            status: true,
            sessionFormat: true,
            socialSupportDays: true,
            socialSupportDayParts: true,
            socialSupportMinRate: true,
            socialSupportCurrency: true,
            contactEmail: true,
            languages: { include: { language: { select: { nameUk: true } } } },
            specializations: { include: { specialization: { select: { nameUk: true } } } },
          },
          orderBy: { fullName: "asc" },
        })
      : [];

  const tabHref = (t: string) =>
    t === "requests" ? "/admin/social-support" : `/admin/social-support?tab=${t}`;

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-semibold">Соціальна підтримка</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Заявки людей і фахівці, які добровільно долучилися до програми. Підбір — ручний:
        автоматичного зіставлення тут навмисно немає.
      </p>

      <div className="mt-6 flex gap-2 border-b">
        {[
          { id: "requests", label: "Заявки" },
          { id: "specialists", label: "Фахівці програми" },
        ].map((t) => (
          <Link
            key={t.id}
            href={tabHref(t.id)}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm",
              tab === t.id
                ? "border-foreground font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "requests" ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {requests.length === 0 ? "Заявок ще немає." : `Усього заявок: ${requests.length}`}
          </p>
          <ul className="mt-4 space-y-4">
            {requests.map((r) => (
              <li key={r.id}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className="font-medium">{r.name}</span>
                        <Badge variant="secondary">{SOCIAL_STATUS_LABEL[r.status]}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {r.createdAt.toLocaleString("uk-UA")}
                        </span>
                        <SocialStatusSelect requestId={r.id} initial={r.status} />
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      {r.email} · {r.contact} · {r.country}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {r.age} р. · {r.gender} · {APPLICANT_FORMAT_LABEL[r.format]} ·{" "}
                      {r.language?.nameUk ?? "мова не має значення"}
                    </div>

                    <p className="mt-3 whitespace-pre-line text-sm">{r.request}</p>

                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Бюджет:</dt>
                        <dd className="font-medium">
                          {formatSocialAmount(r.budgetMinor, r.budgetCurrency)}
                        </dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Дні:</dt>
                        <dd>{weekdayLabels(r.days)}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Час:</dt>
                        <dd>{dayPartLabels(r.dayParts)}</dd>
                      </div>
                    </dl>
                    {r.availabilityNote && (
                      <p className="mt-1.5 text-xs text-muted-foreground">{r.availabilityNote}</p>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <form method="get" className="mt-6 flex flex-wrap gap-2">
            <input type="hidden" name="tab" value="specialists" />
            <select
              name="lang"
              defaultValue={fLang}
              aria-label="Мова"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Будь-яка мова</option>
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nameUk}
                </option>
              ))}
            </select>
            <select
              name="spec"
              defaultValue={fSpec}
              aria-label="Спеціалізація"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Будь-яка спеціалізація</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameUk}
                </option>
              ))}
            </select>
            <select
              name="format"
              defaultValue={fFormat}
              aria-label="Формат"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Будь-який формат</option>
              <option value="ONLINE">Онлайн</option>
              <option value="OFFLINE">Очно</option>
              <option value="BOTH">Онлайн і очно</option>
            </select>
            <select
              name="day"
              defaultValue={fDay}
              aria-label="День"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Будь-який день</option>
              {WEEKDAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <select
              name="part"
              defaultValue={fPart}
              aria-label="Час"
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              <option value="">Будь-який час</option>
              {DAY_PARTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <button type="submit" className="h-9 rounded-md border px-3 text-sm font-medium">
              Застосувати
            </button>
            <Link
              href="/admin/social-support?tab=specialists"
              className="flex h-9 items-center px-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Скинути
            </Link>
          </form>

          <p className="mt-4 text-sm text-muted-foreground">
            {specialists.length === 0
              ? "Під ці умови не підпадає жоден фахівець програми."
              : `Знайдено фахівців: ${specialists.length}`}
          </p>

          <ul className="mt-4 space-y-4">
            {specialists.map((s) => (
              <li key={s.id}>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link
                        href={`/specialists/${s.slug}`}
                        className="text-sm font-medium hover:underline"
                      >
                        {s.fullName}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {s.city} · {THERAPIST_FORMAT_LABEL[s.sessionFormat]}
                        {s.status !== "APPROVED" && " · профіль не опубліковано"}
                      </span>
                    </div>

                    <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Дні:</dt>
                        <dd>{weekdayLabels(s.socialSupportDays)}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Час:</dt>
                        <dd>{dayPartLabels(s.socialSupportDayParts)}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-muted-foreground">Мінімальна ставка:</dt>
                        <dd className="font-medium">
                          {s.socialSupportMinRate == null
                            ? "не вказана"
                            : formatSocialAmount(
                                s.socialSupportMinRate,
                                s.socialSupportCurrency ?? "UAH",
                              )}
                        </dd>
                      </div>
                      {s.contactEmail && (
                        <div className="flex gap-1.5">
                          <dt className="text-muted-foreground">Пошта:</dt>
                          <dd>{s.contactEmail}</dd>
                        </div>
                      )}
                    </dl>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {s.languages.map((l) => l.language.nameUk).join(", ") || "мови не вказані"}
                      {" · "}
                      {s.specializations.map((x) => x.specialization.nameUk).join(", ") ||
                        "теми не вказані"}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
