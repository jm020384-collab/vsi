import Link from "next/link";

import { LogoVsiLockup } from "@/components/brand/vsi/logo-vsi";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 bg-[#142744]">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Бренд-блок */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-block" aria-label={`${BRAND.name} — на головну`}>
              <LogoVsiLockup align="start" logoClassName="text-[2.25rem]" tone="dark" still />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#C9C7D1]">
              «vsi» — від українського «всі». Простір, у якому частини знаходять зв&apos;язок: із
              собою, з іншими, зі світом.
            </p>
          </div>

          {/* Навігація */}
          <div className="md:col-span-3">
            <div className="small-caps text-xs font-medium text-[#AAA8B5]">Розділи</div>
            <ul className="mt-3 space-y-2 text-sm text-[#D6D3DD]">
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/pro-metod">
                  Про метод
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/therapists">
                  Каталог фахівців
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/blog">
                  Журнал
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/register?role=THERAPIST">
                  Я фахівець
                </Link>
              </li>
            </ul>
          </div>

          {/* Юридичне */}
          <div className="md:col-span-4">
            <div className="small-caps text-xs font-medium text-[#AAA8B5]">Юридичне</div>
            <ul className="mt-3 space-y-2 text-sm text-[#D6D3DD]">
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/privacy">
                  Політика конфіденційності
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#F8F4EC]" href="/terms">
                  Угода користувача
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-[#AAA8B5]">
              {BRAND.name} надає інформацію про фахівців та освітній контент. Платформа не несе
              відповідальності за якість та результат консультацій. Платформа не замінює медичну
              допомогу в гострих станах.
            </p>
          </div>
        </div>

        {/* Тонкий золотий роздільник із однією сферою — мотив знака */}
        <div aria-hidden className="mt-12 flex items-center justify-center gap-4">
          <span className="bg-[#F8F4EC]/12 h-px flex-1" />
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <ellipse
              cx="12"
              cy="12"
              rx="10"
              ry="4"
              transform="rotate(-24 12 12)"
              stroke="#B38B49"
              strokeOpacity="0.7"
              strokeWidth="1.2"
            />
            <circle cx="17" cy="7.5" r="2.2" fill="#B38B49" />
          </svg>
          <span className="bg-[#F8F4EC]/12 h-px flex-1" />
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-[#AAA8B5] md:flex-row">
          <div>
            © {year} {BRAND.name}. Усі права захищено.
          </div>
          <div className="font-serif italic text-[#D6D3DD]">«{BRAND.tagline}»</div>
        </div>
      </div>
    </footer>
  );
}
