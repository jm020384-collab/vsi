import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, BadgeCheck, Clock3, GraduationCap, Pencil } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AvatarPortrait } from "@/components/preview/vsi/decor";
import { ContactRequestForm } from "@/components/preview/vsi/contact-request-form";
import { MATERIALS, THERAPISTS, specialistSpace } from "@/components/preview/vsi/data";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Картка «Професійний шлях» — покриває і кураторські дипломи демо-персон
 *  (інституція/роки/спеціальності), і реальні завантажені документи
 *  (назва файлу/тип/статус перевірки) одним виглядом. */
interface DiplomaCard {
  title: string;
  meta?: string;
  tags?: string[];
  reviewStatus?: "pending" | "reviewed";
}

interface TextLink {
  id: string;
  href: string;
  kind: string;
  title: string;
  readingMinutes?: number;
}

interface EventLink {
  id: string;
  href: string;
  title: string;
  dateLabel: string;
}

interface SpaceViewModel {
  name: string;
  status: string;
  photo?: string | null;
  seed: number;
  /** "arch" — портрет вирізаний за формою арки. */
  arch?: boolean;
  verified: boolean;
  topics: string[];
  position: string[];
  practice: string[];
  diplomas: DiplomaCard[];
  path: { period: string; text: string }[];
  research: string[];
  texts: TextLink[];
  events: EventLink[];
  formatLabel: string;
  city?: string | null;
  languages: string[];
  sessionMinutes?: number | null;
  priceFrom: number;
  priceTo?: number | null;
  currency: string;
  website?: string | null;
  socialLinks: string[];
  acceptingNew: boolean;
  isOwner: boolean;
  /** Чи це реальний профіль у базі (можна залишити заявку) чи демо-персона. */
  isReal: boolean;
  acceptsRequestsViaVsi: boolean;
}

const REAL_FORMAT_LABEL: Record<"ONLINE" | "OFFLINE" | "BOTH", string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Онлайн і очно",
};

function seedFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Завантажує вьюмодель: спершу реальний профіль у базі, інакше — демо-персона. */
async function loadSpace(id: string): Promise<SpaceViewModel | null> {
  const session = await auth();

  const real = await prisma.therapistProfile.findUnique({
    where: { slug: id },
    include: {
      specializations: { include: { specialization: true } },
      languages: { include: { language: true } },
      documents: { orderBy: { createdAt: "desc" } },
      user: true,
    },
  });

  if (real) {
    const isOwner = session?.user?.id === real.userId;
    if (real.status !== "APPROVED" && !isOwner) return null;

    const articles = await prisma.article.findMany({
      where: { authorId: real.userId, status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
    });

    const isProfessional = session?.user?.role === "THERAPIST" || session?.user?.role === "ADMIN";
    const events = await prisma.event.findMany({
      where: {
        hostId: real.id,
        status: "PUBLISHED",
        startsAt: { gte: new Date() },
        ...(isProfessional ? {} : { audience: { not: "PROFESSIONALS" } }),
      },
      orderBy: { startsAt: "asc" },
    });

    return {
      name: real.fullName,
      status: real.professionalTitle ?? "Фахівець VSI",
      photo: real.photoUrl,
      seed: seedFromString(real.id),
      verified: real.status === "APPROVED",
      topics: real.specializations.map((s) => s.specialization.nameUk),
      position: real.bio.trim() ? [real.bio.trim()] : [],
      practice: [
        `Формат роботи: ${REAL_FORMAT_LABEL[real.sessionFormat].toLowerCase()}, ${real.city}.` +
          (real.workingHours ? ` Графік: ${real.workingHours}.` : ""),
      ],
      diplomas: real.documents.map((d) => ({
        title: d.fileName,
        meta:
          d.docType === "DIPLOMA"
            ? "Диплом"
            : d.docType === "CERTIFICATE"
              ? "Сертифікат"
              : "Документ",
        reviewStatus: d.status === "VERIFIED" ? "reviewed" : "pending",
      })),
      path: [],
      research: [],
      texts: articles.map((a) => ({
        id: a.id,
        href: `/blog/${a.slug}`,
        kind: "Стаття",
        title: a.title,
        readingMinutes: Math.max(1, Math.round(a.content.split(/\s+/).length / 200)),
      })),
      events: events.map((e) => ({
        id: e.id,
        href: `/events#${e.slug}`,
        title: e.title,
        dateLabel: e.startsAt.toLocaleString("uk-UA", {
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
      formatLabel: REAL_FORMAT_LABEL[real.sessionFormat],
      city: real.city,
      languages: real.languages.map((l) => l.language.nameUk),
      sessionMinutes: null,
      priceFrom: real.priceFrom,
      priceTo: real.priceTo,
      currency: real.currency === "UAH" ? "грн" : real.currency,
      website: real.website,
      socialLinks: real.socialLinks,
      acceptingNew: real.status === "APPROVED" && real.acceptingNewClients,
      isOwner,
      isReal: true,
      acceptsRequestsViaVsi: real.acceptsRequestsViaVsi,
    };
  }

  const t = THERAPISTS.find((x) => x.id === id);
  if (!t) return null;

  const space = specialistSpace(t);
  const texts = MATERIALS.filter((m) => m.author === t.name);

  return {
    name: t.name,
    status: t.status,
    photo: t.photo,
    seed: Number(t.id.slice(1)) || 0,
    arch: t.portraitStyle === "arch",
    verified: t.verified,
    topics: t.topics,
    position: space.position,
    practice: space.practice,
    diplomas: (space.diplomas ?? []).map((d) => ({
      title: d.institution,
      meta: d.years,
      tags: d.specialties,
    })),
    path: space.path,
    research: space.research,
    texts: texts.map((m) => ({
      id: m.id,
      href: `/library/${m.id}`,
      kind: m.kind,
      title: m.title,
      readingMinutes: m.readingMinutes,
    })),
    events: [],
    formatLabel: { online: "Онлайн", offline: "Очно", both: "Онлайн і очно" }[t.format],
    city: t.city,
    languages: t.languages,
    sessionMinutes: t.sessionMinutes,
    priceFrom: t.priceFrom,
    currency: t.currency,
    website: null,
    socialLinks: [],
    acceptingNew: t.acceptingNew,
    isOwner: false,
    isReal: false,
    acceptsRequestsViaVsi: true,
  };
}

export function generateStaticParams() {
  return THERAPISTS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vm = await loadSpace(id);
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!vm) notFound();
  return { title: vm.name, description: vm.status };
}

const SECTIONS = [
  { id: "position", label: "Позиція" },
  { id: "practice", label: "Практика" },
  { id: "texts", label: "Тексти" },
  { id: "events", label: "Події" },
  { id: "research", label: "Досліджую" },
  { id: "path", label: "Професійний шлях" },
  { id: "conditions", label: "Умови роботи" },
  { id: "contact", label: "Контакт" },
] as const;

function SectionTitleRow({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className={`scroll-mt-40 text-2xl font-normal sm:text-3xl ${ink.strong}`}
      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
    >
      {children}
    </h2>
  );
}

/** Чесний плейсхолдер замість вигаданого тексту — коли фахівець ще не наповнив розділ. */
function PendingSection({ children }: { children: React.ReactNode }) {
  return (
    <p
      className={`mt-4 rounded-xl border border-dashed border-[#142744]/15 bg-[#FFFDF8]/70 px-5 py-4 text-[14px] italic ${ink.soft}`}
    >
      {children}
    </p>
  );
}

/**
 * Простір фахівця — не «профіль» і не вітрина.
 *
 * Джерело даних — реальний профіль у базі (якщо slug зареєстрований
 * і опублікований, або якщо переглядає власник) або демо-персона
 * для показу дизайну. Головний розділ — «Позиція»: як фахівець
 * розуміє терапію. Мінімум самореклами: жодних рейтингів, відгуків
 * і закликів «забронювати зараз».
 */
export default async function SpecialistSpacePage({ params }: PageProps) {
  const { id } = await params;
  const vm = await loadSpace(id);
  if (!vm) notFound();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-20 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between gap-4 pt-8 lg:pt-12">
        <Link
          href="/therapists"
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Простір фахівців
        </Link>

        {vm.isOwner && (
          <Link
            href="/dashboard/profile"
            className={cn(
              "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#142744]/20 px-4 text-sm font-medium text-[#142744]",
              "hover:border-[#142744]/40 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
              focusRing,
            )}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Редагувати анкету
          </Link>
        )}
      </div>

      {vm.isOwner && !vm.verified && (
        <p className="mt-4 rounded-xl border border-[#B38B49]/35 bg-[#F8F4EC] px-4 py-3 text-[13px] text-[#876428]">
          Це попередній перегляд. Профіль стане видимим у каталозі після ручної перевірки.
        </p>
      )}

      {/* ── Шапка: стриманий портрет + представлення ── */}
      <div className="mt-6 grid gap-8 md:grid-cols-[220px_1fr] md:gap-12">
        <AvatarPortrait
          name={vm.name}
          seed={vm.seed}
          photo={vm.photo ?? undefined}
          arch={vm.arch}
          sizes="220px"
          className="mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-2xl md:mx-0"
        />

        <div>
          <h1
            className={`text-balance text-4xl font-normal leading-[1.1] sm:text-5xl ${ink.strong}`}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {vm.name}
          </h1>
          <p className={`mt-2 text-[17px] ${ink.muted}`}>{vm.status}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {vm.verified && (
              <p className="inline-flex items-center gap-1.5 text-sm text-[#1C3557]">
                <BadgeCheck className="h-4 w-4" aria-hidden />
                Верифіковано VSI
              </p>
            )}

            {/* Маленьке посилання — не головний елемент, лише швидкий доступ до контакту */}
            <a
              href="#contact"
              className={cn(
                "inline-flex items-center gap-1.5 text-sm underline-offset-4 hover:underline",
                vm.acceptingNew ? "text-[#245A41]" : "text-[#5C6672]",
                focusRing,
              )}
            >
              {vm.acceptingNew ? "Приймає нових клієнтів" : "У листі очікування"} · Зв&apos;язатися
            </a>
          </div>

          {vm.position[0] && (
            <p className={`mt-5 max-w-2xl text-pretty text-[16px] leading-[1.75] ${ink.body}`}>
              {vm.position[0]}
            </p>
          )}

          {vm.topics.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-1.5">
              {vm.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-[#142744]/10 bg-[#F8F4EC] px-2.5 py-1 text-xs text-[#4A5568]"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Внутрішня навігація простору ── */}
      <nav
        aria-label="Розділи простору"
        className="sticky top-[104px] z-20 -mx-5 mt-10 border-y border-[#142744]/10 bg-[#F8F4EC]/90 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"
      >
        <div className="flex gap-1 overflow-x-auto">
          {SECTIONS.map((s, i) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "relative inline-flex min-h-[46px] shrink-0 items-center whitespace-nowrap px-3.5 text-sm",
                i === 0 ? "font-medium text-[#142744]" : "text-[#4A5568] hover:text-[#142744]",
                "after:absolute after:inset-x-3.5 after:bottom-0 after:h-px after:bg-[#B38B49]",
                i === 0 ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                "after:origin-left after:transition-transform motion-reduce:after:transition-none",
                focusRing,
              )}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/*
        Один вертикальний потік, без бічної sticky-панелі: спочатку
        знайомство (позиція, практика, тексти, дослідження, шлях),
        умови роботи й контакт — навмисно останніми. Логіка сторінки:
        спершу знайомство, потім контакт.
      */}
      <div className="mt-10 max-w-2xl space-y-14">
        {/* Позиція — головний розділ */}
        <section aria-labelledby="position">
          <SectionTitleRow id="position">Позиція</SectionTitleRow>
          {vm.position.length > 0 ? (
            <div className="mt-4 space-y-4">
              {vm.position.map((p, i) => (
                <p key={i} className={`text-pretty text-[16px] leading-[1.8] ${ink.body}`}>
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <PendingSection>
              {vm.isOwner
                ? "Ви ще не заповнили цей розділ — розкажіть, як розумієте терапію, в анкеті."
                : "Фахівець ще формулює цей розділ — як він сам розуміє терапію і психологічну роботу."}
            </PendingSection>
          )}
        </section>

        <section aria-labelledby="practice">
          <SectionTitleRow id="practice">Практика</SectionTitleRow>
          {vm.practice.length > 0 ? (
            <div className="mt-4 space-y-4">
              {vm.practice.map((p, i) => (
                <p key={i} className={`text-pretty text-[16px] leading-[1.8] ${ink.body}`}>
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <PendingSection>Опис практики готується.</PendingSection>
          )}
        </section>

        <section aria-labelledby="texts">
          <SectionTitleRow id="texts">Тексти</SectionTitleRow>
          {vm.texts.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {vm.texts.map((m) => (
                <li key={m.id}>
                  <a
                    href={m.href}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-5 py-4",
                      "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#876428]">
                        {m.kind}
                      </span>
                      <span
                        className={`mt-1 block text-[17px] leading-snug ${ink.strong}`}
                        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                      >
                        {m.title}
                      </span>
                    </span>
                    {m.readingMinutes && (
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 text-[13px] ${ink.soft}`}
                      >
                        <Clock3 className="h-3.5 w-3.5" aria-hidden />
                        {m.readingMinutes} хв
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-4 text-[15px] ${ink.soft}`}>
              {vm.isOwner ? (
                <>
                  Ви ще не опублікували жодного тексту.{" "}
                  <Link
                    href="/dashboard/articles/new"
                    className="font-medium text-[#1C3557] hover:underline"
                  >
                    Написати перший
                  </Link>
                  .
                </>
              ) : (
                "Тексти цього фахівця готуються до публікації."
              )}
            </p>
          )}
        </section>

        {(vm.events.length > 0 || vm.isOwner) && (
          <section aria-labelledby="events">
            <SectionTitleRow id="events">Події</SectionTitleRow>
            {vm.events.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {vm.events.map((ev) => (
                  <li key={ev.id}>
                    <a
                      href={ev.href}
                      className={cn(
                        "group flex items-baseline justify-between gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-5 py-4",
                        "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                        focusRing,
                      )}
                    >
                      <span
                        className={`text-[17px] leading-snug ${ink.strong}`}
                        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                      >
                        {ev.title}
                      </span>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 text-[13px] ${ink.soft}`}
                      >
                        {ev.dateLabel}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-4 text-[15px] ${ink.soft}`}>
                {vm.isOwner ? (
                  <>
                    У вас ще немає найближчих подій.{" "}
                    <Link
                      href="/dashboard/events"
                      className="font-medium text-[#1C3557] hover:underline"
                    >
                      Створити подію
                    </Link>
                    .
                  </>
                ) : (
                  "Найближчих подій немає."
                )}
              </p>
            )}
          </section>
        )}

        <section aria-labelledby="research">
          <SectionTitleRow id="research">Досліджую</SectionTitleRow>
          {vm.research.length > 0 ? (
            <ul className="mt-4 space-y-2.5">
              {vm.research.map((r, i) => (
                <li
                  key={i}
                  className={`flex items-baseline gap-3 text-[16px] leading-relaxed ${ink.body}`}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 translate-y-[-2px] rounded-full bg-[#B38B49]"
                  />
                  {r}
                </li>
              ))}
            </ul>
          ) : (
            <PendingSection>Дослідницькі інтереси ще не опубліковані.</PendingSection>
          )}
        </section>

        <section aria-labelledby="path">
          <SectionTitleRow id="path">Професійний шлях</SectionTitleRow>

          {vm.diplomas.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {vm.diplomas.map((d, i) => (
                <div
                  key={i}
                  className="flex gap-3.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-4"
                >
                  <span
                    aria-hidden
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#F8F4EC] text-[#876428]"
                  >
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className={`truncate text-[15px] font-medium leading-snug ${ink.strong}`}>
                      {d.title}
                    </div>
                    {d.meta && <div className={`mt-0.5 text-[13px] ${ink.soft}`}>{d.meta}</div>}
                    {d.tags && d.tags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {d.tags.map((s) => (
                          <span
                            key={s}
                            className="rounded-full border border-[#142744]/10 bg-[#F8F4EC] px-2 py-0.5 text-[11px] text-[#4A5568]"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    {d.reviewStatus && (
                      <div
                        className={cn(
                          "mt-1.5 text-[12px]",
                          d.reviewStatus === "reviewed" ? "text-[#245A41]" : "text-[#876428]",
                        )}
                      >
                        {d.reviewStatus === "reviewed" ? "Перевірено" : "На розгляді"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : vm.path.length > 0 ? (
            <ol className="mt-5 space-y-0 border-l border-[#142744]/15 pl-6">
              {vm.path.map((step, i) => (
                <li key={i} className="relative pb-6 last:pb-0">
                  <span
                    aria-hidden
                    className="absolute -left-[27.5px] top-1.5 h-[7px] w-[7px] rounded-full bg-[#B38B49]"
                  />
                  <div
                    className={`text-[13px] font-medium uppercase tracking-[0.12em] ${ink.soft}`}
                  >
                    {step.period}
                  </div>
                  <div className={`mt-1 text-[15px] leading-relaxed ${ink.body}`}>{step.text}</div>
                </li>
              ))}
            </ol>
          ) : (
            <PendingSection>
              {vm.isOwner
                ? "Додайте дипломи чи сертифікати в анкеті — вони зʼявляться тут."
                : "Освіта й професійний шлях додаються."}
            </PendingSection>
          )}
        </section>

        {/* Умови роботи — факти, не central CTA-панель */}
        <section aria-labelledby="conditions">
          <SectionTitleRow id="conditions">Умови роботи</SectionTitleRow>
          <dl className={`mt-4 max-w-md space-y-3 text-[15px] ${ink.body}`}>
            <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
              <dt className={ink.soft}>Формат</dt>
              <dd className="text-right">{vm.formatLabel}</dd>
            </div>
            {vm.city && (
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Місто</dt>
                <dd>{vm.city}</dd>
              </div>
            )}
            {vm.languages.length > 0 && (
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Мови</dt>
                <dd className="text-right">{vm.languages.join(", ")}</dd>
              </div>
            )}
            {vm.sessionMinutes && (
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Тривалість</dt>
                <dd>{vm.sessionMinutes} хв</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className={ink.soft}>Вартість</dt>
              <dd>
                від {vm.priceFrom.toLocaleString("uk-UA")} {vm.currency}
              </dd>
            </div>
            {(vm.website || vm.socialLinks.length > 0) && (
              <div className="flex justify-between gap-4 border-t border-[#142744]/[0.07] pt-2.5">
                <dt className={ink.soft}>Онлайн</dt>
                <dd className="flex flex-col items-end gap-1 text-right">
                  {vm.website && (
                    <a
                      href={vm.website}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {vm.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {vm.socialLinks.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {url.replace(/^https?:\/\//, "")}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Контакт — завершує знайомство, свідомо останній розділ */}
        <section aria-labelledby="contact" className="scroll-mt-40">
          <SectionTitleRow id="contact">Контакт</SectionTitleRow>

          {vm.isOwner ? (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              Це ваш власний простір — заявки від клієнтів зʼявляться в{" "}
              <Link href="/dashboard/requests" className={cn("underline", focusRing)}>
                кабінеті
              </Link>
              .
            </p>
          ) : vm.isReal && vm.acceptsRequestsViaVsi ? (
            <>
              <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
                {vm.acceptingNew
                  ? "Фахівець приймає нових клієнтів. Залиште заявку через VSI — це не бронювання, а запрошення до першого листування."
                  : "Наразі фахівець веде лист очікування. Заявку можна залишити — ми повідомимо, щойно зʼявиться місце."}
              </p>
              <ContactRequestForm therapistSlug={id} />
              <p className={`mt-3 text-[12px] leading-relaxed ${ink.soft}`}>
                Відповідь зазвичай протягом двох робочих днів
              </p>
            </>
          ) : vm.isReal ? (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              Цей фахівець наразі не приймає звернення через VSI.
              {vm.city && " Контакти можна знайти в описі вище."}
            </p>
          ) : (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              {vm.acceptingNew
                ? "Фахівець приймає нових клієнтів."
                : "Наразі фахівець веде лист очікування."}{" "}
              Ця сторінка — демонстраційна; форма звернення зʼявиться, щойно фахівець зареєструється
              на VSI.
            </p>
          )}
        </section>
      </div>

      {/* ── Продовжити рух ── */}
      {vm.topics.length > 0 && (
        <div className="mt-16 border-t border-[#142744]/10 pt-8">
          <p className={`text-[15px] ${ink.muted}`}>Продовжити дослідження</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {vm.topics.slice(0, 4).map((topic) => (
              <Link
                key={topic}
                href="/explore"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-[#B38B49]/35 bg-[#FFFDF8] px-4 text-sm text-[#1C3557]",
                  "transition-colors hover:border-[#B38B49]/70 motion-reduce:transition-none",
                  touch,
                  focusRing,
                )}
              >
                {topic}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
