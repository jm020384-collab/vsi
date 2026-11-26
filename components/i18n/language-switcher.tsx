"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";
import { isLocalizable, localizeHref, splitLocale, type Locale } from "@/lib/i18n/config";

const OPTIONS: { value: Locale; label: string; name: string }[] = [
  { value: "uk", label: "UA", name: "Українська" },
  { value: "ru", label: "RU", name: "Русский" },
];

/**
 * Перемикач «UA | RU».
 *
 * Звичайні посилання, а не next/link: зі зміною мови сторінка має
 * завантажитися наново, разом із кореневим шаблоном і атрибутом lang.
 * На сторінках без російської версії (вхід, реєстрація) не показується.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale } = useI18n();
  // На сервері тут шлях уже без /ru, у браузері — з ним: зводимо до одного.
  const { path } = splitLocale(usePathname());
  if (!isLocalizable(path)) return null;

  return (
    <div className={cn("flex items-center text-[13px] tracking-wide", className)}>
      {OPTIONS.map((o, i) => (
        <span key={o.value} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="text-[#F8F4EC]/25">
              |
            </span>
          )}
          <a
            href={localizeHref(path, o.value)}
            hrefLang={o.value}
            lang={o.value}
            title={o.name}
            aria-current={locale === o.value ? "true" : undefined}
            className={cn(
              "rounded-md px-1.5 py-2 transition-colors motion-reduce:transition-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B38B49]",
              locale === o.value ? "text-[#E7C77B]" : "text-[#F8F4EC]/70 hover:text-[#F8F4EC]",
            )}
          >
            {o.label}
          </a>
        </span>
      ))}
    </div>
  );
}
