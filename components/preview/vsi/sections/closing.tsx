import { ArrowRight } from "lucide-react";

import { ButtonLink, Wrap } from "../ui";
import { cn } from "@/lib/utils";
import { ink, VSI } from "../theme";

/** Тонка золота лінія з декором — розділювач у завершенні сторінки. */
function Ornament({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 160 40"
      aria-hidden
      fill="none"
      className={cn("hidden h-9 w-40 shrink-0 md:block", flip && "-scale-x-100")}
    >
      <g stroke={VSI.gold} strokeOpacity="0.5" strokeWidth="1">
        <line x1="0" y1="20" x2="96" y2="20" strokeDasharray="1 5" />
        <circle cx="118" cy="20" r="9" />
        <path d="M118 6 A 14 14 0 0 1 118 34" strokeOpacity="0.8" />
      </g>
      <circle cx="118" cy="11" r="2" fill={VSI.gold} />
    </svg>
  );
}

/**
 * Завершення сторінки — повернення до слогана бренду.
 *
 * Тут свідомо немає форми й нових обіцянок: після темної смуги для
 * фахівців сторінка має закінчитися тишею, а не ще одним закликом.
 */
export function Closing() {
  return (
    <section id="closing" className="bg-[#F8F4EC]">
      <Wrap className="pb-12 pt-4 text-center lg:pb-16 lg:pt-6">
        <div className="flex items-center justify-center gap-4">
          <Ornament />
          <h2
            className={cn("shrink-0 text-2xl font-normal sm:text-[1.75rem]", ink.strong)}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            Траєкторія цілісності
          </h2>
          <Ornament flip />
        </div>

        <p
          className={cn("mx-auto mt-5 max-w-xl text-pretty text-[15px] leading-relaxed", ink.muted)}
        >
          Шлях до себе не завжди починається з готової відповіді. Іноді він починається з питання.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/explore" variant="primary">
            Досліджувати
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/therapists" variant="outline">
            Познайомитися з фахівцями
          </ButtonLink>
        </div>
      </Wrap>
    </section>
  );
}
