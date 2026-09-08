"use client";

import { useState, useTransition } from "react";
import { Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { setEventRegistrationOpenAction } from "@/lib/actions/events";
import { focusRing } from "@/components/preview/vsi/theme";

/**
 * Закрити або відкрити запис на подію.
 *
 * Стан тримаємо локально й міняємо одразу: сторінка перемальовується
 * з сервера після revalidatePath, але кнопка не має чекати на це, щоб
 * не здавалося, що натискання не спрацювало.
 */
export function EventRegistrationToggle({
  eventId,
  initialOpen,
}: {
  eventId: string;
  initialOpen: boolean;
}) {
  const [open, setOpen] = useState(initialOpen);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const next = !open;
          setOpen(next);
          const res = await setEventRegistrationOpenAction(eventId, next);
          if (!res.ok) {
            setOpen(!next);
            toast.error(res.error);
          } else {
            toast.success(next ? "Запис відкрито" : "Запис закрито — подія лишається на сайті");
          }
        })
      }
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-medium",
        "transition-colors disabled:opacity-50 motion-reduce:transition-none",
        open
          ? "border-[#142744]/15 text-[#4A5568] hover:border-[#8A4B33]/40 hover:text-[#8A4B33]"
          : "border-[#B38B49]/45 bg-[#B38B49]/[0.08] text-[#876428] hover:border-[#B38B49]",
        focusRing,
      )}
    >
      {open ? (
        <>
          <Lock className="h-3.5 w-3.5" aria-hidden />
          Закрити запис
        </>
      ) : (
        <>
          <LockOpen className="h-3.5 w-3.5" aria-hidden />
          Відкрити запис
        </>
      )}
    </button>
  );
}
