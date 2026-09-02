"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { resendVerificationEmailAction } from "@/lib/actions/verify-email";

/**
 * Кнопка «Надіслати лист ще раз» — на екрані реєстрації й на сторінці
 * входу. Навмисно БЕЗ власної <form>: цей компонент часто опиняється
 * всередині форми логіну/реєстрації, а вкладені <form> — невалідний
 * HTML, який ламає сабміт обох форм (React попереджає про hydration
 * error і "form was unexpectedly submitted").
 */
export function ResendVerificationButton({ email }: { email: string }) {
  const [pending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("email", email);
      const result = await resendVerificationEmailAction(null, fd);
      if (result.ok) toast.success("Лист надіслано ще раз");
      else toast.error(result.error);
    });
  };

  return (
    <Button type="button" variant="outline" size="sm" disabled={pending} onClick={onClick}>
      {pending ? "Надсилаємо…" : "Надіслати лист ще раз"}
    </Button>
  );
}
