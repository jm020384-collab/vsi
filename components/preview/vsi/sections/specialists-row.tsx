import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { AvatarPortrait } from "../decor";
import type { Therapist } from "../data";
import { focusRing, ink } from "../theme";

/** Скільки карток кладемо в стрічку. Далі — «Усі фахівці». */
const COUNT = 8;

/** Максимум тем на картці: більше не читається, а перетворюється на список. */
const TOPICS = 3;

/**
 * Знаки біля тем — абстрактні лінійні мітки, а не піктограми змісту.
 *
 * Вони не пояснюють тему (жодна іконка не скаже «емоційна регуляція»),
 * а лише дають оку точку опори на початку рядка. Тому набір навмисно
 * позбавлений предметності: орбіта, спалах, листок, коло, шлях, промінь.
 */
const GLYPHS: Array<() => React.ReactElement> = [
  // орбіта
  () => (
    <>
      <circle cx="8" cy="8" r="1.9" />
      <ellipse cx="8" cy="8" rx="6.5" ry="2.9" transform="rotate(-25 8 8)" />
    </>
  ),
  // спалах
  () => (
    <path d="M8 1.8c.4 3.5 2.7 5.8 6.2 6.2-3.5.4-5.8 2.7-6.2 6.2-.4-3.5-2.7-5.8-6.2-6.2 3.5-.4 5.8-2.7 6.2-6.2Z" />
  ),
  // листок
  () => (
    <>
      <path d="M13.3 2.7c0 5.8-3.7 9.5-9.6 10.6C2.6 7.4 6.3 3.7 13.3 2.7Z" />
      <path d="M4.6 12.5C6.9 9.6 9.3 7.2 12.1 5.3" />
    </>
  ),
  // коло з ядром
  () => (
    <>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.1" />
    </>
  ),
  // шлях
  () => <path d="M2.6 13.2c0-3.6 2.4-5.1 5.4-5.1s5.4-1.5 5.4-5.3" />,
  // промінь
  () => (
    <>
      <path d="M4.1 11.4a3.9 3.9 0 0 1 7.8 0" />
      <path d="M8 2.2v1.7M3.4 4.3l1.2 1.2M12.6 4.3l-1.2 1.2" />
    </>
  ),
];

/**
 * Одна й та сама тема має отримувати той самий знак на всіх картках,
 * інакше ряд читається як випадковий шум. Тому індекс — від тексту теми,
 * а не від позиції в списку.
 */
function glyphFor(topic: string) {
  let h = 0;
  for (let i = 0; i < topic.length; i += 1) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return GLYPHS[h % GLYPHS.length] ?? GLYPHS[0]!;
}

function TopicGlyph({ topic }: { topic: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden
      className="mt-[2px] h-[13px] w-[13px] shrink-0 text-[#B38B49]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphFor(topic)()}
    </svg>
  );
}

/**
 * Знайомство з фахівцями — одна горизонтальна стрічка вузьких карток.
 *
 * Заголовок тримається сітки сторінки, а сама стрічка виходить за її
 * праву межу: остання картка обрізається краєм екрана і тим самим каже,
 * що список гортається — без стрілок і крапок, які тут виглядали б як
 * елементи каталогу. Ліворуч стрічка вирівняна з рештою сторінки через
 * calc: до 1180px це звичайний відступ, ширше — половина вільного поля.
 *
 * На картці немає ні цін, ні рейтингів, ні кнопки «забронювати»: на
 * головній ідеться про знайомство, а не про вибір за прайсом.
 */
export function SpecialistsRow({ therapists }: { therapists: Therapist[] }) {
  const items = therapists.slice(0, COUNT);
  if (items.length === 0) return null;

  return (
    <section id="therapists" className="bg-[#F8F4EC]">
      <Wrap className="pb-4 pt-4 lg:pb-5 lg:pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            className={cn(
              "text-[14px] font-normal uppercase tracking-[0.16em] lg:text-[16px]",
              ink.strong,
            )}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Познайомитися з фахівцями
          </h2>
          <Link
            href="/therapists"
            className={cn(
              "group/all inline-flex items-center gap-1.5 text-[13px] text-[#1C3557]",
              "hover:text-[#142744]",
              focusRing,
            )}
          >
            Усі фахівці
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover/all:translate-x-1 motion-reduce:transition-none"
              aria-hidden
            />
          </Link>
        </div>
      </Wrap>

      <div
        className={cn(
          "overflow-x-auto overscroll-x-contain pb-6 lg:pb-8",
          "snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // Ліва межа стрічки = ліва межа сітки сторінки: до 1180px це
          // звичайний відступ, ширше — половина вільного поля плюс він же.
          "[--rail-pad:1.25rem] sm:[--rail-pad:2rem]",
          "lg:[--rail-pad:max(2.5rem,calc((100%-1180px)/2+2.5rem))]",
          // scroll-padding обов'язковий: зі snap-mandatory браузер інакше
          // підтягує першу картку до самого краю, з'їдаючи padding-left.
          "scroll-pl-[var(--rail-pad)] pl-[var(--rail-pad)] pr-[var(--rail-pad)]",
        )}
      >
        <ul className="flex items-stretch gap-3 sm:gap-4 lg:gap-[18px]">
          {items.map((t, i) => (
            <li
              key={t.id}
              className="w-[78vw] max-w-[290px] shrink-0 snap-start sm:w-[290px] lg:w-[256px]"
            >
              <Link
                href={`/specialists/${t.id}`}
                className={cn(
                  "group flex h-full min-h-[292px] gap-3.5 rounded-[18px] p-3.5",
                  "border border-[#142744]/10 bg-[#FFFDF8]",
                  "transition-[transform,border-color] duration-300",
                  "hover:-translate-y-0.5 hover:border-[#B38B49]/55",
                  "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
                  focusRing,
                )}
              >
                <div className="w-[86px] shrink-0 self-stretch overflow-hidden rounded-[13px] lg:w-[92px]">
                  <AvatarPortrait
                    name={t.name}
                    seed={i}
                    photo={t.photo}
                    arch={t.portraitStyle === "arch"}
                    sizes="(min-width: 1024px) 92px, 86px"
                    className={cn(
                      "h-full w-full transition-transform duration-500",
                      "group-hover:scale-[1.015] motion-reduce:transition-none",
                    )}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3
                    className={cn("text-[15px] leading-snug lg:text-[16px]", ink.strong)}
                    style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  >
                    {t.name}
                  </h3>
                  <p
                    className={cn(
                      // Чотири рядки, а не три: реальні звання на кшталт
                      // «аналітично орієнтована психологиня, психотерапевтка,
                      // арт-терапевтка» інакше обриваються на півслові.
                      "mt-1.5 line-clamp-4 text-[10px] uppercase leading-[1.5] tracking-[0.08em]",
                      ink.muted,
                    )}
                  >
                    {t.status}
                  </p>

                  {t.topics.length > 0 && (
                    <>
                      <span aria-hidden className="my-3 block h-px bg-[#B38B49]/30" />
                      <ul className="space-y-1.5">
                        {t.topics.slice(0, TOPICS).map((topic) => (
                          <li
                            key={topic}
                            className={cn("flex gap-2 text-[11px] leading-tight", ink.soft)}
                          >
                            <TopicGlyph topic={topic} />
                            <span className="min-w-0">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <ArrowRight
                    aria-hidden
                    className={cn(
                      "mt-auto h-4 w-4 self-end text-[#B38B49]",
                      "transition-transform duration-200 group-hover:translate-x-1",
                      "motion-reduce:transition-none",
                    )}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
