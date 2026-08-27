import { cn } from "@/lib/utils";
import { LogoVsiLockup } from "@/components/brand/vsi/logo-vsi";
import { Wrap } from "../ui";
import { focusRingDark, touch } from "../theme";

const COLUMNS = [
  {
    title: "Платформа",
    links: ["Знайти фахівця", "Як обрати", "Групи та події", "Матеріали"],
  },
  {
    title: "Фахівцям",
    links: ["Приєднатися", "Умови верифікації", "Супервізійні групи", "Кабінет фахівця"],
  },
  {
    title: "Про нас",
    links: ["Про підхід", "Етичний кодекс", "Команда", "Контакти"],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#142744]">
      <Wrap className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* Знак і місія */}
          <div>
            <LogoVsiLockup align="start" tone="dark" logoClassName="text-[2.5rem]" still />
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[#AAA8B5]">
              «vsi» — від українського «всі». Простір, у якому частини знаходять зв&apos;язок: із
              собою, з іншими, зі світом.
            </p>
          </div>

          {/* Навігація */}
          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#E9DECE]">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-1">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className={cn(
                          "inline-flex items-center text-[15px] text-[#AAA8B5]",
                          "transition-colors hover:text-[#F8F4EC] motion-reduce:transition-none",
                          touch,
                          focusRingDark,
                        )}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Кризова примітка — свідомо не дрібним шрифтом */}
        <div className="border-[#F8F4EC]/12 mt-14 rounded-xl border bg-[#F8F4EC]/[0.04] p-5">
          <p className="text-sm leading-relaxed text-[#C9C7D1]">
            vsi не надає невідкладної психіатричної допомоги. У кризовій ситуації телефонуйте{" "}
            <span className="font-medium text-[#F8F4EC]">103</span> або на лінію{" "}
            <span className="font-medium text-[#F8F4EC]">7333</span> (цілодобово, безкоштовно).
          </p>
        </div>

        <div
          aria-hidden
          className="mt-10 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(248,244,236,0.16) 20%, rgba(248,244,236,0.16) 80%, transparent)",
          }}
        />

        <div className="mt-6 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-[#8E8C9B]">© 2026 vsi. Усі права захищено.</p>
          <ul className="flex flex-wrap gap-x-6">
            {["Політика конфіденційності", "Умови користування", "Cookies"].map((l) => (
              <li key={l}>
                <a
                  href="#"
                  className={cn(
                    "inline-flex items-center text-sm text-[#8E8C9B]",
                    "transition-colors hover:text-[#E9DECE] motion-reduce:transition-none",
                    touch,
                    focusRingDark,
                  )}
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </footer>
  );
}
