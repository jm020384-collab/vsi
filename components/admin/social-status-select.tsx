"use client";

import { useState, useTransition } from "react";
import type { SocialSupportStatus } from "@prisma/client";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { setSocialSupportStatusAction } from "@/lib/actions/social-support";
import { SOCIAL_STATUS_LABEL, SOCIAL_STATUS_ORDER } from "@/lib/social-support";

/**
 * Зміна статусу заявки.
 *
 * Стан тримаємо локально й міняємо одразу: сторінка перемальовується з
 * сервера після revalidatePath, але список не має «підвисати» на час
 * запиту. Якщо сервер відмовив — повертаємо попереднє значення.
 */
export function SocialStatusSelect({
  requestId,
  initial,
}: {
  requestId: string;
  initial: SocialSupportStatus;
}) {
  const [status, setStatus] = useState(initial);
  const [pending, startTransition] = useTransition();

  return (
    <select
      aria-label="Статус заявки"
      value={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value as SocialSupportStatus;
        const previous = status;
        setStatus(next);
        startTransition(async () => {
          const res = await setSocialSupportStatusAction(requestId, next);
          if (!res.ok) {
            setStatus(previous);
            toast.error(res.error);
          } else {
            toast.success(`Статус: ${SOCIAL_STATUS_LABEL[next]}`);
          }
        });
      }}
      className={cn(
        "h-9 rounded-lg border border-[#142744]/15 bg-[#FFFDF8] px-2.5 text-[13px] text-[#142744]",
        "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
        "disabled:opacity-60",
      )}
    >
      {SOCIAL_STATUS_ORDER.map((s) => (
        <option key={s} value={s}>
          {SOCIAL_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  );
}
