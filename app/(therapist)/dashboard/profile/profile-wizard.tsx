"use client";

import { startTransition, useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, PartyPopper, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { updateTherapistProfileAction, type ProfileState } from "@/lib/actions/therapist-profile";
import { PhotoUploader } from "@/components/dashboard/photo-uploader";
import { DiplomaUploader, type DocumentItem } from "@/components/dashboard/diploma-uploader";
import { MultiSelect } from "@/components/dashboard/multi-select";
import { THERAPY_APPROACHES, OTHER_APPROACH, OTHER_LANGUAGE_CODE } from "@/lib/therapy-approaches";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

type SessionFormat = "ONLINE" | "OFFLINE" | "BOTH";
type AgeGroup = "CHILDREN" | "TEENS" | "ADULTS";
type TherapistWorkFormat = "INDIVIDUAL" | "COUPLES" | "FAMILY" | "GROUP";

interface TherapistDraft {
  fullName: string;
  professionalTitle: string | null;
  photoUrl: string | null;
  city: string;
  bio: string;
  yearsExperience: number;
  priceFrom: number;
  priceTo: number | null;
  sessionFormat: SessionFormat;
  workingHours: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  website: string | null;
  socialLinks: string[];
  specializationIds: string[];
  languageCodes: string[];
  approaches: string[];
  otherApproach: string | null;
  otherLanguage: string | null;
  slug: string;
  status: string;
  analyticalOrientation: string | null;
  ageGroups: AgeGroup[];
  workFormats: TherapistWorkFormat[];
  professionalInterests: string[];
  associations: string[];
  supervisionStatus: string | null;
  personalTherapyStatus: string | null;
}

interface FormValues {
  fullName: string;
  professionalTitle: string;
  photoUrl: string | null;
  city: string;
  bio: string;
  yearsExperience: string;
  priceFrom: string;
  priceTo: string;
  sessionFormat: SessionFormat;
  workingHours: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  telegram: string;
  website: string;
  socialLinks: string[];
  specializationIds: string[];
  languageCodes: string[];
  approaches: string[];
  otherApproach: string;
  otherLanguage: string;
  analyticalOrientation: string;
  ageGroups: AgeGroup[];
  workFormats: TherapistWorkFormat[];
  professionalInterests: string[];
  associations: string[];
  supervisionStatus: string;
  personalTherapyStatus: string;
}

/** На якому кроці лежить кожне поле — щоб при помилці перейти саме туди. */
const FIELD_STEP: Record<string, number> = {
  fullName: 0,
  professionalTitle: 0,
  city: 0,
  bio: 1,
  specializationIds: 2,
  languageCodes: 2,
  analyticalOrientation: 3,
  professionalInterests: 3,
  associations: 3,
  supervisionStatus: 3,
  personalTherapyStatus: 3,
  priceFrom: 4,
  priceTo: 4,
  workingHours: 4,
  contactEmail: 4,
  contactPhone: 4,
  whatsapp: 4,
  telegram: 4,
  website: 4,
  socialLinks: 4,
};

const STEPS = [
  "Про вас",
  "Ваша позиція",
  "Напрями й мови",
  "Професійна ідентичність",
  "Формат і контакти",
  "Дипломи",
  "Огляд",
] as const;

const FORMAT_LABEL: Record<SessionFormat, string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Онлайн і очно",
};

const AGE_GROUP_LABEL: Record<AgeGroup, string> = {
  CHILDREN: "Діти",
  TEENS: "Підлітки",
  ADULTS: "Дорослі",
};

const WORK_FORMAT_LABEL: Record<TherapistWorkFormat, string> = {
  INDIVIDUAL: "Індивідуально",
  COUPLES: "Пари",
  FAMILY: "Сім'я",
  GROUP: "Група",
};

function draftToValues(t: TherapistDraft): FormValues {
  return {
    fullName: t.fullName,
    professionalTitle: t.professionalTitle ?? "",
    photoUrl: t.photoUrl,
    city: t.city,
    bio: t.bio,
    yearsExperience: String(t.yearsExperience || ""),
    priceFrom: String(t.priceFrom || ""),
    priceTo: t.priceTo ? String(t.priceTo) : "",
    sessionFormat: t.sessionFormat,
    workingHours: t.workingHours ?? "",
    contactEmail: t.contactEmail ?? "",
    contactPhone: t.contactPhone ?? "",
    whatsapp: t.whatsapp ?? "",
    telegram: t.telegram ?? "",
    website: t.website ?? "",
    socialLinks: t.socialLinks,
    specializationIds: t.specializationIds,
    languageCodes: t.languageCodes,
    approaches: t.approaches,
    otherApproach: t.otherApproach ?? "",
    otherLanguage: t.otherLanguage ?? "",
    analyticalOrientation: t.analyticalOrientation ?? "",
    ageGroups: t.ageGroups,
    workFormats: t.workFormats,
    professionalInterests: t.professionalInterests,
    associations: t.associations,
    supervisionStatus: t.supervisionStatus ?? "",
    personalTherapyStatus: t.personalTherapyStatus ?? "",
  };
}

function buildFormData(v: FormValues): FormData {
  const fd = new FormData();
  fd.set("fullName", v.fullName);
  if (v.professionalTitle) fd.set("professionalTitle", v.professionalTitle);
  fd.set("city", v.city);
  fd.set("bio", v.bio);
  if (v.photoUrl) fd.set("photoUrl", v.photoUrl);
  fd.set("yearsExperience", v.yearsExperience);
  fd.set("priceFrom", v.priceFrom);
  if (v.priceTo) fd.set("priceTo", v.priceTo);
  fd.set("currency", "UAH");
  fd.set("sessionFormat", v.sessionFormat);
  if (v.workingHours) fd.set("workingHours", v.workingHours);
  if (v.contactEmail) fd.set("contactEmail", v.contactEmail);
  if (v.contactPhone) fd.set("contactPhone", v.contactPhone);
  if (v.whatsapp) fd.set("whatsapp", v.whatsapp);
  if (v.telegram) fd.set("telegram", v.telegram);
  if (v.website) fd.set("website", v.website);
  v.socialLinks.forEach((url) => fd.append("socialLinks", url));
  v.specializationIds.forEach((id) => fd.append("specializationIds", id));
  v.languageCodes.forEach((code) => fd.append("languageCodes", code));
  v.approaches.forEach((a) => fd.append("approaches", a));
  // «Інший…» зберігаємо, лише поки відповідний пункт справді обраний —
  // інакше знятий чекбокс лишав би в базі мертвий текст.
  if (v.approaches.includes(OTHER_APPROACH) && v.otherApproach) {
    fd.set("otherApproach", v.otherApproach);
  }
  if (v.languageCodes.includes(OTHER_LANGUAGE_CODE) && v.otherLanguage) {
    fd.set("otherLanguage", v.otherLanguage);
  }
  if (v.analyticalOrientation) fd.set("analyticalOrientation", v.analyticalOrientation);
  v.ageGroups.forEach((g) => fd.append("ageGroups", g));
  v.workFormats.forEach((f) => fd.append("workFormats", f));
  v.professionalInterests.forEach((i) => fd.append("professionalInterests", i));
  v.associations.forEach((a) => fd.append("associations", a));
  if (v.supervisionStatus) fd.set("supervisionStatus", v.supervisionStatus);
  if (v.personalTherapyStatus) fd.set("personalTherapyStatus", v.personalTherapyStatus);
  return fd;
}

const inputClass = cn(
  "h-12 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>{children}</span>
      {hint && <span className={cn("mb-1.5 block text-[13px]", ink.soft)}>{hint}</span>}
    </label>
  );
}

function chipClass(active: boolean) {
  return cn(
    "inline-flex items-center rounded-full border px-3.5 text-sm transition-all duration-200 motion-reduce:transition-none",
    touch,
    focusRing,
    active
      ? "border-[#1C3557] bg-[#1C3557] text-[#FFFDF8]"
      : "border-[#142744]/15 bg-[#FFFDF8] text-[#4A5568] hover:border-[#142744]/35",
  );
}

/** Довільні мітки, які фахівець додає сам (професійні інтереси, асоціації). */
function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (v && !value.includes(v)) onChange([...value, v]);
    setDraft("");
  };

  return (
    <div>
      {value.length > 0 && (
        <div className="mb-2.5 flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#142744]/15 bg-[#FFFDF8] py-1 pl-3.5 pr-2 text-sm text-[#4A5568]"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Прибрати «${tag}»`}
                className={cn("rounded-full p-0.5 hover:bg-[#142744]/[0.08]", focusRing)}
              >
                <X className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={add}
          className={cn(
            "shrink-0 rounded-xl border border-[#142744]/15 px-4 text-sm font-medium text-[#142744]",
            "hover:border-[#142744]/35 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
            touch,
            focusRing,
          )}
        >
          Додати
        </button>
      </div>
    </div>
  );
}

export function ProfileWizard({
  therapist,
  documents,
  specializationOptions,
  languageOptions,
}: {
  therapist: TherapistDraft;
  documents: DocumentItem[];
  specializationOptions: { id: string; label: string }[];
  languageOptions: { code: string; label: string }[];
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormValues>(() => draftToValues(therapist));
  const [state, formAction, pending] = useActionState<ProfileState | null, FormData>(
    (_prev, fd) => updateTherapistProfileAction(_prev, fd),
    null,
  );

  const set = <K extends keyof FormValues>(key: K, val: FormValues[K]) =>
    setValues((v) => ({ ...v, [key]: val }));

  const toggleIn = (
    key: "specializationIds" | "languageCodes" | "ageGroups" | "workFormats",
    id: string,
  ) =>
    setValues((v) => ({
      ...v,
      [key]: (v[key] as string[]).includes(id)
        ? (v[key] as string[]).filter((x) => x !== id)
        : [...(v[key] as string[]), id],
    }));

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return values.fullName.trim().length >= 2 && values.city.trim().length >= 2;
      case 1:
        return true; // Позиція необов'язкова — можна лишити коротко чи порожньо
      case 2:
        return values.specializationIds.length >= 1 && values.languageCodes.length >= 1;
      case 3:
        return true; // Професійна ідентичність — усі поля необов'язкові
      case 4:
        return values.priceFrom.trim() !== "";
      default:
        return true;
    }
  }, [step, values]);

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  // Якщо сервер повернув помилки полів — переходимо на найперший крок, де вони є,
  // інакше повідомлення видно лише на кроці «Огляд», без пояснення, що саме не так.
  useEffect(() => {
    if (!fieldErrors) return;
    const steps = Object.keys(fieldErrors)
      .map((key) => FIELD_STEP[key])
      .filter((s): s is number => s !== undefined);
    if (steps.length > 0) setStep(Math.min(...steps));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  if (state?.ok) {
    return (
      <div className="mx-auto w-full max-w-[560px] py-16 text-center">
        <span
          aria-hidden
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#1C3557]/[0.08] text-[#1C3557]"
        >
          <PartyPopper className="h-7 w-7" />
        </span>
        <h1
          className={cn("mt-6 text-3xl font-normal", ink.strong)}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Анкету відправлено на перевірку
        </h1>
        <p className={cn("mt-3 text-[15px] leading-relaxed", ink.muted)}>
          Ми звіримо дані вручну — зазвичай це займає до двох робочих днів. Свій простір ви вже
          можете переглянути: він виглядає так само, як його побачать відвідувачі після публікації.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/specialists/${state.slug}`}
            className={cn(
              "inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Переглянути свій простір
          </Link>
          <Link
            href="/dashboard/articles/new"
            className={cn(
              "border-[#142744]/22 inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 text-sm font-medium text-[#142744]",
              "transition-colors hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Написати перший текст
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[720px] py-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
        Анкета фахівця
      </p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Розкажіть про свою практику
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Ці дані сформують ваш публічний простір на VSI. Писати можна своїми словами — ми нічого не
        вигадуємо і не редагуємо без вас.
      </p>

      {/* Кроки */}
      <ol className="mt-8 flex flex-wrap gap-x-1 gap-y-2 text-[13px]">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-1">
            <button
              type="button"
              disabled={i > step && !stepValid}
              onClick={() => i <= step && setStep(i)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors motion-reduce:transition-none",
                i === step
                  ? "bg-[#1C3557] text-[#FFFDF8]"
                  : i < step
                    ? "text-[#1C3557] hover:bg-[#142744]/[0.06]"
                    : cn(ink.soft, "cursor-default"),
                focusRing,
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" aria-hidden /> : null}
              {label}
            </button>
            {i < STEPS.length - 1 && <span aria-hidden className="h-px w-3 bg-[#142744]/15" />}
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8]/70 p-6 sm:p-8">
        {/* ── Крок 0: Про вас ── */}
        {step === 0 && (
          <div className="space-y-5">
            <FieldLabel>Фото профілю</FieldLabel>
            <PhotoUploader value={values.photoUrl} onChange={(url) => set("photoUrl", url)} />

            <div>
              <FieldLabel>Повне ім'я</FieldLabel>
              <input
                className={inputClass}
                value={values.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="Ім'я та прізвище"
              />
              {fieldErrors?.fullName?.[0] && (
                <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.fullName[0]}</p>
              )}
            </div>

            <div>
              <FieldLabel hint="Вкажіть вашу професійну кваліфікацію так, як вона відповідає вашій освіті та професійній підготовці. Наприклад: психолог, клінічний психолог, психотерапевт, психіатр, арт-терапевт, сімейний психотерапевт, супервізор.">
                Професійна кваліфікація
              </FieldLabel>
              <input
                className={inputClass}
                value={values.professionalTitle}
                onChange={(e) => set("professionalTitle", e.target.value)}
                placeholder="Психолог, психотерапевт, супервізор"
              />
              {fieldErrors?.professionalTitle?.[0] && (
                <p className="mt-1.5 text-[13px] text-[#8A4B33]">
                  {fieldErrors.professionalTitle[0]}
                </p>
              )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Місто</FieldLabel>
                <input
                  className={inputClass}
                  value={values.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Навіть якщо працюєте лише онлайн"
                />
                {fieldErrors?.city?.[0] && (
                  <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.city[0]}</p>
                )}
              </div>
              <div>
                <FieldLabel>Років практики</FieldLabel>
                <input
                  type="number"
                  min={0}
                  max={80}
                  className={inputClass}
                  value={values.yearsExperience}
                  onChange={(e) => set("yearsExperience", e.target.value)}
                />
              </div>
            </div>

            <div>
              <FieldLabel>Формат роботи</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(FORMAT_LABEL) as SessionFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("sessionFormat", f)}
                    aria-pressed={values.sessionFormat === f}
                    className={chipClass(values.sessionFormat === f)}
                  >
                    {FORMAT_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Крок 1: Позиція ── */}
        {step === 1 && (
          <div>
            <FieldLabel hint="Як ви розумієте терапію і психологічну роботу. Це головний текст вашого простору — пишіть від першої особи, своїми словами. Необов'язково: можна коротко або пропустити цей крок узагалі.">
              Ваша позиція
            </FieldLabel>
            <textarea
              rows={10}
              className={cn(inputClass, "h-auto py-3 leading-relaxed")}
              value={values.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Я вважаю, що…"
            />
            <div className="mt-1.5 flex items-center justify-between text-[13px]">
              <span className={ink.soft}>{values.bio.trim().length} символів</span>
            </div>
            {fieldErrors?.bio?.[0] && (
              <p className="mt-1 text-[13px] text-[#8A4B33]">{fieldErrors.bio[0]}</p>
            )}
          </div>
        )}

        {/* ── Крок 2: Підхід, напрями й мови ── */}
        {step === 2 && (
          <div className="space-y-7">
            <div>
              <FieldLabel hint="Оберіть один або кілька підходів, у межах яких ви працюєте.">
                Професійний підхід
              </FieldLabel>
              <MultiSelect
                options={THERAPY_APPROACHES.map((a) => ({ value: a, label: a }))}
                selected={values.approaches}
                onChange={(next) => setValues((v) => ({ ...v, approaches: next }))}
              />
              {values.approaches.includes(OTHER_APPROACH) && (
                <div className="mt-3">
                  <FieldLabel>Вкажіть інший підхід</FieldLabel>
                  <input
                    className={inputClass}
                    value={values.otherApproach}
                    onChange={(e) => setValues((v) => ({ ...v, otherApproach: e.target.value }))}
                    placeholder="Назва підходу"
                  />
                </div>
              )}
            </div>

            <div>
              <FieldLabel hint="Оберіть одну або кілька мов, якими ви проводите консультації.">
                Мови роботи
              </FieldLabel>
              <MultiSelect
                options={languageOptions.map((l) => ({ value: l.code, label: l.label }))}
                selected={values.languageCodes}
                onChange={(next) => setValues((v) => ({ ...v, languageCodes: next }))}
                placeholder="Оберіть одну або кілька"
              />
              {values.languageCodes.includes(OTHER_LANGUAGE_CODE) && (
                <div className="mt-3">
                  <FieldLabel>Вкажіть іншу мову</FieldLabel>
                  <input
                    className={inputClass}
                    value={values.otherLanguage}
                    onChange={(e) => setValues((v) => ({ ...v, otherLanguage: e.target.value }))}
                    placeholder="Назва мови"
                  />
                </div>
              )}
            </div>

            <div>
              <FieldLabel hint="Теми, з якими ви працюєте. Можна кілька.">
                Напрями роботи
              </FieldLabel>
              <div className="flex flex-wrap gap-2">
                {specializationOptions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleIn("specializationIds", s.id)}
                    aria-pressed={values.specializationIds.includes(s.id)}
                    className={chipClass(values.specializationIds.includes(s.id))}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Крок 3: Професійна ідентичність ── */}
        {step === 3 && (
          <div className="space-y-7">
            <div>
              <FieldLabel hint="Необов'язково. Підходи ви вже обрали на попередньому кроці — тут можна додати, як саме ви їх поєднуєте у своїй практиці. Наприклад: «аналітична психологія К. Г. Юнга у поєднанні з арт-терапією».">
                Опис підходу своїми словами
              </FieldLabel>
              <input
                className={inputClass}
                value={values.analyticalOrientation}
                onChange={(e) => set("analyticalOrientation", e.target.value)}
                placeholder="Аналітична психологія К. Г. Юнга"
              />
            </div>

            <div>
              <FieldLabel hint="З ким працюєте.">Вікові групи</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(AGE_GROUP_LABEL) as AgeGroup[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleIn("ageGroups", g)}
                    aria-pressed={values.ageGroups.includes(g)}
                    className={chipClass(values.ageGroups.includes(g))}
                  >
                    {AGE_GROUP_LABEL[g]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel hint="У якому форматі відбувається робота.">Формати роботи</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(WORK_FORMAT_LABEL) as TherapistWorkFormat[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleIn("workFormats", f)}
                    aria-pressed={values.workFormats.includes(f)}
                    className={chipClass(values.workFormats.includes(f))}
                  >
                    {WORK_FORMAT_LABEL[f]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <FieldLabel hint="Теми, які вас професійно цікавлять — не обов'язково клієнтські запити.">
                Професійні інтереси
              </FieldLabel>
              <TagInput
                value={values.professionalInterests}
                onChange={(next) => set("professionalInterests", next)}
                placeholder="Наприклад: сновидіння"
              />
            </div>

            <div>
              <FieldLabel hint="Професійні спільноти й членства.">Асоціації</FieldLabel>
              <TagInput
                value={values.associations}
                onChange={(next) => set("associations", next)}
                placeholder="Наприклад: УСП"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel hint="Необов'язково.">Супервізія</FieldLabel>
                <input
                  className={inputClass}
                  value={values.supervisionStatus}
                  onChange={(e) => set("supervisionStatus", e.target.value)}
                  placeholder="Регулярна супервізія з 2022"
                />
              </div>
              <div>
                <FieldLabel hint="Необов'язково.">Особиста терапія / аналіз</FieldLabel>
                <input
                  className={inputClass}
                  value={values.personalTherapyStatus}
                  onChange={(e) => set("personalTherapyStatus", e.target.value)}
                  placeholder="У особистому аналізі"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Крок 4: Формат і контакти ── */}
        {step === 4 && (
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Вартість від, грн</FieldLabel>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={values.priceFrom}
                  onChange={(e) => set("priceFrom", e.target.value)}
                />
                {fieldErrors?.priceFrom?.[0] && (
                  <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.priceFrom[0]}</p>
                )}
              </div>
              <div>
                <FieldLabel>Вартість до, грн (необов'язково)</FieldLabel>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={values.priceTo}
                  onChange={(e) => set("priceTo", e.target.value)}
                />
              </div>
            </div>
            <div>
              <FieldLabel hint="Наприклад: Пн–Пт, 10:00–19:00">Графік (необов'язково)</FieldLabel>
              <input
                className={inputClass}
                value={values.workingHours}
                onChange={(e) => set("workingHours", e.target.value)}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel>Контактний email (необов'язково)</FieldLabel>
                <input
                  type="email"
                  className={inputClass}
                  value={values.contactEmail}
                  onChange={(e) => set("contactEmail", e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Телефон (необов'язково)</FieldLabel>
                <input
                  className={inputClass}
                  value={values.contactPhone}
                  onChange={(e) => set("contactPhone", e.target.value)}
                  placeholder="+380…"
                />
              </div>
              <div>
                <FieldLabel>WhatsApp (необов'язково)</FieldLabel>
                <input
                  className={inputClass}
                  value={values.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder="+380…"
                />
              </div>
              <div>
                <FieldLabel>Telegram (необов'язково)</FieldLabel>
                <input
                  className={inputClass}
                  value={values.telegram}
                  onChange={(e) => set("telegram", e.target.value)}
                  placeholder="@nickname або +380…"
                />
              </div>
            </div>
            <div>
              <FieldLabel hint="Особистий сайт, якщо є.">Сайт (необов'язково)</FieldLabel>
              <input
                type="url"
                className={inputClass}
                value={values.website}
                onChange={(e) => set("website", e.target.value)}
                placeholder="https://…"
              />
              {fieldErrors?.website?.[0] && (
                <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.website[0]}</p>
              )}
            </div>
            <div>
              <FieldLabel hint="LinkedIn, Instagram тощо — по одному посиланню.">
                Соціальні мережі (необов'язково)
              </FieldLabel>
              <TagInput
                value={values.socialLinks}
                onChange={(next) => set("socialLinks", next)}
                placeholder="https://…"
              />
            </div>
          </div>
        )}

        {/* ── Крок 5: Дипломи ── */}
        {step === 5 && (
          <div>
            <FieldLabel hint="Завантажте скани — ми перевіримо їх вручну перед публікацією профілю.">
              Дипломи та сертифікати
            </FieldLabel>
            <div className="mt-3">
              <DiplomaUploader initialDocuments={documents} />
            </div>
          </div>
        )}

        {/* ── Крок 6: Огляд ── */}
        {step === 6 && (
          <div className="space-y-5">
            <h2 className={cn("text-xl font-medium", ink.strong)}>Перевірте перед відправленням</h2>
            <dl className={cn("space-y-2.5 text-[15px]", ink.body)}>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Ім'я</dt>
                <dd className="text-right">{values.fullName || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Кваліфікація</dt>
                <dd className="max-w-[60%] text-right">{values.professionalTitle || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Опис підходу</dt>
                <dd className="max-w-[60%] text-right">{values.analyticalOrientation || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Місто</dt>
                <dd>{values.city || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Формат</dt>
                <dd>{FORMAT_LABEL[values.sessionFormat]}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Підхід</dt>
                <dd className="max-w-[60%] text-right">
                  {values.approaches.length
                    ? values.approaches
                        .map((a) =>
                          a === OTHER_APPROACH && values.otherApproach ? values.otherApproach : a,
                        )
                        .join(", ")
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Напрями</dt>
                <dd className="max-w-[60%] text-right">
                  {values.specializationIds.length
                    ? specializationOptions
                        .filter((s) => values.specializationIds.includes(s.id))
                        .map((s) => s.label)
                        .join(", ")
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-[#142744]/[0.07] pb-2.5">
                <dt className={ink.soft}>Мови</dt>
                <dd className="max-w-[60%] text-right">
                  {values.languageCodes.length
                    ? languageOptions
                        .filter((l) => values.languageCodes.includes(l.code))
                        .map((l) =>
                          l.code === OTHER_LANGUAGE_CODE && values.otherLanguage
                            ? values.otherLanguage
                            : l.label,
                        )
                        .join(", ")
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4 pb-1">
                <dt className={ink.soft}>Вартість</dt>
                <dd>від {values.priceFrom || "—"} грн</dd>
              </div>
            </dl>

            {state?.ok === false && (
              <p className="rounded-lg border border-[#8A4B33]/25 bg-[#8A4B33]/[0.06] px-4 py-3 text-[14px] text-[#8A4B33]">
                {state.error}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Навігація кроками */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className={cn(
            "inline-flex min-h-[46px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[#142744] disabled:opacity-0",
            "hover:bg-[#142744]/[0.05] motion-reduce:transition-none",
            focusRing,
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Назад
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => stepValid && setStep((s) => s + 1)}
            disabled={!stepValid}
            className={cn(
              "inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none",
              focusRing,
            )}
          >
            Далі
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => formAction(buildFormData(values)))}
            className={cn(
              "inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "transition-colors hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
              focusRing,
            )}
          >
            {pending ? "Надсилаємо…" : "Завершити анкету"}
          </button>
        )}
      </div>
    </div>
  );
}
