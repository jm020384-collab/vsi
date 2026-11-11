"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/theme-toggle";
import { LogoVsi } from "@/components/brand/vsi/logo-vsi";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

// «Навчання» і «Супервізія» з макета поки не додані — під ними ще немає
// сторінок, а пункт меню в нікуди гірший за його відсутність.
const NAV = [
  { href: "/pro-metod", label: "Про простір" },
  { href: "/therapists", label: "Фахівці" },
  { href: "/library", label: "Тексти" },
  { href: "/events", label: "Події" },
  { href: "/social-support", label: "Соціальна підтримка" },
];

/** Засічковий шрифт знака — тим самим набрані і пункти меню. */
const serif = { fontFamily: "var(--vsi-serif), Georgia, serif" } as const;

/** Тонкий вертикальний розділювач між групами шапки. */
function Divider() {
  return <span aria-hidden className="hidden h-7 w-px bg-[#F8F4EC]/15 lg:block" />;
}

const PILL =
  "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[14px] transition-colors motion-reduce:transition-none xl:px-5 xl:text-[15px]";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B38B49] focus-visible:ring-offset-2 focus-visible:ring-offset-[#122441]";

/**
 * Шапка сайту: знак, навігація і дії акаунта в одному полі.
 *
 * Тло — не плаский синій, а глибина: темніше по краях і тепліше в
 * центрі. Активний пункт позначений золотою пігулкою, а не підкресленням
 * знизу: у рядку з пʼяти пунктів пігулку видно відразу.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;
  const isPro = user?.role === "THERAPIST" || user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 bg-[#122441]">
      {/* Мʼяке світло до центру — щоб смуга не читалася як плаский прямокутник */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 180% at 38% 120%, rgba(45,78,124,0.55) 0%, rgba(18,36,65,0) 62%)",
        }}
      />

      <div className="container relative flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-4 xl:gap-6">
          <Link
            href="/"
            className={cn("group flex items-center rounded-xl", FOCUS)}
            aria-label={`${BRAND.name} — на головну`}
          >
            <LogoVsi className="font-serif text-[2.2rem] text-[#F8F4EC]" />
          </Link>

          <Divider />

          <nav
            className="hidden items-center gap-0.5 lg:flex xl:gap-1.5"
            aria-label="Основна навігація"
          >
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={serif}
                  className={cn(
                    // Пʼять пунктів засічковим шрифтом не вміщаються в рядок на
                    // 1024px — там вони дрібніші й щільніші, повний розмір з xl.
                    "whitespace-nowrap rounded-full px-3 py-2 text-[15px] xl:px-4 xl:text-[17px]",
                    "transition-colors motion-reduce:transition-none",
                    active
                      ? "border border-[#B38B49]/55 bg-[#B38B49]/[0.14] text-[#E7C77B]"
                      : "border border-transparent text-[#F8F4EC]/80 hover:text-[#F8F4EC]",
                    FOCUS,
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 xl:gap-3">
          <ThemeToggle />

          {status === "authenticated" && user ? (
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href={isPro ? "/dashboard" : "/"}
                style={serif}
                className={cn(
                  PILL,
                  "border border-[#B38B49]/55 text-[#F8F4EC]",
                  "hover:border-[#B38B49] hover:bg-[#B38B49]/[0.12]",
                  FOCUS,
                )}
              >
                <User className="h-4 w-4 text-[#E7C77B]" strokeWidth={1.6} aria-hidden />
                {isPro ? "Кабінет фахівця" : (user.name ?? user.email)}
              </Link>

              <Divider />

              <button
                type="button"
                style={serif}
                onClick={() => signOut({ callbackUrl: "/" })}
                className={cn(
                  "whitespace-nowrap rounded-full px-2 py-2 text-[15px] text-[#F8F4EC]/80 transition-colors hover:text-[#F8F4EC] xl:text-[17px]",
                  "motion-reduce:transition-none",
                  FOCUS,
                )}
              >
                Вийти
              </button>
            </div>
          ) : (
            <div className="hidden items-center gap-4 lg:flex">
              <Link
                href="/login"
                style={serif}
                className={cn(
                  "whitespace-nowrap rounded-full px-2 py-2 text-[15px] text-[#F8F4EC]/80 transition-colors hover:text-[#F8F4EC] xl:text-[17px]",
                  "motion-reduce:transition-none",
                  FOCUS,
                )}
              >
                Увійти
              </Link>

              <Divider />

              {/* Головна дія шапки — реєстрація фахівця */}
              <Link
                href="/register"
                style={serif}
                className={cn(
                  PILL,
                  "border border-[#B38B49]/55 text-[#F8F4EC]",
                  "hover:border-[#B38B49] hover:bg-[#B38B49]/[0.12]",
                  FOCUS,
                )}
              >
                <User className="h-4 w-4 text-[#E7C77B]" strokeWidth={1.6} aria-hidden />
                Створити профіль
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "grid h-11 w-11 place-items-center rounded-full text-[#F8F4EC] lg:hidden",
              "hover:bg-[#F8F4EC]/[0.08]",
              FOCUS,
            )}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── Мобільне меню ── */}
      <div
        className={cn("relative lg:hidden", open ? "border-[#F8F4EC]/12 block border-t" : "hidden")}
      >
        <nav className="container flex flex-col py-3">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={serif}
                className={cn(
                  "rounded-full px-4 py-3 text-[17px] transition-colors motion-reduce:transition-none",
                  active ? "bg-[#B38B49]/[0.14] text-[#E7C77B]" : "text-[#F8F4EC]/85",
                  FOCUS,
                )}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="border-[#F8F4EC]/12 mt-3 flex flex-col gap-2 border-t pt-3">
            {status === "authenticated" && user ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  href={isPro ? "/dashboard" : "/"}
                  style={serif}
                  className={cn(
                    "rounded-full border border-[#B38B49]/55 px-4 py-3 text-center text-[16px] text-[#F8F4EC]",
                    FOCUS,
                  )}
                >
                  {isPro ? "Кабінет фахівця" : "Кабінет"}
                </Link>
                <button
                  type="button"
                  style={serif}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={cn(
                    "rounded-full px-4 py-3 text-[16px] text-[#F8F4EC]/80 hover:text-[#F8F4EC]",
                    FOCUS,
                  )}
                >
                  Вийти
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                style={serif}
                className={cn(
                  "rounded-full border border-[#B38B49]/55 px-4 py-3 text-center text-[16px] text-[#F8F4EC]",
                  FOCUS,
                )}
              >
                Увійти
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
