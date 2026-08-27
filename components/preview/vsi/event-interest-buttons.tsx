"use client";

import { useActionState, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
  registerForEventAction,
  setEventInterestAction,
  type GuestRegistrationState,
} from "@/lib/actions/events";
import { focusRing, touch } from "./theme";

const inputClass = cn(
  "h-10 w-full rounded-lg border border-[#142744]/15 bg-[#FFFDF8] px-3 text-sm text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

/**
 * Форма реєстрації без акаунта — «Зареєструватися» відкрите для будь-кого,
 * хто бачить подію. Той самий формою устрій, що й ContactRequestForm:
 * honeypot-поле, стан успіху замінює форму на місці.
 */
function GuestRegistrationForm({ eventId, onCancel }: { eventId: string; onCancel: () => void }) {
  const [state, formAction, pending] = useActionState<GuestRegistrationState | null, FormData>(
    (prev, fd) => registerForEventAction(prev, fd),
    null,
  );

  if (state?.ok) {
    return (
      <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#245A41]">
        <Check className="h-4 w-4 shrink-0" aria-hidden />
        Реєстрацію прийнято — з вами зв'яжуться перед подією.
      </p>
    );
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  return (
    <form
      action={formAction}
      className="mt-4 max-w-sm space-y-2.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-4"
    >
      <input type="hidden" name="eventId" value={eventId} />
      <div className="sr-only" aria-hidden="true">
        <label>
          Залиште це поле порожнім
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <input name="name" required placeholder="Ваше ім'я" className={inputClass} />
        {fieldErrors?.name?.[0] && (
          <p className="mt-1 text-[12px] text-[#8A4B33]">{fieldErrors.name[0]}</p>
        )}
      </div>
      <div>
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
        {fieldErrors?.email?.[0] && (
          <p className="mt-1 text-[12px] text-[#8A4B33]">{fieldErrors.email[0]}</p>
        )}
      </div>
      <input name="phone" placeholder="Телефон (необов'язково)" className={inputClass} />

      {state?.ok === false && <p className="text-[12px] text-[#8A4B33]">{state.error}</p>}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "inline-flex h-9 items-center rounded-lg bg-[#1C3557] px-4 text-sm font-medium text-[#FFFDF8]",
            "transition-colors hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
            focusRing,
          )}
        >
          {pending ? "Реєструємо…" : "Підтвердити"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={cn("text-sm font-medium text-[#5C6672] hover:text-[#142744]", focusRing)}
        >
          Скасувати
        </button>
      </div>
    </form>
  );
}

/**
 * Зареєструватися на подію — відкрито для всіх (гостьова форма) і для
 * залогінених фахівців (миттєвий перемикач). «Зберегти на потім» тут
 * навмисно немає: клієнти акаунтів не мають узагалі, тож кнопка,
 * що вимагає входу, була б глухим кутом без жодного способу увійти.
 */
export function EventInterestButtons({
  eventId,
  initialStatus,
  isLoggedIn,
}: {
  eventId: string;
  initialStatus: "SAVED" | "REGISTERED" | null;
  isLoggedIn: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();
  const [guestMode, setGuestMode] = useState(false);

  const register = () => {
    if (!isLoggedIn) {
      setGuestMode(true);
      return;
    }

    const optimistic = status === "REGISTERED" ? null : "REGISTERED";
    setStatus(optimistic);
    startTransition(async () => {
      const result = await setEventInterestAction(eventId, "REGISTERED");
      if (!result.ok) {
        setStatus(status);
        toast.error(result.error);
      } else {
        setStatus(result.status);
      }
    });
  };

  if (guestMode) {
    return <GuestRegistrationForm eventId={eventId} onCancel={() => setGuestMode(false)} />;
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        disabled={pending}
        onClick={register}
        aria-pressed={status === "REGISTERED"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs font-medium disabled:opacity-60",
          touch,
          status === "REGISTERED"
            ? "border-[#245A41] bg-[#2F6B4F]/[0.08] text-[#245A41]"
            : "border-[#142744]/15 text-[#4A5568] hover:border-[#142744]/35",
          focusRing,
        )}
      >
        <Check className="h-3.5 w-3.5" aria-hidden />
        {status === "REGISTERED" ? "Зареєстровано" : "Зареєструватися"}
      </button>
    </div>
  );
}
