import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/i18n/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Clock3,
  FileText,
  Globe,
  GraduationCap,
  Leaf,
  MapPin,
  Pencil,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { pickBaseEducation } from "@/lib/education-base";
import { JsonLd, ORGANIZATION_ID, SITE_URL } from "@/components/seo/json-ld";
import { scheduleLabel, upcomingEventFilter } from "@/lib/event-recurrence";
import { cn } from "@/lib/utils";
import { AvatarPortrait } from "@/components/preview/vsi/decor";
import { ContactRequestForm } from "@/components/preview/vsi/contact-request-form";
import { MATERIALS, THERAPISTS, specialistSpace } from "@/components/preview/vsi/data";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";
import { createContentTranslator, type ContentTranslator } from "@/lib/i18n/content";
import { intlLocale, type Translate } from "@/lib/i18n/translate";
import { TranslatedNote } from "@/components/i18n/translated-note";

interface PageProps {
  params: Promise<{ id: string }>;
}

/** Картка «Професійний шлях» — покриває і кураторські дипломи демо-персон
 *  (інституція/роки/спеціальності), і реальні завантажені документи
 *  (назва файлу/тип/статус перевірки) одним виглядом. */
/** Прикріплений до запису файл: фото показуємо мініатюрою, решту — посиланням. */
interface DiplomaFile {
  url: string;
  kind: "image" | "file";
}

interface DiplomaCard {
  title: string;
  meta?: string;
  tags?: string[];
  reviewStatus?: "pending" | "reviewed";
  files?: DiplomaFile[];
}

/** Публічні групи розділу «Освіта та професійна підготовка». */
interface EducationGroup {
  title: string;
  items: DiplomaCard[];
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
  /** Короткий опис підходу з анкети — не та сама «Позиція», що нижче. */
  lead?: string | null;
  /** Напрями роботи з анкети — для довідки «Спеціалізація». */
  approaches: string[];
  /** З ким працює — для довідки «Цільові групи». */
  ageGroups: string[];
  /** Один рядок про освіту; повний перелік лишається в розділі нижче. */
  educationSummary?: string | null;
  /** Робочі години з анкети, напр. «Пн–Пт, 10:00–19:00». */
  availability?: string | null;
  /** Участь у програмі соціальної підтримки — інформаційний статус. */
  socialSupport: boolean;
  topics: string[];
  position: string[];
  practice: string[];
  diplomas: DiplomaCard[];
  educationGroups: EducationGroup[];
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
  /** Чи показано переклад слів фахівця. */
  translated: boolean;
  /** Чи це реальний профіль у базі (можна залишити заявку) чи демо-персона. */
  isReal: boolean;
  acceptsRequestsViaVsi: boolean;
}

const EDUCATION_TYPE_LABEL: Record<string, string> = {
  DIPLOMA: "Вища освіта",
  CERTIFICATE: "Перепідготовка",
  COURSE: "Курс",
  MASTERCLASS: "Майстер-клас",
  CONFERENCE: "Конференція",
  ID: "Документ",
  OTHER: "Навчання",
};

const REAL_AGE_GROUP_LABEL: Record<string, string> = {
  CHILDREN: "Діти",
  TEENS: "Підлітки",
  ADULTS: "Дорослі",
};

const DEMO_AGE_GROUP_LABEL: Record<string, string> = {
  children: "Діти",
  teens: "Підлітки",
  adults: "Дорослі",
};

const REAL_FORMAT_LABEL: Record<"ONLINE" | "OFFLINE" | "BOTH", string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Онлайн і очно",
};

const DEGREE_LABEL: Record<string, string> = {
  BACHELOR: "Бакалавр",
  MASTER: "Магістр",
  SPECIALIST: "Спеціаліст",
  PHD: "Доктор філософії / PhD",
  OTHER: "",
};

const ROLE_LABEL: Record<string, string> = {
  PARTICIPANT: "Учасник",
  SPEAKER: "Доповідач",
  MODERATOR: "Модератор",
  ORGANIZER: "Організатор",
};

/** Форма запису освіти, з якої будується публічна картка. */
interface EducationRow {
  kind: string;
  title: string | null;
  institution: string | null;
  specialization: string | null;
  degree: string | null;
  startYear: number | null;
  endYear: number | null;
  ongoing: boolean;
  expectedEndYear: number | null;
  eventDate: string | null;
  role: string | null;
  presentationTitle: string | null;
  duration: string | null;
  documents: UploadedDocument[];
}

interface UploadedDocument {
  status: string;
  fileUrl: string | null;
  fileName: string | null;
}

/**
 * Файли, які видно у публічному профілі.
 *
 * Правило платформи: прикріпивши скан до запису про навчання, фахівець
 * його оприлюднює — про це сказано у формі завантаження. Не показуємо
 * лише те, що адміністратор повернув на уточнення: такий документ
 * ще не можна вважати підтвердженням чогось.
 */
function publicFiles(docs: UploadedDocument[]): DiplomaFile[] | undefined {
  const files = docs
    .filter((d) => d.fileUrl && d.status !== "NEEDS_UPDATE")
    .map(
      (d): DiplomaFile => ({
        url: d.fileUrl as string,
        kind: /\.(jpe?g|png|webp|gif|avif)$/i.test(d.fileName ?? "") ? "image" : "file",
      }),
    );
  return files.length > 0 ? files : undefined;
}

function educationPeriod(e: EducationRow, tr: Translate) {
  if (e.ongoing) {
    if (e.startYear) return tr("Навчається з {year}", { year: e.startYear });
    return e.expectedEndYear
      ? tr("У процесі, до {year}", { year: e.expectedEndYear })
      : tr("У процесі навчання");
  }
  if (e.startYear && e.endYear) {
    return e.startYear === e.endYear ? `${e.startYear}` : `${e.startYear}–${e.endYear}`;
  }
  return (
    e.eventDate ??
    (e.endYear ? `${e.endYear}` : e.startYear ? tr("з {year}", { year: e.startYear }) : undefined)
  );
}

/**
 * Три публічні групи: освіта, професійна підготовка, додаткове навчання.
 * Технічні поля (тип запису, назви файлів) сюди не потрапляють — тільки
 * те, що має сенс для читача, і самі скани, якщо фахівець їх прикріпив.
 * «Перевірено VSI» ставимо лише коли адміністратор справді підтвердив
 * документ: решта — інформація зі слів фахівця.
 */
function buildEducationGroups(
  rows: EducationRow[],
  tr: Translate,
  content: ContentTranslator,
): EducationGroup[] {
  const groups: { title: string; kinds: string[] }[] = [
    { title: "Освіта", kinds: ["EDUCATION"] },
    { title: "Професійна підготовка", kinds: ["SPECIALIZATION", "TRAINING"] },
    { title: "Додаткове навчання", kinds: ["SHORT_PROGRAM", "CONFERENCE"] },
  ];

  return groups
    .map(({ title, kinds }) => ({
      title,
      items: rows
        .filter((e) => kinds.includes(e.kind))
        .map((e): DiplomaCard => {
          const degree = e.degree ? tr(DEGREE_LABEL[e.degree] ?? "") : "";
          const subtitle = [degree, content.text(e.specialization)].filter(Boolean).join(" ");
          const period = educationPeriod(e, tr);
          const roleLabel = e.role ? ROLE_LABEL[e.role] : undefined;
          const title = content.text(e.title);
          const institution = content.text(e.institution);

          return {
            title: title || institution || subtitle || tr("Навчання"),
            meta: [
              title ? institution : subtitle,
              content.text(period),
              roleLabel && tr(roleLabel),
              content.text(e.duration),
            ]
              .filter(Boolean)
              .join(" · "),
            tags: e.presentationTitle ? [content.text(e.presentationTitle)] : undefined,
            reviewStatus: e.documents.some((d) => d.status === "VERIFIED") ? "reviewed" : undefined,
            files: publicFiles(e.documents),
          };
        }),
    }))
    .filter((g) => g.items.length > 0);
}

/**
 * Файли, завантажені окремо від записів освіти (так було у першій
 * версії анкети). Щоб вони не зникали з профілю, збираємо їх в окрему
 * групу наприкінці — але тільки поруч із записами: якщо записів немає
 * зовсім, сторінка й так показує документи запасним списком.
 */
function withLooseDocuments(groups: EducationGroup[], loose: UploadedDocument[], tr: Translate) {
  const files = publicFiles(loose);
  if (groups.length === 0 || !files) return groups;
  return [
    ...groups,
    {
      title: "Документи",
      items: files.map((f): DiplomaCard => ({ title: tr("Документ про освіту"), files: [f] })),
    },
  ];
}

/**
 * Мініатюри прикріплених документів. Натискання відкриває оригінал у
 * новій вкладці: диплом читають збільшеним, а не в картці. Мініатюру
 * готує оптимізатор зображень — оригінали бувають по 5–6 МБ.
 */
async function DiplomaFiles({ files, label }: { files: DiplomaFile[]; label: string }) {
  const { tr } = await getI18n();
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {files.map((f) => (
        <li key={f.url}>
          <a
            href={f.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group block overflow-hidden rounded-lg border border-[#142744]/15 bg-[#F8F4EC] transition-colors hover:border-[#B38B49] motion-reduce:transition-none",
              focusRing,
            )}
          >
            {f.kind === "image" ? (
              <Image
                src={f.url}
                alt={tr("Документ: {label}. Відкрити у повному розмірі", { label })}
                width={288}
                height={216}
                sizes="144px"
                className="h-[108px] w-[144px] object-cover object-top"
              />
            ) : (
              <span
                className={`flex h-[108px] w-[144px] flex-col items-center justify-center gap-2 text-[12px] ${ink.muted}`}
              >
                <FileText className="h-6 w-6 text-[#876428]" aria-hidden />
                {tr("Відкрити документ")}
                <span className="sr-only">: {label}</span>
              </span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

function seedFromString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Завантажує вьюмодель: спершу реальний профіль у базі, інакше — демо-персона. */
async function loadSpace(id: string): Promise<SpaceViewModel | null> {
  const session = await auth();
  const { locale, tr } = await getI18n();
  const content = createContentTranslator(locale);

  const real = await prisma.therapistProfile.findUnique({
    where: { slug: id },
    include: {
      specializations: { include: { specialization: true } },
      languages: { include: { language: true } },
      documents: { orderBy: { createdAt: "desc" } },
      education: {
        orderBy: [{ startYear: "desc" }, { createdAt: "asc" }],
        include: {
          documents: {
            orderBy: { createdAt: "asc" },
            select: { status: true, fileUrl: true, fileName: true },
          },
        },
      },
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
        ...upcomingEventFilter(),
        ...(isProfessional ? {} : { audience: { not: "PROFESSIONALS" } }),
      },
      orderBy: { startsAt: "asc" },
    });

    const city = content.text(real.city);
    const hours = content.text(real.workingHours);
    const space: SpaceViewModel = {
      name: content.name(real.fullName),
      status: content.text(real.professionalTitle) ?? tr("Фахівець VSI"),
      photo: real.photoUrl,
      seed: seedFromString(real.id),
      verified: real.status === "APPROVED",
      approaches: real.approaches.map((a) => tr(a)),
      ageGroups: real.ageGroups.map((g) => tr(REAL_AGE_GROUP_LABEL[g] ?? g)),
      educationSummary: content.text(pickBaseEducation(real.education)?.institution) ?? null,
      lead: content.text(real.analyticalOrientation),
      availability: hours,
      socialSupport: real.participatesInSocialSupport,
      topics: real.specializations.map((s) => tr(s.specialization.nameUk)),
      position: real.bio.trim() ? [content.text(real.bio.trim())] : [],
      practice: [
        tr("Формат роботи: {format}, {city}.", {
          format: tr(REAL_FORMAT_LABEL[real.sessionFormat]).toLowerCase(),
          city: city ?? "",
        }) + (hours ? ` ${tr("Графік: {hours}.", { hours })}` : ""),
      ],
      // Публічно показуємо текст освіти (заклад, спеціальність, роки)
      // і прикріплені скани; назви файлів у заголовки не виносимо.
      diplomas: real.documents.map((d): DiplomaCard => {
        const period = d.inProgress
          ? d.yearFrom
            ? tr("з {year}, триває", { year: d.yearFrom })
            : tr("триває")
          : d.yearFrom && d.yearTo
            ? d.yearFrom === d.yearTo
              ? `${d.yearFrom}`
              : `${d.yearFrom}–${d.yearTo}`
            : (d.yearTo ?? d.yearFrom)
              ? `${d.yearTo ?? d.yearFrom}`
              : undefined;
        const typeLabel = tr(EDUCATION_TYPE_LABEL[d.docType] ?? "Навчання");
        return {
          title: content.text(d.institution) ?? d.fileName ?? typeLabel,
          meta: [typeLabel, period].filter(Boolean).join(" · "),
          tags: d.specialization ? [content.text(d.specialization)] : undefined,
          reviewStatus: d.status === "VERIFIED" ? "reviewed" : "pending",
          files: publicFiles([d]),
        };
      }),
      educationGroups: withLooseDocuments(
        buildEducationGroups(real.education, tr, content),
        real.documents.filter((d) => !d.entryId),
        tr,
      ),
      path: [],
      research: [],
      texts: articles.map((a) => ({
        id: a.id,
        href: `/library/${a.slug}`,
        kind: "Стаття",
        title: content.text(a.title),
        readingMinutes: Math.max(1, Math.round(a.content.split(/\s+/).length / 200)),
      })),
      events: events.map((e) => ({
        id: e.id,
        href: `/events#${e.slug}`,
        title: content.text(e.title),
        dateLabel: scheduleLabel(e, locale),
      })),
      formatLabel: tr(REAL_FORMAT_LABEL[real.sessionFormat]),
      city: city ?? undefined,
      languages: real.languages.map((l) => tr(l.language.nameUk)),
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
      translated: false,
    };
    // Прапорець читаємо наприкінці: до цього моменту все вже перекладено.
    return { ...space, translated: content.used };
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
    approaches: [t.approach],
    ageGroups: (t.ageGroups ?? []).map((g) => DEMO_AGE_GROUP_LABEL[g] ?? g),
    educationSummary: null,
    lead: t.approach,
    availability: null,
    socialSupport: t.socialSupport ?? false,
    topics: t.topics,
    position: space.position,
    practice: space.practice,
    diplomas: (space.diplomas ?? []).map((d) => ({
      title: d.institution,
      meta: d.years,
      tags: d.specialties,
    })),
    // Демо-персони описані кураторськими дипломами, без розділу освіти.
    educationGroups: [],
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
    translated: false,
  };
}

/**
 * Сторінка рендериться на кожен запит.
 *
 * Вона читає сесію, щоб показати власнику профілю кнопки редагування, а
 * це заборонено під час статичного рендеру. Раніше маршрут тримався
 * статичним, бо generateStaticParams перелічував демо-персон; коли їх не
 * стало, список спорожнів і сторінки фахівців почали віддавати 500.
 * Перелічувати тут нічого: реальні профілі живуть у базі й змінюються.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vm = await loadSpace(id);
  // notFound() тут, а не лише в самій сторінці, — інакше кореневий
  // app/loading.tsx встигає застрімити 200 до того, як стане відомо,
  // що сторінки не існує, і статус-код уже не змінити.
  if (!vm) notFound();
  const { locale } = await getI18n();
  return pageMetadata(locale, `/specialists/${id}`, { title: vm.name, description: vm.status });
}

const SECTIONS = [
  { id: "position", label: "Про фахівця" },
  { id: "practice", label: "Практика" },
  { id: "texts", label: "Тексти" },
  { id: "events", label: "Події" },
  { id: "research", label: "Досліджую" },
  { id: "path", label: "Освіта" },
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

/** Рядок довідки праворуч від опису: іконка, підпис, значення. */
function InfoRow({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#876428]" strokeWidth={1.3} aria-hidden />
      <div>
        <h3
          className={`text-[17px] font-normal ${ink.strong}`}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {title}
        </h3>
        <p className={`mt-1 text-[15px] leading-relaxed ${ink.muted}`}>{children}</p>
      </div>
    </div>
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
  const { tr, locale, href } = await getI18n();
  const { id } = await params;
  const vm = await loadSpace(id);
  if (!vm) notFound();

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 pb-14 sm:px-8 lg:px-10">
      {/* Лише схвалені справжні профілі й лише те, що видно на сторінці. */}
      {vm.isReal && vm.verified && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: vm.name,
            jobTitle: vm.status,
            url: `${SITE_URL}${href(`/specialists/${id}`)}`,
            image: vm.photo ?? undefined,
            knowsAbout: vm.topics,
            knowsLanguage: vm.languages,
            alumniOf: vm.educationSummary
              ? { "@type": "EducationalOrganization", name: vm.educationSummary }
              : undefined,
            affiliation: { "@id": ORGANIZATION_ID },
          }}
        />
      )}

      <div className="flex items-center justify-between gap-4 pt-6 lg:pt-8">
        <Link
          href="/therapists"
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {tr("Простір фахівців")}
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
            {tr("Редагувати анкету")}
          </Link>
        )}
      </div>

      {vm.isOwner && !vm.verified && (
        <p className="mt-4 rounded-xl border border-[#B38B49]/35 bg-[#F8F4EC] px-4 py-3 text-[13px] text-[#876428]">
          {tr("Це попередній перегляд. Профіль стане видимим у каталозі після ручної перевірки.")}
        </p>
      )}

      {/*
        Шапка профілю: портрет аркою ліворуч, представлення праворуч.

        Позиція сюди навмисно не потрапляє — вона береться з того самого
        поля анкети, що й розділ «Позиція» нижче, і в шапці була б тим
        самим текстом двічі поспіль. Коротким вступом слугує опис підходу.
      */}
      <div className="relative mt-4">
        <svg
          aria-hidden
          viewBox="0 0 240 240"
          className="pointer-events-none absolute -right-6 -top-10 hidden h-60 w-60 lg:block"
          fill="none"
        >
          <path
            d="M 236 232 A 116 116 0 0 0 120 116"
            stroke="#B38B49"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <circle cx="236" cy="232" r="6" fill="#B38B49" fillOpacity="0.75" />
        </svg>

        <div className="relative grid gap-7 md:grid-cols-[minmax(0,380px)_1fr] md:gap-10">
          <div>
            {/*
              Без арки: будь-яка її форма зрізає верх кадру, і обличчя
              йде під обріз. Фрейм просто ширший за звичайний портретний,
              щоб знімок дихав.
            */}
            <AvatarPortrait
              name={vm.name}
              seed={vm.seed}
              photo={vm.photo ?? undefined}
              sizes="(min-width: 768px) 380px, 90vw"
              className="mx-auto aspect-[7/8] w-full max-w-[380px] rounded-[28px] md:mx-0"
            />
          </div>

          <div>
            <h1
              className={`text-balance text-4xl font-normal leading-[1.08] sm:text-5xl ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              {vm.name}
            </h1>
            <p className="mt-3 text-[12px] font-medium uppercase leading-relaxed tracking-[0.16em] text-[#5C6672]">
              {vm.status}
            </p>
            <TranslatedNote show={vm.translated} className="mt-2" />

            <div className="mt-5 flex flex-wrap gap-3">
              {vm.verified && (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#142744]/20 px-4 py-2 text-[14px] text-[#142744]">
                  <ShieldCheck className="h-4 w-4 text-[#1C3557]" strokeWidth={1.5} aria-hidden />
                  {tr("Перевірений профіль")}
                </span>
              )}
              {vm.socialSupport && (
                <span className="inline-flex items-center gap-2.5 rounded-full border border-[#B38B49]/35 bg-[#E9DECE]/55 px-5 py-2.5 text-[13px] leading-snug text-[#6E5120]">
                  <Users className="h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
                  {tr("Учасник програми соціальної підтримки VSI")}
                </span>
              )}
            </div>

            {vm.lead && (
              <p
                className={`mt-4 max-w-xl text-pretty text-[19px] leading-[1.6] ${ink.body}`}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                {vm.lead}
              </p>
            )}

            <span aria-hidden className="mt-5 block h-px w-full max-w-xl bg-[#142744]/10" />

            <dl className={`mt-5 flex flex-wrap gap-x-7 gap-y-3 text-[15px] ${ink.body}`}>
              <div className="flex items-center gap-2">
                <dt className="sr-only">{tr("Формат")}</dt>
                <MapPin className="h-4 w-4 shrink-0 text-[#876428]" strokeWidth={1.5} aria-hidden />
                <dd>
                  {vm.formatLabel}
                  {vm.city ? ` · ${vm.city}` : ""}
                </dd>
              </div>
              {vm.languages.length > 0 && (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">{tr("Мови")}</dt>
                  <Globe
                    className="h-4 w-4 shrink-0 text-[#876428]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <dd>{vm.languages.join(", ")}</dd>
                </div>
              )}
              {vm.availability && (
                <div className="flex items-center gap-2">
                  <dt className="sr-only">{tr("Доступність")}</dt>
                  <Clock
                    className="h-4 w-4 shrink-0 text-[#876428]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <dd>
                    {tr("Доступність:")} {vm.availability}
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href="#contact"
                className={cn(
                  "group inline-flex min-h-[54px] items-center gap-3 rounded-full bg-[#142744] px-8 text-[16px] font-medium text-[#F8F4EC]",
                  "transition-colors hover:bg-[#1C3557] motion-reduce:transition-none",
                  focusRing,
                )}
              >
                {tr("Записатися")}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </a>
              <p
                className={cn("text-[14px]", vm.acceptingNew ? "text-[#245A41]" : "text-[#5C6672]")}
              >
                {vm.acceptingNew ? tr("Приймає нових клієнтів") : tr("У листі очікування")}
              </p>
            </div>

            {/*
              Умови роботи — одразу під кнопкою «Записатися»: це основне, що
              людині треба знати, щоб вирішити, чи писати. Форма запису лишається
              внизу сторінки, кнопка веде до неї якорем #contact.
            */}
            <section aria-labelledby="conditions" className="mt-7 max-w-xl">
              <SectionTitleRow id="conditions">{tr("Умови роботи")}</SectionTitleRow>
              <dl className={`mt-4 space-y-3 text-[15px] ${ink.body}`}>
                <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                  <dt className={ink.soft}>{tr("Формат")}</dt>
                  <dd className="text-right">{vm.formatLabel}</dd>
                </div>
                {vm.city && (
                  <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                    <dt className={ink.soft}>{tr("Місто")}</dt>
                    <dd>{vm.city}</dd>
                  </div>
                )}
                {vm.languages.length > 0 && (
                  <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                    <dt className={ink.soft}>{tr("Мови")}</dt>
                    <dd className="text-right">{vm.languages.join(", ")}</dd>
                  </div>
                )}
                {vm.sessionMinutes && (
                  <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                    <dt className={ink.soft}>{tr("Тривалість")}</dt>
                    <dd>
                      {vm.sessionMinutes} {tr("хв")}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className={ink.soft}>{tr("Вартість")}</dt>
                  <dd>
                    {tr("від")} {vm.priceFrom.toLocaleString(intlLocale(locale))} {tr(vm.currency)}
                  </dd>
                </div>
                {(vm.website || vm.socialLinks.length > 0) && (
                  <div className="flex justify-between gap-4 border-t border-[#142744]/[0.07] pt-2.5">
                    <dt className={ink.soft}>{tr("Онлайн")}</dt>
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
          </div>
        </div>

        {/*
          Теми — на всю ширину під шапкою, а не в колонці фото:
          там вони ламалися на шість рядків, поки праворуч
          лишалося порожнє поле.
        */}
        {vm.topics.length > 0 && (
          <ul className="mt-7 flex flex-wrap gap-2.5">
            {vm.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-full border border-[#B38B49]/35 px-4 py-2 text-[14px] text-[#4A5568]"
              >
                {topic}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Внутрішня навігація простору ── */}
      <nav
        aria-label={tr("Розділи простору")}
        className="sticky top-[104px] z-20 -mx-5 mt-7 border-y border-[#142744]/10 bg-[#F8F4EC]/90 px-5 backdrop-blur-md sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10"
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
              {tr(s.label)}
            </a>
          ))}
        </div>
      </nav>

      {/*
        «Про фахівця» — головний розділ і єдиний, що виходить за межі
        вузької читацької колонки: у спільних 672px на текст лишалася
        третина ширини, і він ламався по чотири слова в рядок. Тепер
        довідка (освіта, напрями, вікові групи) відходить до правого
        краю полотна, під ту саму межу, що й шапка профілю, а опис
        читається тією ж мірою рядка, що й розділи нижче.

        Повні переліки лишаються в розділах нижче — тут лише те, що
        читають першим.
      */}
      <section aria-labelledby="position" className="mt-7">
        <SectionTitleRow id="position">{tr("Про фахівця")}</SectionTitleRow>

        <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)] lg:gap-11">
          <div className="max-w-2xl">
            {vm.position.length > 0 ? (
              <div className="space-y-4">
                {vm.position.map((p, i) => (
                  <p key={i} className={`text-pretty text-[16px] leading-[1.8] ${ink.body}`}>
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <PendingSection>
                {vm.isOwner
                  ? tr("Ви ще не заповнили цей розділ — розкажіть, як розумієте терапію, в анкеті.")
                  : tr(
                      "Фахівець ще формулює цей розділ — як він сам розуміє терапію і психологічну роботу.",
                    )}
              </PendingSection>
            )}
          </div>

          <div className="space-y-5">
            {vm.educationSummary && (
              <InfoRow icon={GraduationCap} title={tr("Освіта")}>
                {vm.educationSummary}
              </InfoRow>
            )}
            {vm.approaches.length > 0 && (
              <InfoRow icon={User} title={tr("Спеціалізація")}>
                {vm.approaches.join(", ")}
              </InfoRow>
            )}
            {vm.ageGroups.length > 0 && (
              <InfoRow icon={Users} title={tr("Цільові групи")}>
                {vm.ageGroups.join(", ")}
              </InfoRow>
            )}

            {vm.socialSupport && (
              <p className="flex items-start gap-3 rounded-2xl border border-[#B38B49]/30 bg-[#E9DECE]/35 px-5 py-4 text-[14px] italic leading-relaxed text-[#6E5120]">
                <Leaf className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.4} aria-hidden />
                {tr(
                  "У межах програми соціальної підтримки VSI фахівець може працювати зі зниженою вартістю.",
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/*
        Далі — один вертикальний потік, без бічної sticky-панелі:
        знайомство (практика, тексти, дослідження, шлях),
        умови роботи й контакт — навмисно останніми. Логіка сторінки:
        спершу знайомство, потім контакт.
      */}
      <div className="mt-10 max-w-2xl space-y-10">
        <section aria-labelledby="practice">
          <SectionTitleRow id="practice">{tr("Практика")}</SectionTitleRow>
          {vm.practice.length > 0 ? (
            <div className="mt-4 space-y-4">
              {vm.practice.map((p, i) => (
                <p key={i} className={`text-pretty text-[16px] leading-[1.8] ${ink.body}`}>
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <PendingSection>{tr("Опис практики готується.")}</PendingSection>
          )}
        </section>

        <section aria-labelledby="texts">
          <SectionTitleRow id="texts">{tr("Тексти")}</SectionTitleRow>
          {vm.texts.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {vm.texts.map((m) => (
                <li key={m.id}>
                  <a
                    href={href(m.href)}
                    className={cn(
                      "group flex items-baseline justify-between gap-4 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-5 py-4",
                      "transition-colors hover:border-[#142744]/25 motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <span>
                      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#876428]">
                        {tr(m.kind)}
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
                        {m.readingMinutes} {tr("хв")}
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
                  {tr("Ви ще не опублікували жодного тексту.")}{" "}
                  <Link
                    href="/dashboard/articles/new"
                    className="font-medium text-[#1C3557] hover:underline"
                  >
                    {tr("Написати перший")}
                  </Link>
                  .
                </>
              ) : (
                tr("Тексти цього фахівця готуються до публікації.")
              )}
            </p>
          )}
        </section>

        {(vm.events.length > 0 || vm.isOwner) && (
          <section aria-labelledby="events">
            <SectionTitleRow id="events">{tr("Події")}</SectionTitleRow>
            {vm.events.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {vm.events.map((ev) => (
                  <li key={ev.id}>
                    <a
                      href={href(ev.href)}
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
                    {tr("У вас ще немає найближчих подій.")}{" "}
                    <Link
                      href="/dashboard/events"
                      className="font-medium text-[#1C3557] hover:underline"
                    >
                      {tr("Створити подію")}
                    </Link>
                    .
                  </>
                ) : (
                  tr("Найближчих подій немає.")
                )}
              </p>
            )}
          </section>
        )}

        <section aria-labelledby="research">
          <SectionTitleRow id="research">{tr("Досліджую")}</SectionTitleRow>
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
            <PendingSection>{tr("Дослідницькі інтереси ще не опубліковані.")}</PendingSection>
          )}
        </section>

        <section aria-labelledby="path">
          <SectionTitleRow id="path">{tr("Освіта та професійна підготовка")}</SectionTitleRow>

          {vm.educationGroups.length > 0 ? (
            <div className="mt-5 space-y-5">
              {vm.educationGroups.map((group) => (
                <div key={group.title}>
                  <h3 className={`text-[11px] font-medium uppercase tracking-[0.18em] ${ink.soft}`}>
                    {tr(group.title)}
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {group.items.map((d, i) => (
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
                          <div className={`text-[15px] font-medium leading-snug ${ink.strong}`}>
                            {d.title}
                          </div>
                          {d.meta && (
                            <div className={`mt-0.5 text-[13px] ${ink.soft}`}>{d.meta}</div>
                          )}
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
                          {/* Позначку ставимо тільки на реально перевірене VSI —
                              решта лишається інформацією зі слів фахівця. */}
                          {d.reviewStatus === "reviewed" && (
                            <div className="mt-1.5 text-[12px] text-[#245A41]">
                              {tr("Документ перевірено VSI")}
                            </div>
                          )}
                          {d.files && <DiplomaFiles files={d.files} label={d.title} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className={`text-[12px] ${ink.soft}`}>{tr("Інформацію додано фахівцем.")}</p>
            </div>
          ) : vm.diplomas.length > 0 ? (
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
                    {d.files && <DiplomaFiles files={d.files} label={d.title} />}
                  </div>
                </div>
              ))}
            </div>
          ) : vm.path.length > 0 ? (
            <ol className="mt-5 space-y-0 border-l border-[#142744]/15 pl-6">
              {vm.path.map((step, i) => (
                <li key={i} className="relative pb-4 last:pb-0">
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
                ? tr("Додайте дипломи чи сертифікати в анкеті — вони зʼявляться тут.")
                : tr("Освіта й професійний шлях додаються.")}
            </PendingSection>
          )}
        </section>

        {/* Контакт — завершує знайомство, свідомо останній розділ */}
        <section aria-labelledby="contact" className="scroll-mt-40">
          <SectionTitleRow id="contact">{tr("Контакт")}</SectionTitleRow>

          {vm.isOwner ? (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              {tr("Це ваш власний простір — заявки від клієнтів зʼявляться в")}{" "}
              <Link href="/dashboard/requests" className={cn("underline", focusRing)}>
                {tr("кабінеті")}
              </Link>
              .
            </p>
          ) : vm.isReal && vm.acceptsRequestsViaVsi ? (
            <>
              <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
                {vm.acceptingNew
                  ? tr(
                      "Фахівець приймає нових клієнтів. Залиште заявку через VSI — це не бронювання, а запрошення до першого листування.",
                    )
                  : tr(
                      "Наразі фахівець веде лист очікування. Заявку можна залишити — ми повідомимо, щойно зʼявиться місце.",
                    )}
              </p>
              <ContactRequestForm therapistSlug={id} />
              <p className={`mt-3 text-[12px] leading-relaxed ${ink.soft}`}>
                {tr("Відповідь зазвичай протягом двох робочих днів")}
              </p>
            </>
          ) : vm.isReal ? (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              {tr("Цей фахівець наразі не приймає звернення через VSI.")}
              {vm.city && tr(" Контакти можна знайти в описі вище.")}
            </p>
          ) : (
            <p className={`mt-4 max-w-md text-pretty text-[15px] leading-relaxed ${ink.muted}`}>
              {vm.acceptingNew
                ? tr("Фахівець приймає нових клієнтів.")
                : tr("Наразі фахівець веде лист очікування.")}{" "}
              {tr(
                "Ця сторінка — демонстраційна; форма звернення зʼявиться, щойно фахівець зареєструється на VSI.",
              )}
            </p>
          )}
        </section>
      </div>

      {/* ── Продовжити рух ── */}
      {vm.topics.length > 0 && (
        <div className="mt-11 border-t border-[#142744]/10 pt-6">
          <p className={`text-[15px] ${ink.muted}`}>{tr("Продовжити дослідження")}</p>
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
