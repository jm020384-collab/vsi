import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonLink, Wrap } from "../ui";
import { focusRing, focusRingDark, ink } from "../theme";
import { getI18n } from "@/lib/i18n/server";
import Link from "@/components/i18n/link";

/**
 * Два природні входи в один професійний простір VSI — не аудиторні
 * персони й не комерційні картки, а typography-first продовження
 * позиціонування з основного абзацу.
 */
const AUDIENCES = [
  {
    title: "Для тих, хто шукає підтримку",
    text: "Обирайте психолога чи психотерапевта, досліджуйте психічне життя через публікації фахівців і знайомтеся з аналітичною традицією.",
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
export async function Hero() {
  const { tr } = await getI18n();
  return (
    <section id="top" className="relative bg-[#F8F4EC]">
      {/*
        Фонове зображення на всю ширину. Композиція сама тримає арку
        праворуч, а ліворуч лишає небо й воду — саме туди лягає текст.
        Затемнення-скрим ліворуч гарантує контраст навіть тоді, коли
        кадрування зрізає світлу частину (вузькі екрани).
      */}
      <div className="lg:relative lg:min-h-[480px] lg:overflow-hidden">
        {/*
          Арка має бути видна цілою, тому висота картинки не залежить від
          ширини екрана. Кадр 1694×690 — це оригінал без зайвого неба
          зверху й води знизу. На широкому екрані він займає всю висоту
          блоку, тримається правого краю, а лівий бік розчиняється в
          кремовому тлі, де лежить текст. Якщо розтягнути його на всю
          ширину, як раніше, верх арки обрізається.

          Нижче за lg картинка стає окремою смугою над текстом; на телефоні
          зрізаються боки, а арка лишається в кадрі.
        */}
        <div className="relative h-[240px] w-full sm:aspect-[1694/690] sm:h-auto lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-auto">
          <Image
            src="/brand/motifs/hero.png"
            alt={tr(
              "Арка, розділена навпіл: ліворуч денне небо із сонцем, праворуч нічне із місяцем; довкола гори, вода й золоті орбіти",
            )}
            fill
            priority
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="object-cover object-[64%_center] sm:object-[center_21%] lg:[mask-image:linear-gradient(to_right,transparent,black_40%)]"
          />
          {/* М'який стик смуги з кремовим тлом під нею */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#F8F4EC] to-transparent lg:hidden"
          />
        </div>
        {/*
          Вуаль під текстом: на вузьких настільних екранах картинка заходить
          під нього. Позиції всіх трьох точок задані явно: без них Tailwind
          ставив кінцеву точку раніше за середню, і градієнт вироджувався в
          суцільну заливку.
        */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 hidden bg-gradient-to-r lg:block",
            "from-[#F8F4EC] from-0% via-[#F8F4EC]/50 via-30% to-transparent to-55%",
          )}
        />

        <Wrap className="relative flex items-center py-7 sm:py-8 lg:min-h-[480px]">
          {/*
            Знак «VSI» — великим планом, як у макеті, але це декор:
            заголовком сторінки лишається сам напрям роботи, інакше
            в пошуку й для скрінрідера сторінка звалася б просто «VSI».
          */}
          {/* До xl текст вужчий, щоб золоте кільце арки його не перетинало. */}
          <div className="max-w-[34rem]">
            <p
              aria-hidden
              className={`text-[3.25rem] font-normal leading-none tracking-[0.14em] sm:text-[4rem] ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              VSI
            </p>
            <div
              aria-hidden
              className="mt-5 h-px w-full bg-gradient-to-r from-[#B38B49] via-[#B38B49]/60 to-transparent"
            />
            <h1
              className={`mt-4 text-balance text-[1.6rem] font-medium italic leading-[1.2] sm:text-[2rem] lg:max-w-[27rem] xl:max-w-none ${ink.strong}`}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              {tr("Професійна спільнота аналітично орієнтованих психологів і психотерапевтів.")}
            </h1>

            <p
              className={`mt-3 text-pretty text-[16px] leading-[1.7] sm:text-[17px] lg:max-w-[27rem] xl:max-w-none ${ink.body}`}
            >
              {tr(
                "Простір, у якому ви можете знайти психолога чи психотерапевта та поглибити розуміння себе і процесів психічного життя.",
              )}
            </p>
            <div aria-hidden className="mt-5 h-px w-32 bg-[#B38B49]/80" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/explore" variant="primary">
                {tr("Досліджувати")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink href="/therapists" variant="outline">
                {tr("Познайомитися з фахівцями")}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </Wrap>
      </div>

      <Wrap>
        {/* ── Два входи в один простір ── */}
        <div className="pb-10 pt-8 lg:pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {AUDIENCES.map((a, i) => {
              const dark = i === 1;
              return (
                <div
                  key={a.title}
                  className={cn(
                    "flex items-center gap-5 rounded-2xl p-6 lg:gap-6 lg:p-8",
                    dark ? "bg-[#142744]" : "border border-[#142744]/10 bg-[#FFFDF8]",
                  )}
                >
                  <Image
                    src={a.icon}
                    alt=""
                    aria-hidden
                    width={200}
                    height={200}
                    className="h-28 w-28 shrink-0 object-contain lg:h-40 lg:w-40"
                  />
                  <div className="min-w-0">
                    <h2
                      className={cn(
                        "text-xl font-normal leading-snug sm:text-[1.35rem]",
                        dark ? "text-[#F8F4EC]" : ink.strong,
                      )}
                      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                    >
                      {tr(a.title)}
                    </h2>
                    <p
                      className={cn(
                        "mt-3 text-[15px] leading-relaxed",
                        dark ? "text-[#C9C7D1]" : ink.soft,
                      )}
                    >
                      {tr(a.text)}
                    </p>
                    <Link
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
                      {tr(a.cta)}
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </Link>
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
