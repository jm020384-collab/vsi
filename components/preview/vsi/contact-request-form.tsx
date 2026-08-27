"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createContactRequestAction,
  type ContactRequestState,
} from "@/lib/actions/contact-request";
import { focusRing, ink, touch } from "./theme";

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

/**
 * Перше звернення до фахівця — не бронювання, а запрошення до
 * листування. Anti-spam без Turnstile: honeypot-поле «website»
 * (приховане від людей) + ліміт за IP на сервері.
 */
export function ContactRequestForm({ therapistSlug }: { therapistSlug: string }) {
  const [state, formAction, pending] = useActionState<ContactRequestState | null, FormData>(
    (prev, fd) => createContactRequestAction(prev, fd),
    null,
  );

  if (state?.ok) {
    return (
      <div className="mt-5 flex max-w-md items-start gap-3 rounded-xl border border-[#2F6B4F]/25 bg-[#2F6B4F]/[0.06] px-5 py-4">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#245A41]" aria-hidden />
        <p className="text-[14px] leading-relaxed text-[#245A41]">
          Заявку надіслано. Фахівець отримає її й зв'яжеться з вами напряму.
        </p>
      </div>
    );
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  return (
    <form action={formAction} className="mt-5 max-w-md space-y-4">
      <input type="hidden" name="therapistSlug" value={therapistSlug} />

      {/* Пастка для ботів — прихована від людей */}
      <div className="sr-only" aria-hidden="true">
        <label>
          Залиште це поле порожнім
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <input name="patientName" required placeholder="Ваше ім'я" className={inputClass} />
        {fieldErrors?.patientName?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.patientName[0]}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <input
            name="patientEmail"
            type="email"
            required
            placeholder="Email"
            className={inputClass}
          />
          {fieldErrors?.patientEmail?.[0] && (
            <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.patientEmail[0]}</p>
          )}
        </div>
        <input name="patientPhone" placeholder="Телефон (необов'язково)" className={inputClass} />
      </div>

      <input
        name="preferredTime"
        placeholder="Зручний час (необов'язково)"
        className={inputClass}
      />

      <div>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Коротко опишіть, що вас турбує і чому звертаєтесь саме зараз"
          className={cn(inputClass, "h-auto py-3 leading-relaxed")}
        />
        {fieldErrors?.message?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.message[0]}</p>
        )}
      </div>

      <label className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#4A5568]">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#142744]/25"
        />
        Погоджуюся на обробку цих даних фахівцем для першого контакту.
      </label>

      {state?.ok === false && (
        <p className="rounded-lg border border-[#8A4B33]/25 bg-[#8A4B33]/[0.06] px-4 py-3 text-[14px] text-[#8A4B33]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
          "transition-colors hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
          touch,
          focusRing,
        )}
      >
        {pending ? "Надсилаємо…" : "Залишити заявку через VSI"}
      </button>
    </form>
  );
}
