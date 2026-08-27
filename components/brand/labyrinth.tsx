import { cn } from "@/lib/utils";

interface LabyrinthProps extends React.SVGProps<SVGSVGElement> {
  /** Розмір боку SVG (за замовчуванням 1em — масштабується разом з текстом) */
  size?: number | string;
  /** Товщина лінії (за замовчуванням 6 в координатах 200×200) */
  strokeWidth?: number;
  /** Малювати точку у центрі (за замовчуванням так) */
  centerDot?: boolean;
}

/**
 * Стилізований 7-контурний лабіринт у дусі критського / мінойського.
 *
 * Використовується як знак бренду «Аріадна»:
 *  - у логотипі хедера
 *  - як фоновий watermark hero-секції
 *  - як favicon
 *  - як декоративний роздільник секцій
 *
 * Лінія малюється `currentColor`, тому колір успадковується з тексту.
 */
export function Labyrinth({
  size = "1em",
  strokeWidth = 6,
  centerDot = true,
  className,
  ...props
}: LabyrinthProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Лабіринт — знак «Аріадна»"
      className={cn("inline-block", className)}
      {...props}
    >
      {/* Контур 1 — зовнішня стіна, відкрита знизу */}
      <path d="M 110 192 L 192 192 L 192 100 A 92 92 0 0 0 8 100 L 8 192 L 90 192" />

      {/* Контур 2 */}
      <path d="M 110 172 L 172 172 L 172 100 A 72 72 0 0 0 28 100 L 28 172 L 90 172" />

      {/* Контур 3 — інверсія: відкритий зверху */}
      <path d="M 48 152 L 48 100 A 52 52 0 0 1 152 100 L 152 152" />
      <path d="M 48 152 L 90 152" />
      <path d="M 110 152 L 152 152" />

      {/* Контур 4 */}
      <path d="M 110 132 L 132 132 L 132 100 A 32 32 0 0 0 68 100 L 68 132 L 90 132" />

      {/* Контур 5 — найглибший */}
      <path d="M 88 112 L 88 100 A 12 12 0 0 1 112 100 L 112 112" />
      <path d="M 88 112 L 100 112" />

      {/* Вхід — вертикальна нитка від низу до центру */}
      <path d="M 100 192 L 100 132" strokeDasharray="0" opacity="0.55" />

      {/* Центр — точка пробудження */}
      {centerDot && <circle cx="100" cy="106" r="3.5" fill="currentColor" stroke="none" />}
    </svg>
  );
}

/**
 * Версія лабіринту без центральної точки і нитки — для дрібних місць
 * (фавіконка, маленькі іконки), де деталі тільки заважають.
 */
export function LabyrinthMark({
  size = "1em",
  strokeWidth = 8,
  className,
  ...props
}: Omit<LabyrinthProps, "centerDot">) {
  return (
    <Labyrinth
      size={size}
      strokeWidth={strokeWidth}
      centerDot={false}
      className={className}
      {...props}
    />
  );
}
