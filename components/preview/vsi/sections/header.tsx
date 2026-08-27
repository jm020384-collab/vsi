"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { LogoVsi } from "@/components/brand/vsi/logo-vsi";
import { ButtonLink, Wrap } from "../ui";
import { focusRing, touch } from "../theme";

const NAV = [
  { label: "Підхід", href: "#approach" },
  { label: "Фахівці", href: "#therapists" },
  { label: "Як обрати", href: "#how-to-choose" },
  { label: "Матеріали", href: "#materials" },
  { label: "Групи", href: "#events" },
  { label: "Етика", href: "#ethics" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Мобільне меню відкрите — тіло не скролиться
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300 motion-reduce:transition-none",
        scrolled
          ? "border-b border-[#142744]/10 bg-[#F8F4EC]/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Wrap>
        <div className="flex h-[72px] items-center justify-between gap-6">
          <a
            href="#top"
            className={cn("-ml-1 flex items-center gap-4 rounded-lg px-1 py-1", focusRing)}
            aria-label="vsi — на початок"
          >
            <LogoVsi
              className="text-[2rem] text-[#142744]"
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            />
            {/* Підписи бренду — праворуч від знака, у два рядки */}
            <span className="hidden flex-col gap-1 border-l border-[#142744]/15 pl-4 sm:flex">
              <span className="text-[11px] leading-none tracking-[0.14em] text-[#1C3557]">
                аналітично орієнтована терапія
              </span>
              <span className="text-[10px] font-medium uppercase leading-none tracking-[0.26em] text-[#876428]">
                Траєкторія цілісності
              </span>
            </span>
          </a>

          <nav aria-label="Основна навігація" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "relative inline-flex items-center rounded-lg px-3 py-2 text-sm text-[#4A5568]",
                      "transition-colors hover:text-[#142744] motion-reduce:transition-none",
                      "after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-[#B38B49] after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none",
                      focusRing,
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ButtonLink href="#therapists" className="hidden sm:inline-flex">
              Знайти фахівця
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="vsi-mobile-nav"
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              className={cn(
                "inline-flex items-center justify-center rounded-lg text-[#142744] lg:hidden",
                "transition-colors hover:bg-[#142744]/[0.06] motion-reduce:transition-none",
                touch,
                focusRing,
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </Wrap>

      {/* Мобільне меню */}
      <div
        id="vsi-mobile-nav"
        hidden={!open}
        className="bg-[#F8F4EC]/97 border-t border-[#142744]/10 backdrop-blur-xl lg:hidden"
      >
        <Wrap>
          <ul className="flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center border-b border-[#142744]/[0.07] text-[15px] text-[#29323B]",
                    "transition-colors hover:text-[#142744] motion-reduce:transition-none",
                    touch,
                    focusRing,
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pb-5 sm:hidden">
            <ButtonLink href="#therapists" className="w-full">
              Знайти фахівця
            </ButtonLink>
          </div>
        </Wrap>
      </div>
    </header>
  );
}
