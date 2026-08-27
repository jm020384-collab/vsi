"use client";

import { useActionState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { resendVerificationEmailAction, type ResendState } from "@/lib/actions/verify-email";

/** Кнопка «Надіслати лист ще раз» — на екрані реєстрації й на сторінці входу. */
export function ResendVerificationButton({ email }: { email: string }) {
  const [, action, pending] = useActionState<ResendState | null, FormData>(async (_prev, fd) => {
    const result = await resendVerificationEmailAction(_prev, fd);
    if (result.ok) toast.success("Лист надіслано ще раз");
    else toast.error(result.error);
    return result;
  }, null);

  return (
    <form action={action}>
      <input type="hidden" name="email" value={email} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Надсилаємо…" : "Надіслати лист ще раз"}
      </Button>
    </form>
  );
}
