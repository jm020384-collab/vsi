import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  dotColor?: string;
  vesselColor?: string;
  style?: React.CSSProperties;
  still?: boolean;
}

/**
 * VSI · Алхімічний — «Prima Materia»
 *
 * Крапка над «i» — крапля первісної матерії. Вона зривається,
 * падає по дузі вправо-вниз і осідає у відкритій посудині-колі,
 * де починає пульсувати: матерія стала золотом.
 *
 * Дистиляція як метафора терапії: те, що було вгорі й нерухомим,
 * опускається, проходить вогонь і повертається зміненим.
 */
export function LogoAlchemical({
  className,
  dotColor = "#C8A95F",
  vesselColor = "currentColor",
  style,
  still,
}: LogoProps) {
  return (
    <span
      className={cn("relative inline-flex select-none items-baseline leading-none", className)}
      style={{ fontStyle: "italic", ...style }}
      aria-label="vsi"
      role="img"
    >
      <style>{`
        @keyframes vsiAlchDot {
          0%,  10%  { transform: translate(0, 0) scale(1); opacity: 1; }
          20%       { transform: translate(0.06em, -0.05em) scale(0.92, 1.12); }
          46%       { transform: translate(1.02em, 0.34em) scale(0.88, 1.16); }
          58%       { transform: translate(1.46em, 0.60em) scale(1.18, 0.86); }
          63%       { transform: translate(1.46em, 0.585em) scale(1); }
          72%       { transform: translate(1.46em, 0.60em) scale(1.06); }
          82%       { transform: translate(1.46em, 0.59em) scale(0.96); }
          92%       { transform: translate(1.46em, 0.60em) scale(1); opacity: 1; }
          97%       { opacity: 0; }
          100%      { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes vsiAlchTrail {
          0%, 18%   { opacity: 0; stroke-dashoffset: 60; }
          46%       { opacity: 0.5; stroke-dashoffset: 20; }
          62%       { opacity: 0.32; stroke-dashoffset: 0; }
          78%, 100% { opacity: 0; stroke-dashoffset: 0; }
        }
        @keyframes vsiAlchVessel {
          0%, 55%   { opacity: 0.34; }
          64%       { opacity: 1; }
          90%       { opacity: 0.6; }
          100%      { opacity: 0.34; }
        }
        @keyframes vsiAlchGlow {
          0%, 58%   { opacity: 0; transform: scale(0.6); }
          68%       { opacity: 0.5; transform: scale(1.5); }
          88%, 100% { opacity: 0; transform: scale(1.9); }
        }
        .vsi-a-dot    { animation: vsiAlchDot 6s cubic-bezier(.45,.05,.4,1) infinite; }
        .vsi-a-trail  { animation: vsiAlchTrail 6s ease-in-out infinite; }
        .vsi-a-vessel { animation: vsiAlchVessel 6s ease-in-out infinite; }
        .vsi-a-glow   { animation: vsiAlchGlow 6s ease-out infinite; }
        .vsi-a-still .vsi-a-dot,
        .vsi-a-still .vsi-a-trail,
        .vsi-a-still .vsi-a-vessel,
        .vsi-a-still .vsi-a-glow { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .vsi-a-dot, .vsi-a-trail, .vsi-a-vessel, .vsi-a-glow { animation: none !important; }
        }
      `}</style>

      <span className={still ? "vsi-a-still contents" : "contents"}>
        <span aria-hidden>vs</span>

        <span
          aria-hidden
          className="relative inline-block align-baseline"
          style={{ width: "0.34em", height: "1em" }}
        >
          {/* Стем — з легким нахилом, як у курсиві */}
          <span
            className="absolute"
            style={{
              left: "50%",
              bottom: "0.06em",
              width: "0.075em",
              height: "0.46em",
              marginLeft: "-0.0375em",
              background: "currentColor",
              transform: "skewX(-11deg)",
            }}
          />

          {/* Дуга падіння */}
          <svg
            className="vsi-a-trail absolute overflow-visible"
            style={{
              left: "50%",
              bottom: "0.58em",
              width: "1.9em",
              height: "1em",
              marginLeft: "-0.02em",
            }}
            viewBox="0 0 100 52"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 3 3 C 34 12 58 26 79 45"
              stroke={dotColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="60"
            />
          </svg>

          {/* Посудина — відкрите коло, що приймає краплю */}
          <svg
            className="vsi-a-vessel absolute overflow-visible"
            style={{
              left: "50%",
              bottom: "-0.02em",
              width: "0.46em",
              height: "0.46em",
              marginLeft: "1.24em",
            }}
            viewBox="0 0 40 40"
            fill="none"
          >
            {/* Розрив зверху — крапля входить */}
            <path
              d="M 25 5.5 A 16 16 0 1 1 15 5.5"
              stroke={vesselColor}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          {/* Сяйво при приземленні */}
          <span
            className="vsi-a-glow absolute block"
            style={{
              left: "50%",
              bottom: "0.11em",
              width: "0.28em",
              height: "0.28em",
              marginLeft: "1.33em",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${dotColor} 0%, transparent 70%)`,
            }}
          />

          {/* Крапля */}
          <span
            className="vsi-a-dot absolute block"
            style={{
              left: "50%",
              bottom: "0.60em",
              width: "0.135em",
              height: "0.135em",
              marginLeft: "-0.0475em",
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
