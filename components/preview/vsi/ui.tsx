import { cn } from "@/lib/utils";
import { focusRing, focusRingDark, ink, touch } from "./theme";

/** Надзаголовок — тонкий, розріджений, з короткою золотою рискою. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em]",
        tone === "light" ? "text-[#5C6672]" : "text-[#C9C7D1]",
        className,
      )}
    >
      <span aria-hidden className="h-px w-6 bg-[#B38B49]" />
      {children}
    </p>
  );
}

/** Великий заголовок секції — Cormorant, тонке накреслення, щільний leading. */
export function SectionTitle({
  children,
  tone = "light",
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Tag
      className={cn(
        "text-balance font-normal leading-[1.08] tracking-[-0.01em]",
        Tag === "h1" ? "text-[2.6rem] sm:text-6xl lg:text-[4.2rem]" : "text-4xl sm:text-5xl",
        tone === "light" ? ink.strong : "text-[#F8F4EC]",
        className,
      )}
      style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
    >
      {children}
    </Tag>
  );
}

export function Lead({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-pretty text-lg leading-relaxed sm:text-xl",
        tone === "light" ? "text-[#4A5568]" : "text-[#D6D3DD]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/* ── Кнопки ─────────────────────────────────────────────────── */

type BtnVariant = "primary" | "outline" | "onDark" | "ghostOnDark";

const BTN: Record<BtnVariant, string> = {
  primary:
    "bg-[#1C3557] text-[#FFFDF8] hover:bg-[#142744] active:bg-[#0F1D33] shadow-[0_1px_0_0_rgba(20,39,68,0.15)]",
  outline:
    "border border-[#142744]/22 text-[#142744] hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] active:bg-[#142744]/[0.07]",
  onDark: "bg-[#F8F4EC] text-[#142744] hover:bg-[#FFFDF8] active:bg-[#E9DECE]",
  ghostOnDark:
    "border border-[#F8F4EC]/28 text-[#F8F4EC] hover:border-[#F8F4EC]/55 hover:bg-[#F8F4EC]/[0.08]",
};

export function ButtonLink({
  children,
  variant = "primary",
  href = "#",
  className,
  ...rest
}: {
  children: React.ReactNode;
  variant?: BtnVariant;
  href?: string;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const onDark = variant === "onDark" || variant === "ghostOnDark";
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 text-sm font-medium",
        "transition-all duration-200 motion-reduce:transition-none",
        touch,
        BTN[variant],
        onDark ? focusRingDark : focusRing,
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}

/* ── Секція ─────────────────────────────────────────────────── */

export function Section({
  children,
  className,
  id,
  tone = "ivory",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: "ivory" | "white" | "parchment" | "midnight";
}) {
  const bg = {
    ivory: "bg-[#F8F4EC]",
    white: "bg-[#FFFDF8]",
    parchment: "bg-[#E9DECE]",
    midnight: "bg-[#142744]",
  }[tone];

  return (
    <section id={id} className={cn("relative", bg, className)}>
      {children}
    </section>
  );
}

/** Внутрішня обгортка з максимальною шириною й уніфікованими відступами. */
export function Wrap({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1180px] px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
