import { cn } from "@/lib/utils";

interface LogoVsiProps {
  className?: string;
  style?: React.CSSProperties;
  /** Вимкнути анімацію — для повторних входжень (футер, картки). */
  still?: boolean;
  /** Колір літер. За замовчуванням успадковує колір тексту. */
  inkColor?: string;
}

/**
 * VSI · Знак «Траєкторія цілісності»
 *
 * Літера «i» розібрана на дві частини: стем — справжня безкрапкова
 * «ı» (U+0131) з Cormorant Garamond, накреслення 600 — виразне,
 * як на бренд-борді. Навколо стема — золота еліптична орбіта, що
 * здіймається високо над літерами: постійна частина знака.
 *
 * Крапка — золота сфера-планета. Вона від першого кадру стоїть на
 * орбіті у верхній точці — як крапка над «i». Цикл нескінченний
 * (8 с): зупинка над літерою на 2 с → повільний плавний оберт по
 * орбіті (~6 с, з м'яким розгоном і гальмуванням) → знову зупинка.
 * Рух безперервний, без появ і зникнень.
 *
 * Рух — точно по еліпсу через SVG animateMotion, тому траєкторія
 * ідеальна на будь-якому розмірі. При prefers-reduced-motion і
 * still-режимі сфера просто стоїть над літерою.
 *
 * Геометрія (viewBox 240×160, 1em = 100 од.): вісь стема — x 120,
 * базова лінія ≈ y 121, верх малих літер ≈ y 76. Орбіта: центр
 * (100, 86), 72×26, нахил −30° — верхня дуга піднімається над
 * літерами, нижня пірнає за базову лінію. Точка спокою сфери —
 * (120, 48.5): по центру осі стема, високо над «i»; (80, 123.5) —
 * її антипод, тому повний оберт складається з двох половинних дуг.
 */
export function LogoVsi({ className, style, still, inkColor }: LogoVsiProps) {
  // Повний оберт за годинниковою стрілкою: старт і фініш — крапка над «i».
  const ORBIT_PATH = "M 120 48.5 " + "A 72 26 -30 0 1 80 123.5 " + "A 72 26 -30 0 1 120 48.5";

  return (
    <span
      role="img"
      aria-label="vsi"
      className={cn("relative inline-flex select-none items-baseline leading-none", className)}
      style={{ fontWeight: 600, color: inkColor, ...style }}
    >
      <style>{`
        @keyframes vsiOrbitIn {
          from { opacity: 0; }
          to   { opacity: 0.8; }
        }
        @keyframes vsiLettersIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .vsi-orbit {
          opacity: 0.8;
          animation: vsiOrbitIn 1.2s ease-out both;
        }
        /* Планета видима з першого кадру — вона вже стоїть на орбіті */
        .vsi-letters { animation: vsiLettersIn 0.8s ease-out both; }

        /* Статична сфера — для reduced-motion і повторних входжень */
        .vsi-planet-static { display: none; }

        .vsi-still .vsi-orbit,
        .vsi-still .vsi-letters { animation: none; }
        .vsi-still .vsi-planet-motion { display: none; }
        .vsi-still .vsi-planet-static { display: inline; }

        @media (prefers-reduced-motion: reduce) {
          .vsi-orbit, .vsi-letters { animation: none !important; }
          .vsi-planet-motion { display: none; }
          .vsi-planet-static { display: inline; }
        }
      `}</style>

      <span className={still ? "vsi-still contents" : "contents"}>
        <span aria-hidden className="vsi-letters">
          vs
        </span>

        {/*
          Стем «і» — власна форма (currentColor), не гліф шрифту.
          Пройдено два хибні шляхи: (1) безкрапкова «ı» (U+0131) —
          рідкісна гліфа поза базовою латиницею, якої в Cormorant
          Garamond могло не бути взагалі, тож браузер підставляв інший
          шрифт лише для цього символу; (2) справжня «i» з clip-path
          по крапці — під час завантаження шрифту (font-display: swap)
          коротко показується запасний шрифт з інакшими пропорціями,
          і clip-path, розрахований під метрики Cormorant Garamond,
          обрізає не там — крапка запасного шрифту лишається видимою.
          Обидва варіанти залежали від того, який шрифт активний саме
          зараз. Пряма заливка не залежить від шрифту й завантаження
          зовсім. Пропорції (0.08em × 0.4em) виміряні з реального
          рендеру гліфа «i» Cormorant Garamond 600 (canvas + baseline-
          маркер), а не підібрані на око.
        */}
        <span
          aria-hidden
          className="vsi-letters relative inline-block"
          style={{ width: "0.28em", marginLeft: "0.03em" }}
        >
          {/* У потоці — сама задає baseline обгортки, як раніше гліф. */}
          <span
            aria-hidden
            className="inline-block align-baseline"
            style={{
              width: "0.08em",
              height: "0.4em",
              marginLeft: "0.1em",
              backgroundColor: "currentColor",
            }}
          />

          <svg
            className="pointer-events-none absolute overflow-visible"
            style={{
              left: "50%",
              marginLeft: "-1.2em",
              bottom: "0em",
              width: "2.4em",
              height: "1.6em",
            }}
            viewBox="0 0 240 160"
            fill="none"
            aria-hidden
          >
            <defs>
              {/* Об'ємна золота сфера-планета */}
              <radialGradient id="vsi-planet-grad" cx="34%" cy="28%" r="78%">
                <stop offset="0%" stopColor="#F5E3B2" />
                <stop offset="36%" stopColor="#DDB66C" />
                <stop offset="76%" stopColor="#B38B49" />
                <stop offset="100%" stopColor="#835F26" />
              </radialGradient>
              {/* Орбіта яскравішає до точки спокою (верх-праворуч) */}
              <linearGradient id="vsi-orbit-grad" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#B38B49" stopOpacity="0.3" />
                <stop offset="55%" stopColor="#B38B49" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D9B269" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Орбіта — постійна частина знака */}
            <ellipse
              className="vsi-orbit"
              cx="100"
              cy="86"
              rx="72"
              ry="26"
              transform="rotate(-30 100 86)"
              stroke="url(#vsi-orbit-grad)"
              strokeWidth="2"
            />

            {/*
              Цикл 8 с: 0–25 % (2 с) — зупинка у верхній точці
              (крапка над «i»), 25–100 % (6 с) — повний оберт по
              орбіті з плавним розгоном і гальмуванням у ту саму точку.
            */}

            <g className="vsi-planet vsi-planet-motion">
              <circle r="11" fill="url(#vsi-planet-grad)">
                <animateMotion
                  dur="8s"
                  begin="0s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyPoints="0;0;1"
                  keyTimes="0;0.25;1"
                  keySplines="0 0 1 1;0.42 0 0.16 1"
                  path={ORBIT_PATH}
                />
              </circle>
            </g>

            {/* Планета у спокої — високо над «i», по центру осі стема */}
            <circle
              className="vsi-planet-static"
              cx="120"
              cy="48.5"
              r="11"
              fill="url(#vsi-planet-grad)"
            />
          </svg>
        </span>
      </span>
    </span>
  );
}

interface LogoVsiLockupProps {
  className?: string;
  /** Клас розміру самого знака, напр. "text-6xl". */
  logoClassName?: string;
  still?: boolean;
  /** Вирівнювання блоку: центр (бренд-борд) або лівий край (хедер). */
  align?: "center" | "start";
  /** Світле тло (текст синій) чи темне (текст світлий). */
  tone?: "light" | "dark";
}

/**
 * Повний фірмовий блок: знак + два підписи, як на бренд-борді.
 *
 *   vsı
 *   аналітично орієнтована терапія
 *   ТРАЄКТОРІЯ ЦІЛІСНОСТІ
 *
 * Перший підпис — спокійний, кольору літер. Другий — золотий
 * розріджений верхній регістр; на світлому тлі використовується
 * затемнене золото #876428 (контраст ≥ 4.5:1, WCAG AA).
 */
export function LogoVsiLockup({
  className,
  logoClassName = "text-6xl",
  still,
  align = "center",
  tone = "light",
}: LogoVsiLockupProps) {
  return (
    /* Розмір знака задається на обгортці — підписи масштабуються від нього в em */
    <div
      className={cn(
        "flex flex-col",
        logoClassName,
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <LogoVsi
        className={cn("text-[1em]", tone === "light" ? "text-[#142744]" : "text-[#F8F4EC]")}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        still={still}
      />
      <p
        className={cn(
          "leading-none tracking-[0.18em]",
          tone === "light" ? "text-[#1C3557]" : "text-[#E9DECE]",
        )}
        style={{
          fontSize: "max(11px, 0.2em)",
          marginTop: "max(10px, 0.22em)",
          fontFamily: "var(--vsi-sans), system-ui, sans-serif",
        }}
      >
        аналітично орієнтована терапія
      </p>
      <p
        className={cn(
          "font-medium uppercase leading-none tracking-[0.3em]",
          tone === "light" ? "text-[#876428]" : "text-[#D9B269]",
        )}
        style={{
          fontSize: "max(10px, 0.165em)",
          marginTop: "max(8px, 0.16em)",
          fontFamily: "var(--vsi-sans), system-ui, sans-serif",
        }}
      >
        Траєкторія цілісності
      </p>
    </div>
  );
}
