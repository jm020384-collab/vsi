"use client";

import { useState, useTransition } from "react";
import { FileText, GraduationCap, Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";
import {
  addVerificationDocumentAction,
  removeVerificationDocumentAction,
} from "@/lib/actions/documents";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export type EducationType =
  | "DIPLOMA"
  | "CERTIFICATE"
  | "COURSE"
  | "MASTERCLASS"
  | "CONFERENCE"
  | "ID"
  | "OTHER";

export interface EducationItem {
  id: string;
  fileName: string | null;
  docType: EducationType;
  status: "PENDING" | "VERIFIED" | "NEEDS_UPDATE";
  reviewNote?: string | null;
  institution: string | null;
  specialization: string | null;
  yearFrom: number | null;
  yearTo: number | null;
  inProgress: boolean;
}

const TYPE_LABEL: Record<EducationType, string> = {
  DIPLOMA: "Вища освіта (диплом)",
  CERTIFICATE: "Програма перепідготовки / сертифікат",
  COURSE: "Курс, навчальна програма",
  MASTERCLASS: "Майстер-клас, воркшоп",
  CONFERENCE: "Конференція, семінар",
  ID: "Документ, що посвідчує особу",
  OTHER: "Інше",
};

const STATUS_LABEL: Record<EducationItem["status"], string> = {
  PENDING: "На розгляді",
  VERIFIED: "Верифіковано",
  NEEDS_UPDATE: "Потрібне оновлення",
};

const STATUS_COLOR: Record<EducationItem["status"], string> = {
  PENDING: "text-[#876428]",
  VERIFIED: "text-[#245A41]",
  NEEDS_UPDATE: "text-[#8A4B33]",
};

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

/** Роки навчання одним рядком: «2014–2019», «з 2023», «2021». */
function periodLabel(d: EducationItem) {
  if (d.inProgress) return d.yearFrom ? `з ${d.yearFrom}, триває` : "триває";
  if (d.yearFrom && d.yearTo)
    return d.yearFrom === d.yearTo ? `${d.yearFrom}` : `${d.yearFrom}–${d.yearTo}`;
  return d.yearTo ? `${d.yearTo}` : d.yearFrom ? `з ${d.yearFrom}` : "";
}

/**
 * Освіта фахівця: вища освіта, перепідготовка, курси, майстер-класи,
 * конференції — одним списком із типом у кожному записі.
 *
 * Скан НЕ обовʼязковий: навчання можна просто описати або позначити
 * як таке, що триває. Файл, коли він є, лишається приватним — публічно
 * показуємо тільки заклад, спеціальність і роки.
 */
export function EducationEditor({ initialItems }: { initialItems: EducationItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [docType, setDocType] = useState<EducationType>("DIPLOMA");
  const [institution, setInstitution] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [inProgress, setInProgress] = useState(false);
  const [file, setFile] = useState<{ url: string; name: string; key: string } | null>(null);

  const { startUpload, isUploading } = useUploadThing("diplomaDocument", {
    onClientUploadComplete: (res) => {
      const f = res?.[0];
      if (f) setFile({ url: f.ufsUrl, name: f.name, key: f.key });
    },
    onUploadError: (error) => {
      toast.error(error.message || "Не вдалося завантажити файл");
    },
  });

  const resetForm = () => {
    setDocType("DIPLOMA");
    setInstitution("");
    setSpecialization("");
    setYearFrom("");
    setYearTo("");
    setInProgress(false);
    setFile(null);
  };

  const save = () => {
    startTransition(async () => {
      const result = await addVerificationDocumentAction({
        docType,
        institution: institution.trim() || null,
        specialization: specialization.trim() || null,
        yearFrom: yearFrom ? Number(yearFrom) : null,
        yearTo: inProgress ? null : yearTo ? Number(yearTo) : null,
        inProgress,
        fileUrl: file?.url ?? null,
        fileName: file?.name ?? null,
        fileKey: file?.key ?? null,
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setItems((prev) => [
        ...prev,
        {
          id: result.id,
          fileName: file?.name ?? null,
          docType,
          status: "PENDING",
          institution: institution.trim() || null,
          specialization: specialization.trim() || null,
          yearFrom: yearFrom ? Number(yearFrom) : null,
          yearTo: inProgress ? null : yearTo ? Number(yearTo) : null,
          inProgress,
        },
      ]);
      resetForm();
      setOpen(false);
      toast.success("Запис додано");
    });
  };

  const remove = (id: string) => {
    const snapshot = items;
    setItems((prev) => prev.filter((d) => d.id !== id));
    startTransition(async () => {
      const result = await removeVerificationDocumentAction(id);
      if (!result.ok) {
        toast.error(result.error);
        setItems(snapshot);
      }
    });
  };

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-4 space-y-2.5">
          {items.map((d) => {
            const period = periodLabel(d);
            const title = d.institution || d.fileName || TYPE_LABEL[d.docType];
            return (
              <li
                key={d.id}
                className="flex items-start gap-3.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5"
              >
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F8F4EC] text-[#876428]"
                >
                  {d.fileName ? (
                    <FileText className="h-5 w-5" />
                  ) : (
                    <GraduationCap className="h-5 w-5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-[14px] font-medium", ink.strong)}>{title}</span>
                  {d.specialization && (
                    <span className={cn("mt-0.5 block text-[13px]", ink.body)}>
                      {d.specialization}
                    </span>
                  )}
                  <span
                    className={cn("mt-1 flex flex-wrap items-center gap-2 text-[12px]", ink.soft)}
                  >
                    {TYPE_LABEL[d.docType]}
                    {period && (
                      <>
                        <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                        {period}
                      </>
                    )}
                    {d.fileName && (
                      <>
                        <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                        <span className={STATUS_COLOR[d.status]}>{STATUS_LABEL[d.status]}</span>
                      </>
                    )}
                  </span>
                  {d.status === "NEEDS_UPDATE" && d.reviewNote && (
                    <span className={cn("mt-1 block text-[12px] italic", ink.soft)}>
                      {d.reviewNote}
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => remove(d.id)}
                  disabled={pending}
                  aria-label={`Видалити запис «${title}»`}
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06] hover:text-[#8A4B33]",
                    focusRing,
                  )}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dashed border-[#142744]/25 px-4 text-sm font-medium text-[#142744]",
            "transition-colors hover:border-[#142744]/45 hover:bg-[#FFFDF8]/60 motion-reduce:transition-none",
            focusRing,
          )}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Додати освіту
        </button>
      ) : (
        <div className="rounded-xl border border-[#142744]/15 bg-[#FFFDF8]/60 p-4 sm:p-5">
          <div className="space-y-4">
            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Тип</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as EducationType)}
                className={inputClass}
              >
                {(Object.keys(TYPE_LABEL) as EducationType[])
                  .filter((t) => t !== "ID")
                  .map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABEL[t]}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
                Заклад освіти / організатор
              </label>
              <input
                className={inputClass}
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Напр.: КНУ ім. Шевченка"
              />
            </div>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
                Спеціальність / тема
              </label>
              <input
                className={inputClass}
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Напр.: психологія, юнгіанський аналіз"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
                  Рік початку
                </label>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={yearFrom}
                  onChange={(e) => setYearFrom(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="2014"
                />
              </div>
              <div>
                <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
                  Рік завершення
                </label>
                <input
                  className={cn(inputClass, inProgress && "opacity-50")}
                  inputMode="numeric"
                  value={inProgress ? "" : yearTo}
                  onChange={(e) => setYearTo(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="2019"
                  disabled={inProgress}
                />
              </div>
            </div>

            <label className="flex items-center gap-2.5 text-[14px] text-[#4A5568]">
              <input
                type="checkbox"
                checked={inProgress}
                onChange={(e) => setInProgress(e.target.checked)}
                className="h-4 w-4 accent-[#1C3557]"
              />
              Навчання триває
            </label>

            <div>
              <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
                Скан документа{" "}
                <span className={ink.soft}>(необов&apos;язково, не публікується)</span>
              </label>
              {file ? (
                <div className="flex items-center gap-2.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] px-3.5 py-2.5">
                  <FileText className="h-4 w-4 shrink-0 text-[#876428]" aria-hidden />
                  <span className={cn("min-w-0 flex-1 truncate text-[13px]", ink.body)}>
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    aria-label="Прибрати файл"
                    className={cn(
                      "grid h-7 w-7 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06]",
                      focusRing,
                    )}
                  >
                    <X className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              ) : (
                <label
                  className={cn(
                    "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#142744]/25 px-4 text-sm font-medium text-[#142744]",
                    "transition-colors hover:border-[#142744]/45 hover:bg-[#FFFDF8]/60 motion-reduce:transition-none",
                    focusRing,
                  )}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <UploadCloud className="h-4 w-4" aria-hidden />
                  )}
                  {isUploading ? "Завантажуємо…" : "Прикріпити файл"}
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length) void startUpload(files);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={save}
                disabled={pending || isUploading}
                className={cn(
                  "inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1C3557] px-5 text-sm font-medium text-[#FFFDF8]",
                  "hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
                  focusRing,
                )}
              >
                {pending ? "Зберігаємо…" : "Зберегти запис"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className={cn(
                  "border-[#142744]/22 inline-flex min-h-[44px] items-center justify-center rounded-xl border px-5 text-sm font-medium text-[#142744]",
                  "hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
                  focusRing,
                )}
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
