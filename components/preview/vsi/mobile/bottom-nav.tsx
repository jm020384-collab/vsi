import { BookOpen, Home, Search, User, Users } from "lucide-react";

import { cn } from "@/lib/utils";

export type MobileTab = "home" | "search" | "materials" | "community" | "profile";

const TABS: { id: MobileTab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Головна", icon: Home },
  { id: "search", label: "Пошук", icon: Search },
  { id: "materials", label: "Матеріали", icon: BookOpen },
  { id: "community", label: "Спільнота", icon: Users },
  { id: "profile", label: "Профіль", icon: User },
];

/**
 * Нижня навігація.
 *
 * Кожна ціль — 44×44 мінімум (WCAG 2.5.5). Активний стан позначено
 * і кольором, і короткою золотою рискою: не покладаємось лише на колір.
 */
export function BottomNav({ active }: { active: MobileTab }) {
  return (
    <nav
      aria-label="Основна навігація"
      className="bg-[#FFFDF8]/92 sticky bottom-0 z-30 border-t border-[#142744]/10 pb-6 backdrop-blur-xl"
    >
      <ul className="flex items-stretch justify-around px-1 pt-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <li key={id} className="flex-1">
              <a
                href="#"
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-lg px-1 py-1",
                  "transition-colors duration-200 motion-reduce:transition-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1C3557] focus-visible:ring-offset-1",
                  isActive ? "text-[#142744]" : "text-[#5C6672] hover:text-[#142744]",
                )}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -top-1.5 h-px w-6 rounded-full bg-[#B38B49]"
                  />
                )}
                <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2 : 1.6} aria-hidden />
                <span className={cn("text-[10px] leading-none", isActive && "font-medium")}>
                  {label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
