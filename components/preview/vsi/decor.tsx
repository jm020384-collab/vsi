import Image from "next/image";
import { useId } from "react";

import { cn } from "@/lib/utils";
import { VSI } from "./theme";

/* ────────────────────────────────────────────────────────────────
   Текстура теплого паперу
   ──────────────────────────────────────────────────────────────── */

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.10  0 0 0 0 0.08  0 0 0 0 0.06  0 0 0 0.42 0'/></filter><rect width='100%' height='100%' filter='url(%23g)' opacity='0.5'/></svg>\")";

export function PaperTexture({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{ backgroundImage: GRAIN, opacity: 0.42, mixBlendMode: "multiply" }}
    />
  );
}

/** Дуже м'які плями світла — глибина без «неонових» градієнтів. */
export function LightWash({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: `
          radial-gradient(60% 45% at 18% 10%, ${VSI.white} 0%, transparent 62%),
          radial-gradient(50% 40% at 88% 80%, ${VSI.parchment}CC 0%, transparent 66%)
        `,
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────
   Тонка лінія
   ──────────────────────────────────────────────────────────────── */

export function HairLine({
  className,
  tone = "ink",
}: {
  className?: string;
  tone?: "ink" | "gold" | "light";
}) {
  const bg =
    tone === "gold"
      ? `linear-gradient(90deg, transparent, ${VSI.gold}80 25%, ${VSI.gold}80 75%, transparent)`
      : tone === "light"
        ? "linear-gradient(90deg, transparent, #FFFDF833 20%, #FFFDF833 80%, transparent)"
        : `linear-gradient(90deg, transparent, ${VSI.midnight}1F 20%, ${VSI.midnight}1F 80%, transparent)`;

  return <div aria-hidden className={cn("h-px w-full", className)} style={{ background: bg }} />;
}

/* ────────────────────────────────────────────────────────────────
   Матове скло
   ──────────────────────────────────────────────────────────────── */

export function GlassPanel({
  children,
  className,
  tone = "light",
}: {
  children?: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border backdrop-blur-md",
        tone === "light"
          ? "border-[#142744]/10 bg-[#FFFDF8]/70"
          : "border-[#F8F4EC]/15 bg-[#F8F4EC]/[0.07]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Золоте лінійне мереживо — фоновий декор сторінки
   ──────────────────────────────────────────────────────────────── */

/**
 * Делікатна графіка з бренд-борду: тонкі орбітальні еліпси, пунктирні
 * кола, промениста розетка й маленька золота сфера. Прозорість низька —
 * це шепіт на папері, не ілюстрація. Один екземпляр на секцію.
 */
export function OrbitLinework({
  className,
  variant = "rays",
}: {
  className?: string;
  variant?: "rays" | "orbit";
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 420 420"
      fill="none"
      className={cn("pointer-events-none select-none", className)}
    >
      {variant === "rays" ? (
        <g stroke={VSI.gold} strokeWidth="1">
          {/* Промениста розетка: коло + 24 тонкі промені різної довжини */}
          <circle cx="210" cy="210" r="46" strokeOpacity="0.5" />
          <circle cx="210" cy="210" r="86" strokeOpacity="0.28" strokeDasharray="1 7" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 24;
            const r1 = 96;
            const r2 = i % 3 === 0 ? 176 : i % 3 === 1 ? 140 : 118;
            // round(): Math.cos/sin can differ in the last decimal between server
            // and client, which React reports as a hydration mismatch on every ray.
            const round = (n: number) => Math.round(n * 100) / 100;
            return (
              <line
                key={i}
                x1={round(210 + r1 * Math.cos(a))}
                y1={round(210 + r1 * Math.sin(a))}
                x2={round(210 + r2 * Math.cos(a))}
                y2={round(210 + r2 * Math.sin(a))}
                strokeOpacity={i % 3 === 0 ? 0.45 : 0.25}
              />
            );
          })}
          <circle cx="210" cy="210" r="7" fill={VSI.gold} fillOpacity="0.55" stroke="none" />
        </g>
      ) : (
        <g stroke={VSI.gold} strokeWidth="1">
          {/* Один еліпс-орбіта з малою сферою + пунктирне коло */}
          <ellipse
            cx="210"
            cy="210"
            rx="170"
            ry="64"
            transform="rotate(-24 210 210)"
            strokeOpacity="0.4"
          />
          <circle cx="210" cy="210" r="104" strokeOpacity="0.22" strokeDasharray="1 7" />
          <circle cx="340" cy="140" r="10" fill={VSI.gold} fillOpacity="0.65" stroke="none" />
        </g>
      )}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────
   Матова сфера
   ──────────────────────────────────────────────────────────────── */

export function Sphere({ className, uid = "sph" }: { className?: string; uid?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={cn("overflow-visible", className)} aria-hidden>
      <defs>
        <radialGradient id={`${uid}-body`} cx="36%" cy="28%" r="80%">
          <stop offset="0%" stopColor={VSI.white} />
          <stop offset="42%" stopColor={VSI.parchment} />
          <stop offset="78%" stopColor={VSI.lavender} />
          <stop offset="100%" stopColor="#8B8A99" />
        </radialGradient>
        <radialGradient id={`${uid}-bounce`} cx="64%" cy="90%" r="46%">
          <stop offset="0%" stopColor={VSI.parchment} stopOpacity="0.6" />
          <stop offset="100%" stopColor={VSI.parchment} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="88" fill={`url(#${uid}-body)`} />
      <circle cx="100" cy="100" r="88" fill={`url(#${uid}-bounce)`} />
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────────
   HERO · Аркова композиція
   ──────────────────────────────────────────────────────────────── */

/**
 * Кам'яна арка-портал, усередині якої відкривається світловий
 * пейзаж: м'які пагорби, сяйна матова сфера над горизонтом і
 * доріжка світла на воді. Перед аркою — постамент, мармурова
 * сфера й маленька золота куля. Крізь композицію проходить одна
 * тонка золота орбіта.
 *
 * Алхімічність структурна: контейнер (арка), внутрішній центр
 * (сфера над горизонтом), частина і ціле (великі й малі сфери),
 * перетин форм (орбіта крізь арку), зміна станів (камінь →
 * світло → відображення).
 */
export function ArchComposition({ className }: { className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 640 660"
        className="h-auto w-full"
        role="img"
        aria-label="Арка, всередині якої світловий горизонт зі сферою; поруч мармурова сфера та золота орбіта"
      >
        <defs>
          {/* Камінь арки */}
          <linearGradient id="ah-stone" x1="0" y1="0" x2="1" y2="0.25">
            <stop offset="0%" stopColor="#FBF8F1" />
            <stop offset="45%" stopColor={VSI.parchment} />
            <stop offset="100%" stopColor="#CDC0AB" />
          </linearGradient>

          {/* Небо всередині арки: лавандове повітря → тепле світло */}
          <linearGradient id="ah-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B9BAC9" />
            <stop offset="46%" stopColor="#CEC9CF" />
            <stop offset="72%" stopColor="#EFE3CC" />
            <stop offset="100%" stopColor="#F6EEDC" />
          </linearGradient>

          {/* Вода під горизонтом */}
          <linearGradient id="ah-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EFE6D2" />
            <stop offset="55%" stopColor="#D9D2CB" />
            <stop offset="100%" stopColor="#C4BFC2" />
          </linearGradient>

          {/* Сяйво навколо внутрішньої сфери */}
          <radialGradient id="ah-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9EA" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#F7EDD6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F7EDD6" stopOpacity="0" />
          </radialGradient>

          {/* Внутрішня сяйна сфера */}
          <radialGradient id="ah-moonsphere" cx="42%" cy="34%" r="72%">
            <stop offset="0%" stopColor="#FFFDF6" />
            <stop offset="62%" stopColor="#F4EBD7" />
            <stop offset="100%" stopColor="#DECDA9" />
          </radialGradient>

          {/* Мармурова сфера на підлозі */}
          <radialGradient id="ah-marble" cx="36%" cy="28%" r="80%">
            <stop offset="0%" stopColor={VSI.white} />
            <stop offset="44%" stopColor={VSI.parchment} />
            <stop offset="80%" stopColor={VSI.lavender} />
            <stop offset="100%" stopColor="#84838F" />
          </radialGradient>

          <radialGradient id="ah-gold" cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#F1DCAC" />
            <stop offset="45%" stopColor={VSI.goldBright} />
            <stop offset="100%" stopColor={VSI.goldDeep} />
          </radialGradient>

          <linearGradient id="ah-orbit" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor={VSI.gold} stopOpacity="0.12" />
            <stop offset="55%" stopColor={VSI.gold} stopOpacity="0.6" />
            <stop offset="100%" stopColor={VSI.goldBright} stopOpacity="0.95" />
          </linearGradient>

          <radialGradient id="ah-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6E6350" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6E6350" stopOpacity="0" />
          </radialGradient>

          <clipPath id="ah-opening">
            <path d="M 218 560 L 218 300 A 102 102 0 0 1 422 300 L 422 560 Z" />
          </clipPath>
        </defs>

        {/* ── Фонове лінійне мереживо навколо арки ── */}
        <g stroke={VSI.gold} strokeWidth="1" fill="none">
          <circle cx="320" cy="330" r="252" strokeOpacity="0.16" strokeDasharray="1 7" />
          <circle cx="320" cy="330" r="208" strokeOpacity="0.12" />
        </g>

        {/* ── Тіні на підлозі ── */}
        <ellipse cx="320" cy="576" rx="180" ry="16" fill="url(#ah-shadow)" />
        <ellipse cx="152" cy="588" rx="64" ry="13" fill="url(#ah-shadow)" />

        {/* ── Постамент під аркою ── */}
        <rect x="188" y="560" width="264" height="18" rx="3" fill="#DDD2BE" />
        <rect x="172" y="578" width="296" height="16" rx="3" fill="#CFC3AC" />

        {/* ── Тіло арки ── */}
        <path d="M 196 560 L 196 300 A 124 124 0 0 1 444 300 L 444 560 Z" fill="url(#ah-stone)" />

        {/* ── Сцена всередині отвору ── */}
        <g clipPath="url(#ah-opening)">
          <rect x="218" y="180" width="204" height="270" fill="url(#ah-sky)" />
          <rect x="218" y="430" width="204" height="130" fill="url(#ah-sea)" />

          {/* Пагорби — лавандові силуети */}
          <path
            d="M 218 434 Q 258 408 300 430 T 422 426 L 422 436 L 218 436 Z"
            fill="#9C9AAB"
            opacity="0.55"
          />
          <path
            d="M 218 438 Q 280 420 330 436 T 422 434 L 422 444 L 218 444 Z"
            fill="#8B8A9C"
            opacity="0.4"
          />

          {/* Сяйво і внутрішня сфера над горизонтом */}
          <circle cx="320" cy="392" r="118" fill="url(#ah-glow)" />
          <circle cx="320" cy="392" r="46" fill="url(#ah-moonsphere)" />

          {/* Доріжка світла на воді */}
          <path d="M 300 442 L 340 442 L 352 560 L 288 560 Z" fill="#FBF4E2" opacity="0.5" />
          <g stroke="#FFF9EA" strokeLinecap="round">
            <line x1="296" y1="466" x2="344" y2="466" strokeWidth="2.5" opacity="0.7" />
            <line x1="290" y1="488" x2="350" y2="488" strokeWidth="2" opacity="0.5" />
            <line x1="284" y1="514" x2="356" y2="514" strokeWidth="2" opacity="0.35" />
          </g>

          {/* Тонкі концентричні дуги — внутрішній контейнер */}
          <path
            d="M 236 560 L 236 306 A 84 84 0 0 1 404 306 L 404 560"
            stroke={VSI.white}
            strokeOpacity="0.55"
            strokeWidth="1.25"
            fill="none"
          />
        </g>

        {/* Кант отвору — товщина каменю */}
        <path
          d="M 218 560 L 218 300 A 102 102 0 0 1 422 300 L 422 560"
          stroke="#B7A98F"
          strokeWidth="1.5"
          fill="none"
        />

        {/* ── Мармурова сфера перед аркою ── */}
        <circle cx="152" cy="536" r="52" fill="url(#ah-marble)" />

        {/* ── Золота орбіта крізь композицію ── */}
        <ellipse
          className="ah-orbit"
          cx="320"
          cy="340"
          rx="252"
          ry="86"
          transform="rotate(-16 320 340)"
          fill="none"
          stroke="url(#ah-orbit)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Одна золота куля на орбіті */}
        <circle className="ah-dot" cx="480" cy="552" r="13" fill="url(#ah-gold)" />
      </svg>

      <style>{`
        @keyframes ahOrbitDraw {
          from { stroke-dashoffset: 1120; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes ahDotIn {
          0%, 42% { opacity: 0; transform: scale(0.4); }
          100%    { opacity: 1; transform: scale(1); }
        }
        .ah-orbit {
          stroke-dasharray: 1120;
          animation: ahOrbitDraw 2.6s cubic-bezier(0.32, 0.78, 0.3, 1) both;
        }
        .ah-dot {
          transform-box: view-box;
          transform-origin: 480px 552px;
          animation: ahDotIn 2.8s cubic-bezier(0.32, 0.78, 0.3, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .ah-orbit, .ah-dot { animation: none !important; }
          .ah-orbit { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Портрет фахівця
   ──────────────────────────────────────────────────────────────── */

/**
 * Портрет фахівця.
 *
 * Коли передано `photo`, рендериться справжнє фото (next/image) —
 * без ілюстрації й без ініціалів поверх, фото вже самодостатнє.
 * Без фото — детермінована аркова графіка з ініціалами: навмисна
 * заміна стоковим фотографіям для решти демо-фахівців, кожен
 * отримує стабільний свій відтінок.
 *
 * `fit`:
 * — "cover" (за замовчуванням) — класичне кадрування-заповнення.
 *   Усі портрети виходять візуально одного розміру й форми незалежно
 *   від пропорцій оригіналу; невелике обрізання країв — прийнятна
 *   ціна за однаковість рамки. object-position зсунуто вгору, щоб
 *   обличчя завжди лишалось у кадрі.
 * — "contain" — фото ніколи не обрізається, порожні поля заповнює
 *   теплий тон бренду. Використовувати там, де важливіше зберегти
 *   оригінал цілим, ніж однаковість рамки.
 *
 * `arch` — фото вирізане за формою арки (головний мотив бренду):
 * заповнює аркову силует повністю (без порожніх полів усередині
 * арки), кути прямокутника прибрані. Перекриває `fit`.
 */
const ARCH_CLIP_PATH = "M 0.06 1 L 0.06 0.58 A 0.44 0.58 0 0 1 0.94 0.58 L 0.94 1 Z";

export function AvatarPortrait({
  name,
  seed = 0,
  photo,
  sizes = "(max-width: 640px) 45vw, 320px",
  fit = "cover",
  arch = false,
  className,
  style,
}: {
  name: string;
  seed?: number;
  photo?: string;
  sizes?: string;
  fit?: "contain" | "cover";
  arch?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const clipId = useId();

  if (photo) {
    if (arch) {
      return (
        <div className={cn("relative", className)} style={style}>
          <svg width="0" height="0" className="absolute" aria-hidden>
            <defs>
              <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                <path d={ARCH_CLIP_PATH} />
              </clipPath>
            </defs>
          </svg>
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${clipId})` }}>
            <Image
              src={photo}
              alt=""
              fill
              sizes={sizes}
              className="object-cover"
              style={{ objectPosition: "50% 20%" }}
            />
          </div>
          {/* Тонкий контур арки поверх фото — той самий штрих, що й у декоративних арках бренду */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <path
              d="M 6 100 L 6 58 A 44 58 0 0 1 94 58 L 94 100"
              fill="none"
              stroke={VSI.white}
              strokeOpacity="0.55"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      );
    }
    if (fit === "contain") {
      return (
        <div
          className={cn("relative overflow-hidden", className)}
          style={{
            background: `linear-gradient(160deg, ${VSI.stone} 0%, ${VSI.parchment} 100%)`,
            ...style,
          }}
        >
          <Image src={photo} alt="" fill sizes={sizes} className="object-contain" />
        </div>
      );
    }
    return (
      <div className={cn("relative overflow-hidden", className)} style={style}>
        <Image
          src={photo}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition: "50% 18%" }}
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  const tones: ReadonlyArray<{ deep: string; soft: string }> = [
    { deep: VSI.lavender, soft: "#F1ECE1" },
    { deep: "#B8B0A0", soft: "#F4EFE5" },
    { deep: "#A3A4B6", soft: "#EFEAE2" },
    { deep: "#BCAE94", soft: "#F5F0E6" },
  ];
  const { deep, soft } = tones[seed % tones.length] ?? tones[0]!;
  const uid = `av${seed}`;

  return (
    <div className={cn("relative overflow-hidden", className)} style={style}>
      <svg
        viewBox="0 0 300 340"
        className="h-full w-full"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0%" stopColor={soft} />
            <stop offset="100%" stopColor={deep} />
          </linearGradient>
          <radialGradient id={`${uid}-orb`} cx="38%" cy="30%" r="74%">
            <stop offset="0%" stopColor={VSI.white} />
            <stop offset="58%" stopColor={soft} />
            <stop offset="100%" stopColor={deep} />
          </radialGradient>
        </defs>

        <rect width="300" height="340" fill={`url(#${uid}-bg)`} />

        {/* Арка — той самий мотив контейнера, що й у hero */}
        <path
          d="M 62 340 L 62 176 A 88 88 0 0 1 238 176 L 238 340"
          fill="none"
          stroke={VSI.white}
          strokeOpacity="0.55"
          strokeWidth="1.5"
        />
        <circle cx="150" cy="196" r="62" fill={`url(#${uid}-orb)`} opacity="0.92" />
        <line
          x1="0"
          y1="252"
          x2="300"
          y2="252"
          stroke={VSI.white}
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      </svg>

      <span
        className="absolute inset-0 grid place-items-center text-4xl font-light tracking-wide"
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif", color: VSI.midnight }}
        aria-hidden
      >
        {initials}
      </span>
    </div>
  );
}
