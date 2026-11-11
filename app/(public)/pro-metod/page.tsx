import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BarChart3,
  Blend,
  BookOpen,
  Brain,
  Calendar,
  Eye,
  GraduationCap,
  Leaf,
  RefreshCw,
  Scale,
  Sparkle,
  Sprout,
  User,
  Users,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { featherEdges, focusRing, ink, serif } from "@/components/preview/vsi/theme";

export const metadata: Metadata = {
  title: "Про напрямок",
  description:
    "Аналітично орієнтована психотерапія: простір для глибшого розуміння психічного життя, стосунків і внутрішніх процесів людини.",
};

/** Смуга контенту. Темний блок навмисно живе поза нею — він на всю ширину. */
const SHELL = "mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10";

const STAGES = [
  { icon: Zap, label: "Симптом", text: "Те, що турбує або повторюється." },
  {
    icon: Leaf,
    label: "Досвід",
    text: "Те, з чим пов'язані наші реакції, вибори та способи переживати події.",
  },
  {
    icon: Eye,
    label: "Усвідомлення",
    text: "Можливість побачити внутрішні зв'язки і зрозуміти, що відбувається.",
  },
  {
    icon: Sparkle,
    label: "Зміна",
    text: "Більше свободи у виборі, стосунках і способі бути із собою та іншими.",
  },
];

const FOUNDATIONS = [
  {
    icon: Brain,
    title: "Несвідоме",
    text: "Не всі причини наших переживань і рішень доступні свідомості. Частина психічного життя проявляється через повторення, фантазії, сни, симптоми, емоційні реакції та стосунки.",
  },
  {
    icon: Users,
    title: "Терапевтичні стосунки",
    text: "Контакт із терапевтом стає важливою частиною роботи. У ньому можуть проявлятися звичні способи переживати близькість, довіру, дистанцію, залежність, конфлікт і межі.",
  },
  {
    icon: RefreshCw,
    title: "Повторювані сценарії",
    text: "Ми можемо знову і знову опинятися у схожих ситуаціях, обирати подібні стосунки або реагувати знайомим способом. Терапія допомагає помічати ці повторення та поступово краще розуміти їх.",
  },
  {
    icon: Blend,
    title: "Внутрішні конфлікти",
    text: "У людині одночасно можуть існувати різні бажання, потреби, страхи і заборони. Аналітична робота дає можливість помічати ці суперечності та знаходити більш власний спосіб обходитися з ними.",
  },
];

/*
  Описи скорочені так, як у макеті. Шість пунктів стоять у рядок,
  тож на колонку припадає близько 120 пікселів — повні формулювання
  з тексту розтягнулися б там на десяток рядків.
*/
const PROFESSIONAL = [
  {
    icon: GraduationCap,
    title: "Освіта",
    text: "Навчальні програми, семінари, лекції та інші формати.",
  },
  {
    icon: Users,
    title: "Супервізія",
    text: "Простір для осмислення клінічної роботи та складних випадків.",
  },
  {
    icon: Scale,
    title: "Етика",
    text: "Повага до конфіденційності, меж і професійної відповідальності.",
  },
  {
    icon: BookOpen,
    title: "Публікації",
    text: "Професійні тексти, клінічні роздуми та матеріали.",
  },
  {
    icon: Calendar,
    title: "Події",
    text: "Конференції, дискусії та освітні заходи.",
  },
  {
    icon: BarChart3,
    title: "Професійний розвиток",
    text: "Навчання, підвищення кваліфікації та сертифікаційні формати.",
  },
];

const AUDIENCES = [
  {
    icon: Sprout,
    title: "Я шукаю терапію",
    paragraphs: [
      "VSI відкритий для людей, які цікавляться психотерапією, власним розвитком і хочуть краще розуміти своє внутрішнє життя.",
      "На платформі можна познайомитися з фахівцями, дізнатися про їхній професійний шлях і підхід, читати тексти, знаходити події та обирати спеціаліста для психотерапевтичної роботи.",
      "Ми не створюємо рейтинги і не визначаємо, хто є «найкращим» терапевтом. Для нас важливо, щоб людина могла познайомитися з фахівцем і знайти той терапевтичний контакт, який підходить саме їй.",
    ],
    cta: "Познайомитися з фахівцями",
    href: "/therapists",
  },
  {
    icon: User,
    title: "Я фахівець",
    paragraphs: [
      "Ми запрошуємо до професійної спільноти VSI психологів і психотерапевтів, які працюють в аналітично орієнтованих підходах та поділяють принципи професійної етики і відповідального ставлення до психотерапевтичної практики.",
      "Приєднання до спільноти відбувається після попереднього знайомства та співбесіди. Для нас важливо зрозуміти освіту, професійний шлях, терапевтичну орієнтацію, досвід практики та ставлення фахівця до супервізії і професійного розвитку.",
      "Учасники VSI можуть створювати професійний профіль, публікувати тексти, брати участь у подіях, навчальних програмах, супервізії та інших професійних ініціативах платформи.",
    ],
    cta: "Долучитися як фахівець",
    href: "/register?role=THERAPIST",
  },
];

/** Заголовок розділу — однаковий ритм по всій сторінці. */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className={cn("text-[2rem] font-normal leading-tight", ink.strong)} style={serif}>
      {children}
    </h2>
  );
}

export default function ProMethodPage() {
  return (
    <div className="pb-24">
      {/* ── Знайомство з напрямком ── */}
      {/*
        Сітка така сама, як у «Фахівцях», «Текстах» і «Соціальній
        підтримці»: ілюстрація займає 47% полотна, тож на всіх
        чотирьох сторінках шапка має один розмір.
      */}
      <section
        className={cn(
          SHELL,
          "grid gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,47%)] lg:items-center lg:gap-6 lg:pt-16",
        )}
      >
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#876428]">
            Про напрямок VSI
          </p>
          <h1
            className={cn(
              "mt-5 text-balance text-[2.6rem] font-normal leading-[1.08] sm:text-5xl",
              ink.strong,
            )}
            style={serif}
          >
            Аналітично орієнтована психотерапія
          </h1>
          <p className={cn("mt-6 max-w-lg text-pretty text-[19px] leading-[1.6]", ink.body)}>
            Простір для глибшого розуміння психічного життя, стосунків і внутрішніх процесів людини.
          </p>
          <p className={cn("mt-5 max-w-lg text-pretty text-[15px] leading-[1.75]", ink.muted)}>
            VSI є професійною спільнотою аналітично орієнтованих психологів і психотерапевтів. Ми
            створили платформу для розвитку цього напряму, професійного діалогу між фахівцями та
            доступу до якісної психологічної і психотерапевтичної допомоги.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/therapists"
              className={cn(
                "group inline-flex min-h-[56px] items-center gap-3 rounded-full bg-[#142744] px-6 text-[15px] font-medium text-[#F8F4EC]",
                "transition-colors hover:bg-[#1C3557] motion-reduce:transition-none",
                focusRing,
              )}
            >
              Познайомитися з фахівцями
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
            <Link
              href="/register?role=THERAPIST"
              className={cn(
                "group inline-flex min-h-[56px] items-center gap-3 rounded-full border border-[#142744]/25 px-6 text-[15px] font-medium text-[#142744]",
                "transition-colors hover:border-[#142744]/50 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
                focusRing,
              )}
            >
              Долучитися як фахівець
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
          </div>
        </div>

        {/*
          Без накладеного декору: орбіта й золота гілка вже намальовані
          всередині самої ілюстрації, друга орбіта поверх неї дублювала б мотив.
        */}
        <Image
          src="/brand/motifs/pro-metod-hero.png"
          alt="Арка, у прорізі якої гори, схід сонця й золота стежка; довкола — орбіта і гілка"
          width={1536}
          height={1024}
          priority
          sizes="(min-width: 1024px) 560px, 90vw"
          className="mx-auto h-auto w-full max-w-[520px] lg:max-w-none"
          style={featherEdges}
        />
      </section>

      {/* ── Не лише прибрати симптом ── */}
      <section
        className={cn(
          SHELL,
          "mt-20 grid gap-12 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14",
        )}
      >
        <div>
          <SectionTitle>Не лише прибрати симптом</SectionTitle>
          <div className={cn("mt-6 space-y-5 text-[14px] leading-[1.75]", ink.muted)}>
            <p className="text-pretty">
              Тривога, повторювані труднощі у стосунках, внутрішня напруга, кризи, втрата опори або
              відчуття, що певні життєві ситуації постійно повторюються, можуть стати початком
              глибшого дослідження себе.
            </p>
            <p className="text-pretty">
              Аналітично орієнтована психотерапія допомагає не лише зменшити симптом, а й зрозуміти,
              що за ним стоїть. У роботі поступово стають помітнішими внутрішні конфлікти, несвідомі
              мотиви, досвід ранніх стосунків, звичні способи реагування та сценарії, які впливають
              на теперішнє життя.
            </p>
            <p className="text-pretty">
              Мета такої роботи не в тому, щоб швидко змінити людину. Йдеться про можливість краще
              розуміти себе, свої переживання, бажання, страхи та способи будувати стосунки.
            </p>
          </div>
        </div>

        {/*
          Чотири стани руху. На вузькому екрані стрілки ховаються:
          у сітці 2×2 вони вказували б у порожнечу.
        */}
        <ol className="grid gap-y-10 sm:grid-cols-2 lg:flex lg:items-start lg:gap-x-1 lg:border-l lg:border-[#B38B49]/25 lg:pl-14">
          {STAGES.map(({ icon: Icon, label, text }, i) => (
            <li key={label} className="flex items-start lg:flex-1">
              <div className="flex flex-1 flex-col items-center px-1 text-center">
                <span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#B38B49]/[0.12]"
                >
                  <Icon className="h-5 w-5 text-[#876428]" strokeWidth={1.3} />
                </span>
                <span className={cn("mt-4 text-[16px] leading-snug", ink.strong)} style={serif}>
                  {label}
                </span>
                <p className={cn("mt-2 max-w-[200px] text-[12.5px] leading-relaxed", ink.muted)}>
                  {text}
                </p>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight
                  className="mt-[22px] hidden h-4 w-4 shrink-0 text-[#B38B49]/70 lg:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* ── Що лежить в основі роботи ── */}
      <section className={cn(SHELL, "mt-20")}>
        <SectionTitle>Що лежить в основі роботи</SectionTitle>

        {/*
          Розділювач — ліва межа сусідньої колонки, а не окрема лінія:
          при переносі на вузькому екрані окрема лінія висіла б у порожнечі.
        */}
        <ul className="mt-10 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
          {FOUNDATIONS.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={cn(
                "lg:px-7",
                i % 2 === 1 && "sm:border-l sm:border-[#B38B49]/25 sm:pl-7",
                i > 0 && "lg:border-l lg:border-[#B38B49]/25",
                i === 0 && "lg:pl-0",
              )}
            >
              <Icon className="h-7 w-7 text-[#B38B49]" strokeWidth={1.1} aria-hidden />
              <h3
                className={cn("mt-5 text-[19px] font-normal leading-snug", ink.strong)}
                style={serif}
              >
                {title}
              </h3>
              <p className={cn("mt-3 text-pretty text-[14px] leading-relaxed", ink.muted)}>
                {text}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Професійний простір ── */}
      <section className="relative mt-20 overflow-hidden bg-[#142744]">
        <svg
          aria-hidden
          viewBox="0 0 240 240"
          className="pointer-events-none absolute -left-16 -top-4 h-72 w-72"
          fill="none"
        >
          <path
            d="M 4 236 A 150 150 0 0 1 236 60"
            stroke="#B38B49"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <path
            d="M 4 190 A 118 118 0 0 1 190 36"
            stroke="#B38B49"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        </svg>

        <div
          className={cn(
            SHELL,
            "relative grid gap-10 py-14 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-12",
          )}
        >
          <div>
            <h2
              className="text-balance text-[2rem] font-normal leading-tight text-[#F8F4EC]"
              style={serif}
            >
              Професійний простір VSI
            </h2>
            {/*
              Два абзаци вступу з тексту. У макеті цього місця не видно —
              там лише заголовок, — але викидати написане я не став.
            */}
            <p className="mt-5 text-pretty text-[13.5px] leading-[1.7] text-[#D6D3DD]">
              VSI створює професійне середовище для фахівців, які працюють в аналітичному,
              психоаналітичному, психодинамічному, юнгіанському та близьких до них напрямках.
            </p>
            <p className="mt-3 text-pretty text-[13.5px] leading-[1.7] text-[#AAA8B5]">
              Для нас важливі професійна етика, відповідальність за власну практику, регулярний
              професійний розвиток, супервізія та повага до меж терапевтичних стосунків.
            </p>
          </div>

          <ul className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-5 lg:border-l lg:border-[#F8F4EC]/15 lg:pl-12">
            {PROFESSIONAL.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <Icon className="h-6 w-6 text-[#D9B269]" strokeWidth={1.1} aria-hidden />
                <h3
                  className="mt-3 text-[15px] font-normal leading-snug text-[#F8F4EC]"
                  style={serif}
                >
                  {title}
                </h3>
                <p className="mt-2 text-pretty text-[12px] leading-relaxed text-[#AAA8B5]">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Два входи ── */}
      <section className={cn(SHELL, "mt-16 grid gap-7 lg:grid-cols-2")}>
        {AUDIENCES.map(({ icon: Icon, title, paragraphs, cta, href }) => (
          <div
            key={title}
            className="flex h-full flex-col rounded-[28px] border border-[#B38B49]/35 bg-[#FFFDF8]/70 px-8 py-9 sm:px-10"
          >
            <div className="flex items-center gap-4">
              <Icon className="h-7 w-7 shrink-0 text-[#B38B49]" strokeWidth={1.1} aria-hidden />
              <h2
                className={cn("text-[1.75rem] font-normal leading-snug", ink.strong)}
                style={serif}
              >
                {title}
              </h2>
            </div>

            <div className={cn("mt-6 space-y-4 text-[15px] leading-[1.75]", ink.muted)}>
              {paragraphs.map((p) => (
                <p key={p.slice(0, 32)} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>

            {/* mt-auto тримає кнопки на одній лінії, коли тексти різної довжини */}
            <div className="mt-auto pt-8">
              <Link
                href={href}
                className={cn(
                  "group inline-flex min-h-[52px] items-center gap-3 rounded-full border border-[#B38B49]/55 px-7 text-[15px] text-[#142744]",
                  "transition-colors hover:border-[#B38B49] hover:bg-[#B38B49]/[0.07] motion-reduce:transition-none",
                  focusRing,
                )}
              >
                {cta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ── Траєкторія цілісності ── */}
      <section
        className={cn(
          SHELL,
          "mt-20 grid items-center gap-10 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-12",
        )}
      >
        <div>
          <SectionTitle>Траєкторія цілісності</SectionTitle>
          <div className={cn("mt-6 space-y-4 text-[14px] leading-[1.8]", ink.muted)}>
            <p className="text-pretty">
              Ми не бачимо психотерапію як шлях до ідеальної версії себе.
            </p>
            <p className="text-pretty">
              Для нас це можливість краще розуміти власне психічне життя, помічати його складність,
              зустрічатися з різними частинами себе і поступово знаходити більш цілісний спосіб бути
              у стосунках із собою, іншими людьми та світом.
            </p>
            <p className="text-pretty">
              VSI створений як простір, у якому можуть зустрічатися психотерапевтична практика,
              професійна думка, навчання і люди, для яких важливе глибше розуміння себе.
            </p>
          </div>
        </div>

        {/*
          Ілюстрація без рамки: її тло — той самий кремовий, що й у
          сторінки, тож рамка намалювала б зайвий прямокутник навколо
          того, що й так ціле.
        */}
        <Image
          src="/brand/motifs/trajectory.png"
          alt="Пагорби й вода у вранішньому світлі, над ними — тонка золота орбіта"
          width={1774}
          height={887}
          sizes="(min-width: 1024px) 600px, 100vw"
          className="h-auto w-full"
        />
      </section>
    </div>
  );
}
