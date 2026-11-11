"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { updateSocialSupportSettingsAction } from "@/lib/actions/social-support";
import { DAY_PARTS, SOCIAL_CURRENCIES, WEEKDAYS } from "@/lib/social-support";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

export interface SocialSupportInitial {
  participates: boolean;
  days: string[];
  dayParts: string[];
  /** У цілих одиницях валюти — у базі зберігається в мінімальних. */
  minRate: number | null;
  currency: string | null;
}

/**
 * Участь фахівця у програмі соціальної підтримки.
 *
 * Окремої реєстрації немає — перемикач тут і є вступом до програми.
 * Дні, час і мінімальна ставка потрібні адміністратору для підбору й
 * публічно не показуються; на сайті видно лише сам факт участі.
 */
export function SocialSupportSettingsForm({ initial }: { initial: SocialSupportInitial }) {
  const [participates, setParticipates] = useState(initial.participates);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const res = await updateSocialSupportSettingsAction(fd);
          if (res.ok) toast.success("Збережено");
          else toast.error(res.error);
        })
      }
      className="mt-6 space-y-6 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6"
    >
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          name="participates"
          checked={participates}
          onChange={(e) => setParticipates(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border-[#142744]/30 accent-[#1C3557]"
        />
        <span>
          <span className={cn("block text-[15px] font-medium", ink.strong)}>
            Я підтримую проєкт соціальної психологічної підтримки VSI
          </span>
          <span className={cn("mt-1 block text-[14px] leading-relaxed", ink.soft)}>
            Ви потрапляєте до списку фахівців, яких адміністратор може залучити до програми. Це не
            зобовʼязання взяти конкретну людину — щоразу рішення за вами.
          </span>
        </span>
      </label>

      {participates && (
        <>
          <fieldset>
            <legend className={cn("mb-2 block text-sm font-medium", ink.strong)}>
              У які дні вам зручно
            </legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {WEEKDAYS.map((d) => (
                <label key={d.value} className="flex items-center gap-2 text-[15px]">
                  <input
                    type="checkbox"
                    name="days"
                    value={d.value}
                    defaultChecked={initial.days.includes(d.value)}
                    className="h-4 w-4 rounded border-[#142744]/30 accent-[#1C3557]"
                  />
                  <span className={ink.body}>{d.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={cn("mb-2 block text-sm font-medium", ink.strong)}>
              Зручний час
            </legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {DAY_PARTS.map((p) => (
                <label key={p.value} className="flex items-center gap-2 text-[15px]">
                  <input
                    type="checkbox"
                    name="dayParts"
                    value={p.value}
                    defaultChecked={initial.dayParts.includes(p.value)}
                    className="h-4 w-4 rounded border-[#142744]/30 accent-[#1C3557]"
                  />
                  <span className={ink.body}>{p.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
              Мінімальна ставка в межах програми <span className={ink.soft}>(необовʼязково)</span>
            </legend>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                name="minRate"
                type="number"
                min={0}
                aria-label="Сума"
                placeholder="Наприклад, 300"
                defaultValue={initial.minRate ?? ""}
                className={inputClass}
              />
              <select
                name="currency"
                aria-label="Валюта"
                defaultValue={initial.currency ?? "UAH"}
                className={cn(inputClass, "sm:w-32")}
              >
                {SOCIAL_CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <p className={cn("mt-1.5 text-[13px]", ink.soft)}>
              Видно лише адміністратору — на вашій публічній сторінці ставка не показується.
            </p>
          </fieldset>
        </>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center justify-center rounded-xl bg-[#142744] px-6 text-[15px] font-medium text-[#F8F4EC]",
          "transition-colors hover:bg-[#1C3557] disabled:opacity-60 motion-reduce:transition-none",
          touch,
          focusRing,
        )}
      >
        {pending ? "Зберігаємо…" : "Зберегти"}
      </button>
    </form>
  );
}
