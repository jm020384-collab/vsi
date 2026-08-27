"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PartyPopper } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAction, type RegisterState } from "@/lib/actions/register";

export function RegisterForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<RegisterState | null, FormData>(
    async (prev, fd) => {
      const result = await registerAction(prev, fd);
      if (result.ok) {
        const email = String(fd.get("email") ?? "");
        const password = String(fd.get("password") ?? "");
        const signInResult = await signIn("credentials", { email, password, redirect: false });
        if (signInResult?.error) {
          // Акаунт створено, але авто-вхід чомусь не спрацював — "Перейти
          // до кабінету" нижче все одно безпечний: без сесії middleware
          // просто поверне на /login, а не в глухий кут.
          toast.error("Акаунт створено. Увійдіть, будь ласка, самостійно.");
        }
      } else {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  if (state?.ok) {
    return (
      <div className="rounded-lg border bg-muted/40 p-6 text-center">
        <PartyPopper className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h2 className="mt-3 text-lg font-medium">Реєстрація пройшла успішно</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Акаунт створено. Заповніть анкету профілю — і ваш простір з'явиться в каталозі після
          перевірки.
        </p>
        <Button className="mt-4 w-full" onClick={() => router.push("/dashboard")}>
          Перейти до кабінету
        </Button>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="name">Ім'я</Label>
        <Input id="name" name="name" autoComplete="name" required minLength={2} />
        {fieldErrors?.name?.[0] && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {fieldErrors?.email?.[0] && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.email[0]}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
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
        <Label htmlFor="confirmPassword">Повтор паролю</Label>
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

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4" />
        <span>
          Погоджуюся з{" "}
          <Link className="text-primary hover:underline" href="/terms" target="_blank">
            угодою
          </Link>{" "}
          та{" "}
          <Link className="text-primary hover:underline" href="/privacy" target="_blank">
            політикою конфіденційності
          </Link>
          .
        </span>
      </label>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Створюємо акаунт…" : "Зареєструватися як фахівець"}
      </Button>
    </form>
  );
}
