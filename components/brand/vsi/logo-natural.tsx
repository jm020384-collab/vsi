import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  seedColor?: string;
  sproutColor?: string;
  style?: React.CSSProperties;
  still?: boolean;
}

/**
 * VSI · Природний — «Насінина»
 *
 * Крапка над «i» — насінина. Вона падає вправо-вниз,
 * приземляється — і з неї проростає пагінець із двома листками.
 *
 * Найтихіша інтерпретація: точка падає не для того, щоб піти,
 * а щоб дати початок. «Всі» — усі з одного насіння.
 */
export function LogoNatural({
  className,
  seedColor = "#8B6F4E",
  sproutColor = "#7A9E7E",
  style,
  still,
}: LogoProps) {
  return (
    <span
      className={cn("relative inline-flex select-none items-baseline leading-none", className)}
      style={style}
      aria-label="vsi"
      role="img"
    >
      <style>{`
        @keyframes vsiNatSeed {
          0%,  12%  { transform: translate(0, 0) rotate(0deg); }
          40%       { transform: translate(0.86em, 0.30em) rotate(120deg); }
          54%       { transform: translate(1.44em, 0.615em) rotate(210deg); }
          58%       { transform: translate(1.44em, 0.575em) rotate(215deg); }
          62%, 88%  { transform: translate(1.44em, 0.615em) rotate(218deg); }
          100%      { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes vsiNatSprout {
          0%,  60%  { stroke-dashoffset: 42; opacity: 0; }
          66%       { opacity: 1; }
          80%       { stroke-dashoffset: 0; opacity: 1; }
          92%       { opacity: 1; }
          97%, 100% { opacity: 0; stroke-dashoffset: 42; }
        }
        @keyframes vsiNatLeaf {
          0%,  74%  { opacity: 0; transform: scale(0.2); }
          86%       { opacity: 1; transform: scale(1); }
          93%       { opacity: 1; transform: scale(1); }
          97%, 100% { opacity: 0; transform: scale(0.2); }
        }
        @keyframes vsiNatSoil {
          0%,  50%  { opacity: 0; }
          58%       { opacity: 0.42; }
          92%       { opacity: 0.3; }
          100%      { opacity: 0; }
        }
        .vsi-n-seed   { animation: vsiNatSeed 6.4s cubic-bezier(.5,.02,.4,1) infinite; }
        .vsi-n-sprout { animation: vsiNatSprout 6.4s ease-out infinite; }
        .vsi-n-leaf   { animation: vsiNatLeaf 6.4s cubic-bezier(.3,1.4,.5,1) infinite; transform-origin: center; }
        .vsi-n-soil   { animation: vsiNatSoil 6.4s ease-in-out infinite; }
        .vsi-n-still .vsi-n-seed,
        .vsi-n-still .vsi-n-sprout,
        .vsi-n-still .vsi-n-leaf,
        .vsi-n-still .vsi-n-soil { animation: none; }
        @media (prefers-reduced-motion: reduce) {
          .vsi-n-seed, .vsi-n-sprout, .vsi-n-leaf, .vsi-n-soil { animation: none !important; }
        }
      `}</style>

      <span className={still ? "vsi-n-still contents" : "contents"}>
        <span aria-hidden>vs</span>

        <span
          aria-hidden
          className="relative inline-block align-baseline"
          style={{ width: "0.32em", height: "1em" }}
        >
          {/* Стем — м'яко заокруглений */}
          <span
            className="absolute"
            style={{
              left: "50%",
              bottom: "0.06em",
              width: "0.1em",
              height: "0.47em",
              marginLeft: "-0.05em",
              background: "currentColor",
              borderRadius: "0.05em",
            }}
          />

          {/* Ґрунт — м'яка тінь під місцем приземлення */}
          <span
            className="vsi-n-soil absolute block"
            style={{
              left: "50%",
              bottom: "0.045em",
              width: "0.34em",
              height: "0.055em",
              marginLeft: "1.27em",
              borderRadius: "50%",
              background: seedColor,
            }}
          />

          {/* Пагінець — проростає з приземленого насіння */}
          <svg
            className="absolute overflow-visible"
            style={{
              left: "50%",
              bottom: "0.08em",
              width: "0.6em",
              height: "0.62em",
              marginLeft: "1.14em",
            }}
            viewBox="0 0 40 42"
            fill="none"
          >
            {/* Стебло */}
            <path
              className="vsi-n-sprout"
              d="M 20 40 C 20 30 19 22 20 12"
              stroke={sproutColor}
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="42"
            />
            {/* Два листки */}
            <g className="vsi-n-leaf">
              <ellipse
                cx="10"
                cy="16"
                rx="8.5"
                ry="4"
                fill={sproutColor}
                transform="rotate(-28 10 16)"
              />
              <ellipse
                cx="30"
                cy="13"
                rx="8.5"
                ry="4"
                fill={sproutColor}
                opacity="0.82"
                transform="rotate(24 30 13)"
              />
            </g>
          </svg>

          {/* Насінина */}
          <span
            className="vsi-n-seed absolute block"
            style={{
              left: "50%",
              bottom: "0.63em",
              width: "0.135em",
              height: "0.17em",
              marginLeft: "-0.0675em",
              background: seedColor,
              borderRadius: "50% 50% 46% 46% / 58% 58% 42% 42%",
              willChange: "transform",
            }}
          />
        </span>
      </span>
    </span>
  );
}
