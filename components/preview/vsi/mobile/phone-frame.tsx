import { cn } from "@/lib/utils";
import { vsiTokens } from "../theme";

/**
 * Рамка телефона для showcase.
 *
 * 390×844 — логічні пікселі iPhone 14. Вміст усередині справді
 * скролиться, тож екрани можна оцінювати як живі, а не як картинки.
 */
export function PhoneFrame({
  children,
  label,
  caption,
  className,
}: {
  children: React.ReactNode;
  label: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex w-[390px] shrink-0 flex-col", className)}>
      <div className="relative rounded-[2.75rem] bg-[#142744] p-3 shadow-[0_30px_70px_-30px_rgba(20,39,68,0.55)]">
        {/* Бічні кнопки */}
        <span
          aria-hidden
          className="absolute -left-[3px] top-[124px] h-8 w-[3px] rounded-l bg-[#0D1B2F]"
        />
        <span
          aria-hidden
          className="absolute -left-[3px] top-[168px] h-12 w-[3px] rounded-l bg-[#0D1B2F]"
        />
        <span
          aria-hidden
          className="absolute -right-[3px] top-[150px] h-16 w-[3px] rounded-r bg-[#0D1B2F]"
        />

        <div
          style={vsiTokens}
          className="relative h-[844px] overflow-hidden rounded-[2.1rem] bg-[#F8F4EC]"
        >
          {/* Status bar */}
          <div className="absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between bg-[#F8F4EC]/80 px-6 pt-1 text-[13px] font-medium text-[#142744] backdrop-blur-md">
            <span>9:41</span>
            {/* Dynamic Island */}
            <span
              aria-hidden
              className="absolute left-1/2 top-2 h-7 w-24 -translate-x-1/2 rounded-full bg-[#142744]"
            />
            <span className="flex items-center gap-1.5" aria-hidden>
              {/* Сигнал */}
              <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
                <rect x="0" y="7.5" width="3" height="3.5" rx="1" />
                <rect x="4.5" y="5" width="3" height="6" rx="1" />
                <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
                <rect x="13.5" y="0" width="3" height="11" rx="1" />
              </svg>
              {/* Wi-Fi */}
              <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
                <path d="M7.5 10.5 5.6 8.4a2.9 2.9 0 0 1 3.8 0L7.5 10.5Z" />
                <path
                  d="M3.4 6.2a6 6 0 0 1 8.2 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M1 3.6a9.6 9.6 0 0 1 13 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              {/* Батарея */}
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect
                  x="0.5"
                  y="0.5"
                  width="21"
                  height="11"
                  rx="3"
                  stroke="currentColor"
                  strokeOpacity="0.4"
                />
                <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
                <path d="M23 4v4a2.1 2.1 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" />
              </svg>
            </span>
          </div>

          {/* Контент екрана */}
          <div
            className="h-full overflow-y-auto overscroll-contain"
            style={{ fontFamily: "var(--vsi-sans), system-ui, sans-serif" }}
          >
            {children}
          </div>

          {/* Home indicator */}
          <span
            aria-hidden
            className="absolute bottom-2 left-1/2 z-30 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-[#142744]/35"
          />
        </div>
      </div>

      <figcaption className="mt-6 px-2">
        <div
          className="text-xl font-normal text-[#142744]"
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          {label}
        </div>
        {caption && <p className="mt-1 text-sm leading-relaxed text-[#5C6672]">{caption}</p>}
      </figcaption>
    </figure>
  );
}
