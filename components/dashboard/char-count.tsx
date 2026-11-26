import { cn } from "@/lib/utils";

/** Скільки символів набрано і скільки можна. */
export function CharCount({ length, min, max }: { length: number; min?: number; max: number }) {
  const short = min !== undefined && length > 0 && length < min;
  const long = length > max;
  return (
    <p
      className={cn(
        "mt-1.5 text-right text-[12px]",
        short || long ? "font-medium text-[#8A4B33]" : "text-[#5C6672]",
      )}
      aria-live="polite"
    >
      {long
        ? `${length} з ${max} — задовго на ${length - max}`
        : short
          ? `${length} з ${max} — потрібно щонайменше ${min}`
          : `${length} з ${max}`}
    </p>
  );
}
