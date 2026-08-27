"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { markRequestClosedAction } from "@/lib/actions/contact-request";
import { focusRing } from "@/components/preview/vsi/theme";

export function RequestCloseButton({ requestId }: { requestId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await markRequestClosedAction(requestId);
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Не вдалося оновити звернення");
          }
        })
      }
      className={cn(
        "shrink-0 rounded-lg border border-[#142744]/15 px-3 py-1.5 text-xs font-medium text-[#4A5568]",
        "hover:border-[#142744]/35 hover:bg-[#142744]/[0.04] disabled:opacity-50 motion-reduce:transition-none",
        focusRing,
      )}
    >
      {pending ? "…" : "Позначити опрацьованим"}
    </button>
  );
}
