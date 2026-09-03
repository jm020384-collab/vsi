"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
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
];

/**
 * Однорядний хедер: знак, навігація і дії акаунта в одному полі.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-[#142744]">
      <div className="container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center"
            aria-label={`${BRAND.name} — на головну`}
          >
            <LogoVsi className="font-serif text-[2.2rem] text-[#F8F4EC]" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основна навігація">
            {NAV.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2.5 text-sm transition-colors",
                    "after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:bg-[#B38B49] after:transition-transform",
                    active
                      ? "font-medium text-[#F8F4EC] after:scale-x-100"
                      : "text-[#F8F4EC]/70 after:scale-x-0 hover:text-[#F8F4EC] hover:after:scale-x-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {status === "authenticated" && user ? (
            <div className="hidden items-center gap-2 lg:flex">
              {user.role === "THERAPIST" || user.role === "ADMIN" ? (
                <Link
                  href="/dashboard"
                  className="border-[#F8F4EC]/28 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-[#F8F4EC] hover:border-[#F8F4EC]/55 hover:bg-[#F8F4EC]/[0.08]"
                >
                  <User className="h-4 w-4" />
                  Кабінет фахівця
                </Link>
              ) : (
                <Link
                  href="/"
                  className="border-[#F8F4EC]/28 inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-[#F8F4EC] hover:border-[#F8F4EC]/55 hover:bg-[#F8F4EC]/[0.08]"
                >
                  <User className="h-4 w-4" />
                  {user.name ?? user.email}
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-[#F8F4EC]/70 hover:bg-[#F8F4EC]/[0.08] hover:text-[#F8F4EC]"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Вийти
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/login"
                className="px-1 text-sm text-[#F8F4EC]/75 transition-colors hover:text-[#F8F4EC]"
              >
                Увійти
              </Link>
              {/* Головна дія шапки — реєстрація фахівця, як у макеті */}
              <Button asChild size="sm" className="bg-[#F8F4EC] text-[#142744] hover:bg-[#FFFDF8]">
                <Link href="/register">Створити профіль</Link>
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-[#F8F4EC] hover:bg-[#F8F4EC]/[0.08] hover:text-[#F8F4EC] lg:hidden"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Мобільне меню ── */}
      <div className={cn("lg:hidden", open ? "border-[#F8F4EC]/12 block border-t" : "hidden")}>
        <nav className="container flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium text-[#F8F4EC]/90 hover:bg-[#F8F4EC]/[0.08]"
            >
              {item.label}
            </Link>
          ))}
          <div className="border-[#F8F4EC]/12 mt-2 flex flex-col gap-2 border-t pt-2">
            {status === "authenticated" && user ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  href={user.role === "THERAPIST" || user.role === "ADMIN" ? "/dashboard" : "/"}
                  className="border-[#F8F4EC]/28 rounded-md border px-3 py-2 text-center text-sm text-[#F8F4EC]"
                >
                  {user.role === "THERAPIST" || user.role === "ADMIN"
                    ? "Кабінет фахівця"
                    : "Кабінет"}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#F8F4EC]/70 hover:bg-[#F8F4EC]/[0.08] hover:text-[#F8F4EC]"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Вийти
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="border-[#F8F4EC]/28 border text-[#F8F4EC] hover:bg-[#F8F4EC]/[0.08] hover:text-[#F8F4EC]"
                onClick={() => setOpen(false)}
              >
                <Link href="/login">Увійти</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
