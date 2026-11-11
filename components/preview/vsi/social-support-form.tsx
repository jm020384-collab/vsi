"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  createSocialSupportRequestAction,
  type SocialSupportState,
} from "@/lib/actions/social-support";
import { DAY_PARTS, SOCIAL_CURRENCIES, WEEKDAYS } from "@/lib/social-support";
import { focusRing, ink, touch } from "./theme";

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

const labelClass = cn("mb-1.5 block text-sm font-medium", ink.strong);
const hintClass = cn("mt-1.5 text-[13px]", ink.soft);

const GENDERS = ["Жінка", "Чоловік", "Інше", "Волію не вказувати"];

const FORMATS: { value: string; label: string }[] = [
  { value: "ONLINE", label: "Онлайн" },
  { value: "OFFLINE", label: "Очно" },
  { value: "BOTH", label: "Не має значення" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] text-[#8A4B33]">{message}</p>;
}

/**
 * Заявка на соціальну психологічну підтримку.
 *
 * Фахівця тут не обирають — заявка адресована програмі, а відповідність
 * запиту, бюджету й часу перевіряє адміністратор. Тому форма не обіцяє
 * ні підбору, ні запису на зустріч.
 */
export function SocialSupportForm({
  languages,
}: {
  languages: { code: string; nameUk: string }[];
}) {
  const [state, formAction, pending] = useActionState<SocialSupportState | null, FormData>(
    (prev, fd) => createSocialSupportRequestAction(prev, fd),
    null,
  );
  // Помилка поля живе до наступної відправки, тож без цього вона висіла б
  // під уже виправленим полем.
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const clearOnEdit = (name: string) => () =>
    setEdited((prev) => (prev[name] ? prev : { ...prev, [name]: true }));

  if (state?.ok) {
    return (
      <div
        id="apply"
        className="mt-8 flex max-w-xl items-start gap-3 rounded-2xl border border-[#2F6B4F]/25 bg-[#2F6B4F]/[0.06] px-6 py-5"
      >
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#245A41]" aria-hidden />
        <div className="text-[15px] leading-relaxed text-[#245A41]">
          <p className="font-medium">Дякуємо. Ми отримали вашу заявку.</p>
          <p className="mt-2">
            Ми розглянемо її протягом 48 годин і зв&apos;яжемося з вами, якщо знайдемо фахівця, який
            відповідає вашому запиту та доступності.
          </p>
        </div>
      </div>
    );
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;
  const prev = state?.ok === false ? state.values : undefined;
  const errorFor = (name: string) => (edited[name] ? undefined : fieldErrors?.[name]?.[0]);

  return (
    <form
      id="apply"
      action={formAction}
      onSubmit={() => setEdited({})}
      className="mt-8 max-w-xl space-y-6 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6 sm:p-8"
    >
      {/* Пастка для ботів — прихована від людей */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="ss-website">Не заповнюйте це поле</label>
        <input id="ss-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-4">
        <legend className={cn("text-[13px] font-medium uppercase tracking-[0.14em]", ink.soft)}>
          Контактні дані
        </legend>

        <div>
          <label htmlFor="ss-name" className={labelClass}>
            Ім&apos;я
          </label>
          <input
            id="ss-name"
            name="name"
            required
            defaultValue={prev?.name ?? ""}
            onChange={clearOnEdit("name")}
            className={inputClass}
          />
          <FieldError message={errorFor("name")} />
        </div>

        <div>
          <label htmlFor="ss-email" className={labelClass}>
            Email
          </label>
          <input
            id="ss-email"
            name="email"
            type="email"
            required
            defaultValue={prev?.email ?? ""}
            onChange={clearOnEdit("email")}
            className={inputClass}
          />
          <FieldError message={errorFor("email")} />
        </div>

        <div>
          <label htmlFor="ss-contact" className={labelClass}>
            Телефон або месенджер
          </label>
          <input
            id="ss-contact"
            name="contact"
            required
            placeholder="+380 … або @nickname"
            defaultValue={prev?.contact ?? ""}
            onChange={clearOnEdit("contact")}
            className={inputClass}
          />
          <FieldError message={errorFor("contact")} />
        </div>

        <div>
          <label htmlFor="ss-country" className={labelClass}>
            Країна або часовий пояс
          </label>
          <input
            id="ss-country"
            name="country"
            required
            placeholder="Україна, Київ · або UTC+2"
            defaultValue={prev?.country ?? ""}
            onChange={clearOnEdit("country")}
            className={inputClass}
          />
          <FieldError message={errorFor("country")} />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className={cn("text-[13px] font-medium uppercase tracking-[0.14em]", ink.soft)}>
          Про вас
        </legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ss-age" className={labelClass}>
              Вік
            </label>
            <input
              id="ss-age"
              name="age"
              type="number"
              min={16}
              max={120}
              required
              defaultValue={prev?.age ?? ""}
              onChange={clearOnEdit("age")}
              className={inputClass}
            />
            <FieldError message={errorFor("age")} />
          </div>
          <div>
            <label htmlFor="ss-gender" className={labelClass}>
              Стать
            </label>
            <select
              id="ss-gender"
              name="gender"
              required
              defaultValue={prev?.gender ?? ""}
              onChange={clearOnEdit("gender")}
              className={inputClass}
            >
              <option value="">Оберіть</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <FieldError message={errorFor("gender")} />
          </div>
        </div>
      </fieldset>

      <div>
        <label htmlFor="ss-request" className={labelClass}>
          Опишіть коротко ваш запит
        </label>
        <textarea
          id="ss-request"
          name="request"
          required
          rows={5}
          defaultValue={prev?.request ?? ""}
          onChange={clearOnEdit("request")}
          className={cn(inputClass, "h-auto py-3 leading-relaxed")}
        />
        <FieldError message={errorFor("request")} />
      </div>

      <fieldset>
        <legend className={labelClass}>
          Який бюджет ви можете виділити на одну психологічну консультацію?
        </legend>
        <div className="mt-1.5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            name="budgetAmount"
            type="number"
            min={1}
            required
            aria-label="Сума"
            placeholder="50"
            defaultValue={prev?.budgetAmount ?? ""}
            onChange={clearOnEdit("budgetAmount")}
            className={inputClass}
          />
          <select
            name="budgetCurrency"
            required
            aria-label="Валюта"
            defaultValue={prev?.budgetCurrency ?? "UAH"}
            className={cn(inputClass, "sm:w-32")}
          >
            {SOCIAL_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <FieldError message={errorFor("budgetAmount")} />
      </fieldset>

      <fieldset>
        <legend className={labelClass}>У які дні вам зручно зустрічатися?</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {WEEKDAYS.map((d) => (
            <label key={d.value} className="flex items-center gap-2 text-[15px]">
              <input
                type="checkbox"
                name="days"
                value={d.value}
                defaultChecked={prev?.days?.includes(d.value)}
                onChange={clearOnEdit("days")}
                className="h-4 w-4 rounded border-[#142744]/30 accent-[#1C3557]"
              />
              <span className={ink.body}>{d.label}</span>
            </label>
          ))}
        </div>
        <FieldError message={errorFor("days")} />
      </fieldset>

      <fieldset>
        <legend className={labelClass}>Який час вам підходить?</legend>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2">
          {DAY_PARTS.map((p) => (
            <label key={p.value} className="flex items-center gap-2 text-[15px]">
              <input
                type="checkbox"
                name="dayParts"
                value={p.value}
                defaultChecked={prev?.dayParts?.includes(p.value)}
                onChange={clearOnEdit("dayParts")}
                className="h-4 w-4 rounded border-[#142744]/30 accent-[#1C3557]"
              />
              <span className={ink.body}>{p.label}</span>
            </label>
          ))}
        </div>
        <FieldError message={errorFor("dayParts")} />
      </fieldset>

      <div>
        <label htmlFor="ss-note" className={labelClass}>
          Уточнення щодо доступного часу <span className={ink.soft}>(необов&apos;язково)</span>
        </label>
        <input
          id="ss-note"
          name="availabilityNote"
          placeholder="Наприклад: після 18:00 за київським часом"
          defaultValue={prev?.availabilityNote ?? ""}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="ss-language" className={labelClass}>
            Бажана мова роботи
          </label>
          <select
            id="ss-language"
            name="languageCode"
            defaultValue={prev?.languageCode ?? ""}
            className={inputClass}
          >
            <option value="">Не має значення</option>
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.nameUk}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ss-format" className={labelClass}>
            Формат
          </label>
          <select
            id="ss-format"
            name="format"
            defaultValue={prev?.format ?? "BOTH"}
            className={inputClass}
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-start gap-3 text-[14px] leading-relaxed">
        <input
          type="checkbox"
          name="consent"
          required
          defaultChecked={false}
          onChange={clearOnEdit("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#142744]/30 accent-[#1C3557]"
        />
        <span className={ink.body}>
          Я погоджуюся на обробку моїх даних для розгляду заявки та підбору фахівця.
        </span>
      </label>
      <FieldError message={errorFor("consent")} />

      {state?.ok === false && state.error && (
        <p className="rounded-lg border border-[#8A4B33]/25 bg-[#8A4B33]/[0.06] px-4 py-3 text-[14px] text-[#8A4B33]">
          {state.error}
        </p>
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
        {pending ? "Надсилаємо…" : "Подати заявку"}
      </button>

      <p className={hintClass}>
        Подання заявки не гарантує підбору фахівця — можливість участі залежить від поточної
        доступності спеціалістів.
      </p>
    </form>
  );
}
