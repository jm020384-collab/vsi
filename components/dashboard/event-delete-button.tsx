"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { deleteEventAction } from "@/lib/actions/events";
import { focusRing } from "@/components/preview/vsi/theme";

export function EventDeleteButton({ eventId }: { eventId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-label="Видалити подію"
      onClick={() =>
        startTransition(async () => {
          const res = await deleteEventAction(eventId);
          if (!res.ok) toast.error(res.error);
        })
      }
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06] hover:text-[#8A4B33]",
        "disabled:opacity-50",
        focusRing,
      )}
    >
      <Trash2 className="h-4 w-4" aria-hidden />
    </button>
  );
}
