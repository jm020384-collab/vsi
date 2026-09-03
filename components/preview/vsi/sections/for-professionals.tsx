import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Wrap } from "../ui";
import { focusRingDark } from "../theme";

const FEATURES = [
  {
    icon: User,
    title: "Професійний простір",
    text: "Створюйте профіль і представляйте свою практику.",
  },
  {
    icon: FileText,
    title: "Публікації",
    text: "Діліться текстами, дослідженнями та професійною думкою.",
  },
  {
    icon: Users,
    title: "Супервізія",
    text: "Знаходьте супервізорів та професійні групи.",
  },
  {
    icon: CalendarDays,
    title: "Події та навчання",
    text: "Стежте за лекціями, семінарами, конференціями та програмами.",
  },
];

/**
 * Смуга для фахівців — єдиний темний блок у тілі сторінки.
 *
 * Він же виконує роль головного заклику зареєструватися: далі на
 * сторінці лишається тільки спокійне завершення, без ще одного CTA.
 */
export function ForProfessionals() {
  return (
    <section id="for-professionals" className="bg-[#142744]">
      <Wrap className="py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
          <div>
            <h2 className="text-[13px] font-medium uppercase tracking-[0.2em] text-[#E9DECE]">
              Для фахівців
            </h2>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-[#C9C7D1]">
              VSI — місце професійної присутності та розвитку в аналітичному середовищі.
            </p>
            <Link
              href="/register"
              className={cn(
                "group/cta mt-6 inline-flex min-h-[46px] items-center gap-2 rounded-xl border border-[#F8F4EC]/30 px-5 text-sm font-medium text-[#F8F4EC]",
                "transition-colors hover:border-[#F8F4EC]/60 hover:bg-[#F8F4EC]/[0.08] motion-reduce:transition-none",
                focusRingDark,
              )}
            >
              Створити професійний простір
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1 motion-reduce:transition-none"
                aria-hidden
              />
            </Link>
          </div>

          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span
                  aria-hidden
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#B38B49]/45"
                >
                  <Icon className="h-5 w-5 text-[#D9B269]" strokeWidth={1.2} />
                </span>
                <h3 className="mt-4 text-[12px] font-medium uppercase tracking-[0.14em] text-[#E9DECE]">
                  {title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[#AAA8B5]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
