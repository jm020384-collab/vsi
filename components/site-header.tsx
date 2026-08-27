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

const NAV = [
  { href: "/explore", label: "Досліджувати" },
  { href: "/therapists", label: "Фахівці" },
  { href: "/library", label: "Бібліотека" },
  { href: "/events", label: "Події" },
  { href: "/pro-metod", label: "Про терапію" },
  { href: "/register?role=THERAPIST", label: "Для фахівців" },
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
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center"
            aria-label={`${BRAND.name} — на головну`}
          >
            <LogoVsi className="font-serif text-[2.2rem] text-foreground" />
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
                      ? "font-medium text-foreground after:scale-x-100"
                      : "text-foreground/70 after:scale-x-0 hover:text-foreground hover:after:scale-x-100",
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
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                >
                  <User className="h-4 w-4" />
                  Кабінет фахівця
                </Link>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary"
                >
                  <User className="h-4 w-4" />
                  {user.name ?? user.email}
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Вийти
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Увійти</Link>
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* ── Мобільне меню ── */}
      <div className={cn("lg:hidden", open ? "block border-t border-border" : "hidden")}>
        <nav className="container flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-sm font-medium hover:bg-secondary"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
            {status === "authenticated" && user ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  href={user.role === "THERAPIST" || user.role === "ADMIN" ? "/dashboard" : "/"}
                  className="rounded-md border border-border px-3 py-2 text-center text-sm"
                >
                  {user.role === "THERAPIST" || user.role === "ADMIN"
                    ? "Кабінет фахівця"
                    : "Кабінет"}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                  Вийти
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm" onClick={() => setOpen(false)}>
                <Link href="/login">Увійти</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
