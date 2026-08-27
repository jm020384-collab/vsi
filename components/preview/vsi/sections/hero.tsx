import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Wrap } from "../ui";
import { focusRing, ink } from "../theme";

/**
 * Два природні входи в один професійний простір VSI — не аудиторні
 * персони й не комерційні картки, а typography-first продовження
 * позиціонування з основного абзацу.
 */
const AUDIENCES = [
  {
    title: "Для тих, хто шукає терапію або хоче краще зрозуміти себе",
    text: "Досліджуйте теми, читайте матеріали фахівців і знайомтеся з їхньою професійною позицією.",
    cta: "Досліджувати",
    href: "/explore",
  },
  {
    title: "Для фахівців",
    text: "Публікуйте дослідження, знаходьте супервізію, навчальні можливості та професійне середовище для розвитку й обміну.",
    cta: "Для фахівців",
    href: "/register?role=THERAPIST",
  },
];

/**
 * Hero: текст ліворуч, ключовий візуал праворуч.
 *
 * Картинка йде без рамок і тіней; її краї розчиняються радіальною
 * маскою, тож власний паперовий фон зображення безшовно зливається
 * з тлом секції. На мобільному візуал стає під текст.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#F8F4EC]">
      <Wrap>
        <div className="grid items-center gap-10 pb-14 pt-8 md:grid-cols-2 md:gap-12 lg:pb-20 lg:pt-10">
          {/* ── Текст ── */}
          <div className="relative max-w-[34rem]">
            <h1
              className={`text-balance text-[2rem] font-normal leading-[1.15] tracking-[-0.01em] sm:text-[2.5rem] lg:text-[2.75rem] ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Аналітично орієнтована психотерапія
            </h1>
            <p className="mt-3 text-[15px] font-medium uppercase tracking-[0.28em] text-[#876428]">
              Траєкторія цілісності
            </p>

            <p className={`mt-6 text-pretty text-[17px] leading-[1.75] sm:text-lg ${ink.body}`}>
              VSI створює професійний простір аналітично орієнтованої психотерапії та юнгіанської
              традиції.
            </p>
            <p className={`mt-3.5 text-pretty text-[15px] leading-[1.7] ${ink.soft}`}>
              Тут можна знайомитися з аналітичною психологією, читати тексти й дослідження,
              знаходити фахівців і супервізорів, а також долучатися до професійних груп, лекцій,
              семінарів та інших освітніх подій.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/explore" variant="primary">
                Досліджувати
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/therapists" variant="outline">
                Фахівці
              </ButtonLink>
            </div>
          </div>

          {/* ── Візуал: арка дня і ночі ── */}
          {/*
            front-trim.png — та сама картинка зі зрізаними полями і
            СПРАВЖНІМ прозорим фоном: scripts/trim-front.js м'яко
            ключує папір у альфа-канал. Композиція ціла — арка й
            повні еліпси орбіт; маски та фільтри не потрібні.
          */}
          {/* Портретна композиція — вужча колонка, щоб не тиснути на текст */}
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[330px] md:max-w-[400px]">
            <Image
              src="/brand/motifs/front-trim.png"
              alt="Арка, розділена навпіл: ліворуч денне небо із сонцем, праворуч нічне з місяцем; внизу гори й морський горизонт, навколо — золоті орбіти"
              width={1024}
              height={1450}
              priority
              sizes="(max-width: 768px) 330px, 400px"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* ── Два входи в один простір ── */}
        <div className="border-t border-[#B38B49]/25 pb-8 pt-6 lg:pb-10 lg:pt-8">
          <div className="grid items-start gap-8 sm:grid-cols-2 sm:gap-12 lg:gap-16">
            {AUDIENCES.map((a, i) => (
              <div
                key={a.title}
                className={cn(
                  "max-w-md",
                  i === 1 && "sm:border-l sm:border-[#B38B49]/20 sm:pl-12 lg:pl-20",
                )}
              >
                <h2
                  className={`text-xl font-normal leading-snug sm:text-[1.35rem] ${ink.strong}`}
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {a.title}
                </h2>
                <p className={`mt-3 text-[15px] leading-relaxed ${ink.soft}`}>{a.text}</p>
                <a
                  href={a.href}
                  className={cn(
                    "group/cta mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#1C3557]",
                    "transition-colors hover:text-[#142744] motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  {a.cta}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </a>
              </div>
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
