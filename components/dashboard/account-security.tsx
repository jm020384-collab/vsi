"use client";

import { useActionState, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Clock3 } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ink } from "@/components/preview/vsi/theme";
import {
  changePasswordAction,
  requestEmailChangeAction,
  cancelEmailChangeAction,
  type ChangePasswordState,
  type ChangeEmailState,
} from "@/lib/actions/account-settings";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142744]/[0.07] py-4">
      <div className={cn("text-sm", ink.soft)}>{label}</div>
      <div className="flex items-center gap-3">{children}</div>
    </div>
  );
}

function EmailField({
  email,
  pendingEmail,
  emailVerified,
}: {
  email: string;
  pendingEmail: string | null;
  emailVerified: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [state, action, formPending] = useActionState<ChangeEmailState | null, FormData>(
    async (_prev, fd) => {
      const result = await requestEmailChangeAction(_prev, fd);
      if (result.ok) {
        toast.success(`Лист із підтвердженням надіслано на ${result.pendingEmail}`);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );

  const onCancel = () => {
    startTransition(async () => {
      const result = await cancelEmailChangeAction();
      if (result.ok) {
        toast.success("Зміну email скасовано");
        router.refresh();
      }
    });
  };

  return (
    <>
      <Row label="Email">
        <span className={cn("text-sm font-medium", ink.strong)}>{email}</span>
        {emailVerified ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#245A41]">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            Підтверджено
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#876428]">
            <Clock3 className="h-3.5 w-3.5" aria-hidden />
            Не підтверджено
          </span>
        )}
        {!open && !pendingEmail && (
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
            Змінити email
          </Button>
        )}
      </Row>

      {pendingEmail && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#142744]/[0.07] py-3 text-sm">
          <span className={ink.soft}>
            Очікує підтвердження:{" "}
            <span className={cn("font-medium", ink.body)}>{pendingEmail}</span>
          </span>
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={onCancel}>
            Скасувати
          </Button>
        </div>
      )}

      {open && (
        <form
          action={action}
          className="flex flex-wrap items-center gap-2 border-b border-[#142744]/[0.07] py-3"
        >
          <Input
            name="newEmail"
            type="email"
            required
            placeholder="новий@email.com"
            className="h-9 w-64"
          />
          <Button type="submit" size="sm" disabled={formPending}>
            {formPending ? "…" : "Надіслати підтвердження"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Скасувати
          </Button>
        </form>
      )}
    </>
  );
}

function PasswordField() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ChangePasswordState | null, FormData>(
    async (_prev, fd) => {
      const result = await changePasswordAction(_prev, fd);
      if (result.ok) {
        toast.success("Пароль змінено");
        setOpen(false);
      } else if (!result.fieldErrors) {
        toast.error(result.error);
      }
      return result;
    },
    null,
  );
  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  if (!open) {
    return (
      <Row label="Пароль">
        <span className={cn("font-mono text-sm", ink.soft)}>••••••••••••</span>
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          Змінити пароль
        </Button>
      </Row>
    );
  }

  return (
    <div className="border-b border-[#142744]/[0.07] py-4">
      <div className={cn("mb-3 text-sm", ink.soft)}>Пароль</div>
      <form action={action} className="max-w-sm space-y-3">
        <div>
          <Label htmlFor="currentPassword">Поточний пароль</Label>
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
          {fieldErrors?.currentPassword?.[0] && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.currentPassword[0]}</p>
          )}
        </div>
        <div>
          <Label htmlFor="newPassword">Новий пароль</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
          {fieldErrors?.newPassword?.[0] && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.newPassword[0]}</p>
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
        <div className="flex gap-2 pt-1">
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Зберігаємо…" : "Зберегти новий пароль"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Скасувати
          </Button>
        </div>
      </form>
    </div>
  );
}

export function AccountSecurity({
  email,
  pendingEmail,
  emailVerified,
  registeredAt,
  lastLoginAt,
}: {
  email: string;
  pendingEmail: string | null;
  emailVerified: boolean;
  registeredAt: string;
  lastLoginAt: string | null;
}) {
  return (
    <div className="mt-8 max-w-2xl">
      <EmailField email={email} pendingEmail={pendingEmail} emailVerified={emailVerified} />
      <PasswordField />
      <Row label="Реєстрація">
        <span className={cn("text-sm", ink.body)}>{fmtDate(registeredAt)}</span>
      </Row>
      <Row label="Останній вхід">
        <span className={cn("text-sm", ink.body)}>{lastLoginAt ? fmtDate(lastLoginAt) : "—"}</span>
      </Row>
    </div>
  );
}
