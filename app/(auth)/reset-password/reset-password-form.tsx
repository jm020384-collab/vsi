"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPasswordAction, type ResetPasswordState } from "@/lib/actions/reset-password";

export function ResetPasswordForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<ResetPasswordState | null, FormData>(
    (prev, fd) => resetPasswordAction(prev, fd),
    null,
  );

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  if (state?.ok) {
    return (
      <div className="text-center">
        <Check className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-lg font-medium">Пароль успішно змінено</h2>
        <p className="mt-2 text-sm text-muted-foreground">Тепер можна увійти з новим паролем.</p>
        <Button className="mt-4 w-full" onClick={() => router.push("/login")}>
          Увійти
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />
      <div>
        <Label htmlFor="password">Новий пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        {fieldErrors?.password?.[0] && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.password[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Повторіть новий пароль</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
        {fieldErrors?.confirmPassword?.[0] && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      {state?.ok === false && !fieldErrors && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {state.error}
          <div className="mt-2">
            <Link href="/forgot-password" className="underline">
              Запросити нове посилання
            </Link>
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Зберігаємо…" : "Зберегти пароль"}
      </Button>
    </form>
  );
}
