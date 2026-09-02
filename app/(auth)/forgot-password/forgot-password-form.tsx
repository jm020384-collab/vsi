"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/lib/actions/reset-password";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<{ ok: true } | null, FormData>(
    (_prev, fd) => requestPasswordResetAction(_prev, fd),
    null,
  );

  if (state?.ok) {
    return (
      <div className="rounded-lg border bg-muted/40 p-6 text-center">
        <Mail className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-lg font-medium">Перевірте пошту</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Якщо акаунт із цією електронною адресою існує, ми надіслали інструкцію для відновлення
          пароля. Посилання дійсне 45 хвилин.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Надсилаємо…" : "Відновити пароль"}
      </Button>
    </form>
  );
}
