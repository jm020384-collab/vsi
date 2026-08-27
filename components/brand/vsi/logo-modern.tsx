import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Колір падаючої крапки. За замовчуванням — акцентний. */
  dotColor?: string;
  /** Розмір керується font-size; усе внутрішнє — в em. */
  style?: React.CSSProperties;
  /** Пауза анімації (для статичних станів, напр. у футері) */
  still?: boolean;
}

/**
 * VSI · Модерн — «Орбіта»
 *
 * Крапка над «i» відривається, летить по параболі вправо
 * і зупиняється як окрема точка на базовій лінії — індивід,
 * що вийшов із цілого. Потім повертається: цикл замикається.
 *
 * Літери «vs» — веб-шрифт; стем «i» та крапка — геометрія,
 * тому крапка керована повністю.
 */
export function LogoModern({ className, dotColor = "#FF4A1C", style, still }: LogoProps) {
  return (
    <span
      className={cn("relative inline-flex select-none items-baseline leading-none", className)}
      style={{ letterSpacing: "-0.045em", ...style }}
      aria-label="vsi"
      role="img"
    >
      <style>{`
        @keyframes vsiModernDot {
          0%,  8%   { transform: translate(0, 0) scale(1); }
          38%       { transform: translate(1.42em, 0.60em) scale(1); }
          43%       { transform: translate(1.52em, 0.52em) scale(1.05, 0.95); }
          48%       { transform: translate(1.62em, 0.60em) scale(1); }
          78%       { transform: translate(1.62em, 0.60em) scale(1); }
          100%      { transform: translate(0, 0) scale(1); }
        }
        @keyframes vsiModernTrail {
          0%, 30%   { opacity: 0; }
          38%       { opacity: 0.22; }
          52%, 100% { opacity: 0; }
        }
        .vsi-m-dot {
          animation: vsiModernDot 5.2s cubic-bezier(.55, .05, .35, 1) infinite;
        }
        .vsi-m-trail {
          animation: vsiModernTrail 5.2s ease-out infinite;
        }
        .vsi-m-still .vsi-m-dot,
        .vsi-m-still .vsi-m-trail { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .vsi-m-dot, .vsi-m-trail { animation: none !important; }
        }
      `}</style>

      <span className={still ? "vsi-m-still contents" : "contents"}>
        {/* v s — веб-шрифт */}
        <span aria-hidden>vs</span>

        {/* Літера i: стем + рухома крапка */}
        <span
          aria-hidden
          className="relative inline-block align-baseline"
          style={{ width: "0.30em", height: "1em" }}
        >
          {/* Стем — вертикальна риска до x-height */}
          <span
            className="absolute"
            style={{
              left: "50%",
              bottom: "0.06em",
              width: "0.105em",
              height: "0.50em",
              marginLeft: "-0.0525em",
              background: "currentColor",
              borderRadius: "0.012em",
            }}
          />

          {/* Слід падіння — тонка дуга */}
          <svg
            className="vsi-m-trail absolute overflow-visible"
            style={{
              left: "50%",
              bottom: "0.62em",
              width: "2em",
              height: "1em",
              marginLeft: "-0.06em",
            }}
            viewBox="0 0 100 50"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 4 4 Q 46 6 82 42"
              stroke={dotColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1 5"
            />
          </svg>

          {/* Крапка */}
          <span
            className="vsi-m-dot absolute block"
            style={{
              left: "50%",
              bottom: "0.66em",
              width: "0.155em",
              height: "0.155em",
              marginLeft: "-0.0775em",
              background: dotColor,
              borderRadius: "50%",
              willChange: "transform",
            }}
          />
        </span>
      </span>
    </span>
  );
}
