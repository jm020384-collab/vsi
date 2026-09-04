import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Wrap } from "../ui";
import { focusRing, focusRingDark, ink } from "../theme";

/**
 * Два природні входи в один професійний простір VSI — не аудиторні
 * персони й не комерційні картки, а typography-first продовження
 * позиціонування з основного абзацу.
 */
const AUDIENCES = [
  {
    title: "Для тих, хто шукає підтримку",
    text: "Досліджуйте теми, читайте тексти фахівців і знайомтеся з їхньою професійною позицією.",
    cta: "Досліджувати",
    href: "/explore",
    icon: "/brand/motifs/arch-client.png",
  },
  {
    title: "Для фахівців",
    text: "Професійний простір для практики, публікацій, супервізії, навчання та участі в аналітичному середовищі.",
    cta: "У простір фахівців",
    href: "/register",
    icon: "/brand/motifs/arch-pro.png",
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
    <section id="top" className="relative bg-[#F8F4EC]">
      {/*
        Фонове зображення на всю ширину. Композиція сама тримає арку
        праворуч, а ліворуч лишає небо й воду — саме туди лягає текст.
        Затемнення-скрим ліворуч гарантує контраст навіть тоді, коли
        кадрування зрізає світлу частину (вузькі екрани).
      */}
      <div className="relative min-h-[440px] w-full sm:min-h-[520px] lg:min-h-[600px]">
        <Image
          src="/brand/motifs/hero.png"
          alt="Арка, розділена навпіл: ліворуч денне небо із сонцем, праворуч нічне із місяцем; довкола гори, вода й золоті орбіти"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center] lg:object-center"
        />
        {/*
          Позиції всіх трьох точок задані явно: без них Tailwind ставив
          кінцеву точку раніше за середню, і градієнт вироджувався в
          суцільну заливку, яка перекривала зображення.
        */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-gradient-to-r",
            // На вузьких екранах кадр не встигає відійти від арки, тож
            // вуаль там ніде не сходить нанівець — інакше текст лягав
            // просто на візерунок і ставав нечитабельним.
            "from-[#F8F4EC] from-0% via-[#F8F4EC]/90 via-55% to-[#F8F4EC]/55 to-100%",
            "lg:via-[#F8F4EC]/60 lg:via-30% lg:to-transparent lg:to-60%",
          )}
        />

        <Wrap className="relative flex min-h-[440px] items-center py-10 sm:min-h-[520px] lg:min-h-[600px]">
          {/*
            Знак «VSI» — великим планом, як у макеті, але це декор:
            заголовком сторінки лишається сам напрям роботи, інакше
            в пошуку й для скрінрідера сторінка звалася б просто «VSI».
          */}
          <div className="max-w-[30rem]">
            <p
              aria-hidden
              className={`text-[3.25rem] font-normal leading-none tracking-[0.14em] sm:text-[4rem] ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              VSI
            </p>
            <h1
              className={`mt-4 text-balance text-[14px] font-medium uppercase leading-relaxed tracking-[0.2em] sm:text-[15px] ${ink.strong}`}
            >
              Аналітично орієнтована психотерапія
            </h1>
            <p className="mt-3 flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.24em] text-[#876428] sm:text-[13px]">
              <span aria-hidden className="h-px w-6 bg-[#B38B49]/70" />
              Траєкторія цілісності
            </p>

            <p className={`mt-5 max-w-sm text-pretty text-[16px] leading-[1.75] ${ink.body}`}>
              Професійний простір аналітичної думки, психотерапевтичної практики та зустрічі.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/explore" variant="primary">
                Досліджувати
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/therapists" variant="outline">
                Познайомитися з фахівцями
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Wrap>
      </div>

      <Wrap>
        {/* ── Два входи в один простір ── */}
        <div className="pb-10 pt-10 lg:pb-12 lg:pt-12">
          <div className="grid gap-6 sm:grid-cols-2">
            {AUDIENCES.map((a, i) => {
              const dark = i === 1;
              return (
                <div
                  key={a.title}
                  className={cn(
                    "flex items-center gap-5 rounded-2xl p-6 sm:gap-6 sm:p-8",
                    dark ? "bg-[#142744]" : "border border-[#142744]/10 bg-[#FFFDF8]",
                  )}
                >
                  <Image
                    src={a.icon}
                    alt=""
                    aria-hidden
                    width={200}
                    height={200}
                    className="h-28 w-28 shrink-0 object-contain sm:h-40 sm:w-40"
                  />
                  <div>
                    <h2
                      className={cn(
                        "text-xl font-normal leading-snug sm:text-[1.35rem]",
                        dark ? "text-[#F8F4EC]" : ink.strong,
                      )}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {a.title}
                    </h2>
                    <p
                      className={cn(
                        "mt-3 text-[15px] leading-relaxed",
                        dark ? "text-[#C9C7D1]" : ink.soft,
                      )}
                    >
                      {a.text}
                    </p>
                    <a
                      href={a.href}
                      className={cn(
                        "group/cta mt-5 inline-flex items-center gap-1.5 text-sm font-medium",
                        dark
                          ? "text-[#F8F4EC] hover:text-[#E9DECE]"
                          : "text-[#1C3557] hover:text-[#142744]",
                        "transition-colors motion-reduce:transition-none",
                        dark ? focusRingDark : focusRing,
                      )}
                    >
                      {a.cta}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Wrap>
    </section>
  );
}
