"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  FileText,
  Inbox,
  Users,
  CalendarDays,
  GraduationCap,
  Rss,
  BookOpen,
  Phone,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { focusRing, ink } from "@/components/preview/vsi/theme";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  soon?: boolean;
}

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Огляд", icon: LayoutGrid },
  { href: "/dashboard/profile", label: "Мій простір", icon: User },
  { href: "/dashboard/articles", label: "Публікації", icon: FileText },
  { href: "/dashboard/requests", label: "Звернення", icon: Inbox },
  { href: "/dashboard/supervision", label: "Супервізія", icon: Users, soon: true },
  { href: "/dashboard/events", label: "Події", icon: CalendarDays },
  { href: "/dashboard/subscriptions", label: "Мої підписки", icon: Rss, soon: true },
  { href: "/dashboard/development", label: "Професійний розвиток", icon: BookOpen, soon: true },
  { href: "/dashboard/qualifications", label: "Кваліфікації", icon: GraduationCap },
  { href: "/dashboard/contact", label: "Контакт і доступність", icon: Phone },
  { href: "/dashboard/settings", label: "Налаштування", icon: Settings, soon: true },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Огляд адміністрування", icon: ShieldCheck },
  { href: "/admin/therapists", label: "Фахівці й каталог", icon: Users },
  { href: "/admin/articles", label: "Статті на перевірці", icon: FileText },
  { href: "/admin/reviews", label: "Відгуки на модерації", icon: Inbox },
  { href: "/admin/requests", label: "Звернення", icon: Phone },
];

export function DashboardSidebar({
  userName,
  isAdmin,
}: {
  userName?: string | null;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-[248px]">
      <div className="lg:sticky lg:top-24">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
          Кабінет фахівця
        </p>
        {userName && (
          <p
            className={cn("mt-1.5 truncate text-lg font-normal", ink.strong)}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
          >
            {userName}
          </p>
        )}

        <nav
          className="mt-6 flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          aria-label="Навігація кабінету"
        >
          {NAV.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] transition-colors motion-reduce:transition-none lg:whitespace-normal",
                  active
                    ? "bg-[#1C3557]/[0.07] font-medium text-[#1C3557]"
                    : cn(ink.muted, "hover:bg-[#142744]/[0.04] hover:text-[#142744]"),
                  focusRing,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-0 top-1/2 hidden h-4 w-[2px] -translate-y-1/2 rounded-full bg-[#B38B49] lg:block",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {item.label}
                {item.soon && (
                  <span className="ml-auto hidden shrink-0 text-[10px] uppercase tracking-[0.1em] text-[#8C93A0] lg:inline">
                    скоро
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {isAdmin && (
          <div className="mt-6 border-t border-[#142744]/10 pt-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
              Адміністрування
            </p>
            <nav
              className="mt-3 flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
              aria-label="Навігація адміністрування"
            >
              {ADMIN_NAV.map((item) => {
                const active =
                  item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] transition-colors motion-reduce:transition-none lg:whitespace-normal",
                      active
                        ? "bg-[#1C3557]/[0.07] font-medium text-[#1C3557]"
                        : cn(ink.muted, "hover:bg-[#142744]/[0.04] hover:text-[#142744]"),
                      focusRing,
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute left-0 top-1/2 hidden h-4 w-[2px] -translate-y-1/2 rounded-full bg-[#B38B49] lg:block",
                        active ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
