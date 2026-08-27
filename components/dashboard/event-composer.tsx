"use client";

import { useActionState, useState } from "react";
import { Check, Image as ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { createEventAction, type EventState } from "@/lib/actions/events";
import { EVENT_TYPES } from "@/lib/schemas/event";
import { PhotoUploader } from "@/components/dashboard/photo-uploader";
import { focusRing, ink, touch } from "@/components/preview/vsi/theme";

const EVENT_TYPE_LABEL: Record<(typeof EVENT_TYPES)[number], string> = {
  LECTURE: "Лекція",
  SEMINAR: "Семінар",
  CONFERENCE: "Конференція",
  SUPERVISION_GROUP: "Супервізійна група",
  INTERVISION_GROUP: "Інтервізійна група",
  READING_GROUP: "Читацька група",
  TRAINING_PROGRAM: "Навчальна програма",
  WORKSHOP: "Воркшоп",
};

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

export function EventComposer() {
  const [state, formAction, pending] = useActionState<EventState | null, FormData>(
    (prev, fd) => createEventAction(prev, fd),
    null,
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  if (state?.ok) {
    return (
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#2F6B4F]/25 bg-[#2F6B4F]/[0.06] p-6">
        <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#245A41]" aria-hidden />
        <p className="text-[15px] leading-relaxed text-[#245A41]">
          Подію опубліковано — вона вже видна на{" "}
          <a href="/events" className="underline">
            сторінці подій
          </a>
          .
        </p>
      </div>
    );
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-2xl border border-[#142744]/10 bg-[#FFFDF8] p-6"
    >
      <div>
        <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Назва</label>
        <input
          name="title"
          required
          className={inputClass}
          placeholder="Вступ до аналітичної психології"
        />
        {fieldErrors?.title?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.title[0]}</p>
        )}
      </div>

      <div>
        <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Опис</label>
        <textarea
          name="description"
          required
          rows={3}
          className={cn(inputClass, "h-auto py-3 leading-relaxed")}
          placeholder="Кому підійде і чого очікувати"
        />
        {fieldErrors?.description?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.description[0]}</p>
        )}
      </div>

      <div>
        <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
          Зображення <span className={ink.soft}>(необов'язково)</span>
        </label>
        <PhotoUploader
          value={imageUrl}
          onChange={setImageUrl}
          endpoint="eventImage"
          label="зображення"
          icon={ImageIcon}
          previewClassName="h-20 w-32 rounded-xl"
          sizes="128px"
        />
        <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />
        {fieldErrors?.imageUrl?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.imageUrl[0]}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Тип</label>
          <select name="type" defaultValue="SEMINAR" className={inputClass}>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Формат</label>
          <select name="format" defaultValue="ONLINE" className={inputClass}>
            <option value="ONLINE">Онлайн</option>
            <option value="OFFLINE">Очно</option>
            <option value="BOTH">Онлайн і очно</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Дата й час</label>
          <input name="startsAt" type="datetime-local" required className={inputClass} />
          {fieldErrors?.startsAt?.[0] && (
            <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.startsAt[0]}</p>
          )}
        </div>
        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Місць <span className={ink.soft}>(необов'язково)</span>
          </label>
          <input
            name="seatsTotal"
            type="number"
            min={1}
            className={inputClass}
            placeholder="Без обмеження"
          />
        </div>
      </div>

      <div>
        <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
          Хто побачить подію
        </label>
        <select name="audience" defaultValue="PUBLIC" className={inputClass}>
          <option value="PUBLIC">Усі — і клієнти, і фахівці</option>
          <option value="PROFESSIONALS">Лише фахівці VSI</option>
        </select>
      </div>

      <div>
        <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
          Вартість, грн <span className={ink.soft}>(необов'язково)</span>
        </label>
        <input
          name="price"
          type="number"
          min={0}
          className={inputClass}
          placeholder="Залиште порожнім, якщо безкоштовно"
        />
        {fieldErrors?.price?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.price[0]}</p>
        )}
      </div>

      <div>
        <p className={cn("mb-1.5 text-sm font-medium", ink.strong)}>
          Контакт для питань про подію <span className={ink.soft}>(необов'язково)</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <input name="contactName" className={inputClass} placeholder="Ім'я" />
          <input name="contactEmail" type="email" className={inputClass} placeholder="Email" />
          <input name="contactPhone" className={inputClass} placeholder="Телефон" />
        </div>
        {fieldErrors?.contactEmail?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.contactEmail[0]}</p>
        )}
        {fieldErrors?.contactPhone?.[0] && (
          <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.contactPhone[0]}</p>
        )}
      </div>

      <input type="hidden" name="language" value="uk" />

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
        {pending ? "Публікуємо…" : "Опублікувати подію"}
      </button>
    </form>
  );
}
