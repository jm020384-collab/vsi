"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export interface MultiSelectOption {
  value: string;
  label: string;
}

/**
 * Випадаючий список із множинним вибором у стилі VSI.
 *
 * Свідомо без пошуку всередині: списки тут короткі й кураторські
 * (підходи, мови), а зайве поле вводу ламало б ритм анкети. Обране
 * показується чипами під полем — щоб вибір лишався видимим, коли
 * список закритий.
 */
export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Оберіть один або кілька",
  id,
}: {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const listId = `${id ?? generatedId}-list`;

  // Клік поза компонентом і Escape закривають список — інакше на
  // мобільному відкритий список перекриває кнопки навігації майстра.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const labelFor = (value: string) => options.find((o) => o.value === value)?.label ?? value;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-xl border px-3.5 text-left text-[15px]",
          "border-[#142744]/15 bg-[#FFFDF8]",
          "hover:border-[#142744]/35",
          "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
        )}
      >
        <span className={selected.length ? ink.strong : "text-[#8C93A0]"}>
          {selected.length ? `Обрано: ${selected.length}` : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-[#5C6672] transition-transform duration-200 motion-reduce:transition-none",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <div
          id={listId}
          role="listbox"
          aria-multiselectable
          className={cn(
            "absolute z-30 mt-1.5 w-full overflow-y-auto rounded-xl border border-[#142744]/15 bg-[#FFFDF8] py-1.5",
            "max-h-[340px] shadow-[0_18px_40px_-18px_rgba(20,39,68,0.35)]",
          )}
        >
          {options.map((o) => {
            const active = selected.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => toggle(o.value)}
                className={cn(
                  "flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left text-[14px] leading-snug",
                  "hover:bg-[#142744]/[0.04]",
                  active ? ink.strong : ink.body,
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-[1px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border",
                    active ? "border-[#1C3557] bg-[#1C3557]" : "border-[#142744]/25 bg-transparent",
                  )}
                >
                  {active && <Check className="h-3 w-3 text-[#FFFDF8]" />}
                </span>
                {o.label}
              </button>
            );
          })}
        </div>
      )}

      {selected.length > 0 && (
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {selected.map((value) => (
            <li key={value}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-[#142744]/15 bg-[#F8F4EC]",
                  "py-1 pl-3 pr-1.5 text-[13px] text-[#4A5568]",
                )}
              >
                {labelFor(value)}
                <button
                  type="button"
                  onClick={() => toggle(value)}
                  aria-label={`Прибрати «${labelFor(value)}»`}
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[#5C6672]",
                    "hover:bg-[#142744]/10 hover:text-[#142744]",
                    focusRing,
                  )}
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
