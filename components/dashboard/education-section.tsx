"use client";

import { useMemo, useState, useTransition } from "react";
import {
  FileText,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";
import {
  saveEducationEntryAction,
  deleteEducationEntryAction,
  attachEducationDocumentAction,
  deleteEducationDocumentAction,
} from "@/lib/actions/education";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export type EducationKind =
  | "EDUCATION"
  | "SPECIALIZATION"
  | "TRAINING"
  | "SHORT_PROGRAM"
  | "CONFERENCE";

export type DegreeLevel = "BACHELOR" | "MASTER" | "SPECIALIST" | "PHD" | "OTHER";
export type ConferenceRole = "PARTICIPANT" | "SPEAKER" | "MODERATOR" | "ORGANIZER";

export interface EducationDocument {
  id: string;
  fileName: string | null;
  status: "PENDING" | "VERIFIED" | "NEEDS_UPDATE";
  reviewNote?: string | null;
}

export interface EducationEntryItem {
  id: string;
  kind: EducationKind;
  title: string | null;
  institution: string | null;
  faculty: string | null;
  specialization: string | null;
  degree: DegreeLevel | null;
  country: string | null;
  trainer: string | null;
  programType: string | null;
  duration: string | null;
  startYear: number | null;
  endYear: number | null;
  ongoing: boolean;
  expectedEndYear: number | null;
  eventDate: string | null;
  role: ConferenceRole | null;
  presentationTitle: string | null;
  link: string | null;
  description: string | null;
  documents: EducationDocument[];
}

const SECTIONS: { kind: EducationKind; title: string; hint: string; addLabel: string }[] = [
  {
    kind: "EDUCATION",
    title: "Базова освіта",
    hint: "Університет, факультет, спеціальність і освітній рівень.",
    addLabel: "Додати освіту",
  },
  {
    kind: "SPECIALIZATION",
    title: "Професійна спеціалізація",
    hint: "Юнгіанська психотерапія, арт-терапія, робота з травмою тощо.",
    addLabel: "Додати спеціалізацію",
  },
  {
    kind: "TRAINING",
    title: "Додаткові навчальні програми",
    hint: "Довготривалі програми, курси, супервізійні та інтервізійні групи.",
    addLabel: "Додати навчальну програму",
  },
  {
    kind: "SHORT_PROGRAM",
    title: "Майстер-класи та семінари",
    hint: "Короткі формати навчання.",
    addLabel: "Додати майстер-клас / семінар",
  },
  {
    kind: "CONFERENCE",
    title: "Конференції та професійні події",
    hint: "Участь, доповіді, модерація, організація.",
    addLabel: "Додати конференцію",
  },
];

const DEGREE_LABEL: Record<DegreeLevel, string> = {
  BACHELOR: "Бакалавр",
  MASTER: "Магістр",
  SPECIALIST: "Спеціаліст",
  PHD: "Доктор філософії / PhD",
  OTHER: "Інше",
};

const ROLE_LABEL: Record<ConferenceRole, string> = {
  PARTICIPANT: "Учасник",
  SPEAKER: "Доповідач",
  MODERATOR: "Модератор",
  ORGANIZER: "Організатор",
};

const PROGRAM_TYPES = [
  "Довготривала навчальна програма",
  "Курс",
  "Спеціалізація",
  "Сертифікаційна програма",
  "Супервізійна програма",
  "Інтервізійна програма",
  "Інше",
];

const DOC_STATUS_LABEL: Record<EducationDocument["status"], string> = {
  PENDING: "На перевірці",
  VERIFIED: "Перевірено VSI",
  NEEDS_UPDATE: "Потрібне уточнення",
};

const DOC_STATUS_COLOR: Record<EducationDocument["status"], string> = {
  PENDING: "text-[#876428]",
  VERIFIED: "text-[#245A41]",
  NEEDS_UPDATE: "text-[#8A4B33]",
};

const inputClass = cn(
  "h-11 w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

const btnPrimary = cn(
  "inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#1C3557] px-5 text-sm font-medium text-[#FFFDF8]",
  "hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
  focusRing,
);

const btnGhost = cn(
  "inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[#142744]/22 px-5 text-sm font-medium text-[#142744]",
  "hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
  focusRing,
);

/** Роки одним рядком: «2018–2022», «Навчається з 2025», «2023». */
function periodLabel(e: EducationEntryItem) {
  if (e.ongoing) {
    if (e.startYear) return `Навчається з ${e.startYear}`;
    return e.expectedEndYear ? `У процесі, до ${e.expectedEndYear}` : "У процесі навчання";
  }
  if (e.startYear && e.endYear) {
    return e.startYear === e.endYear ? `${e.startYear}` : `${e.startYear}–${e.endYear}`;
  }
  return e.eventDate ?? (e.endYear ? `${e.endYear}` : e.startYear ? `з ${e.startYear}` : "");
}

function entryTitle(e: EducationEntryItem) {
  return e.title || e.institution || "Без назви";
}

type FormState = Omit<EducationEntryItem, "id" | "documents"> & { id?: string };

function emptyForm(kind: EducationKind): FormState {
  return {
    kind,
    title: null,
    institution: null,
    faculty: null,
    specialization: null,
    degree: null,
    country: null,
    trainer: null,
    programType: null,
    duration: null,
    startYear: null,
    endYear: null,
    ongoing: false,
    expectedEndYear: null,
    eventDate: null,
    role: null,
    presentationTitle: null,
    link: null,
    description: null,
  };
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>{label}</label>
      {hint && <p className={cn("mb-1.5 text-[13px]", ink.soft)}>{hint}</p>}
      {children}
    </div>
  );
}

/**
 * «Освіта та професійна підготовка» — п'ять секцій однієї траєкторії.
 *
 * Форма показується лише під час додавання/редагування (progressive
 * disclosure): інакше п'ять розгорнутих форм перетворили б крок анкети
 * на адмінську таблицю. Документ ніде не обовʼязковий — навчання можна
 * просто описати або позначити як таке, що триває.
 */
export function EducationSection({ initialEntries }: { initialEntries: EducationEntryItem[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [form, setForm] = useState<FormState | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const byKind = useMemo(() => {
    const map = new Map<EducationKind, EducationEntryItem[]>();
    for (const s of SECTIONS) map.set(s.kind, []);
    for (const e of entries) map.get(e.kind)?.push(e);
    return map;
  }, [entries]);

  const { startUpload } = useUploadThing("diplomaDocument", {
    onClientUploadComplete: (res) => {
      const f = res?.[0];
      const entryId = uploadingFor;
      setUploadingFor(null);
      if (!f || !entryId) return;
      startTransition(async () => {
        const result = await attachEducationDocumentAction({
          entryId,
          fileUrl: f.ufsUrl,
          fileName: f.name,
          fileKey: f.key,
        });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        setEntries((prev) =>
          prev.map((e) =>
            e.id === entryId
              ? {
                  ...e,
                  documents: [
                    ...e.documents,
                    { id: result.id, fileName: f.name, status: "PENDING" as const },
                  ],
                }
              : e,
          ),
        );
        toast.success("Документ додано");
      });
    },
    onUploadError: (error) => {
      setUploadingFor(null);
      toast.error(error.message || "Не вдалося завантажити файл");
    },
  });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const save = () => {
    if (!form) return;
    startTransition(async () => {
      const result = await saveEducationEntryAction(form);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      const saved: EducationEntryItem = {
        ...form,
        id: result.id,
        documents: entries.find((e) => e.id === form.id)?.documents ?? [],
      };
      setEntries((prev) =>
        form.id ? prev.map((e) => (e.id === form.id ? saved : e)) : [...prev, saved],
      );
      setForm(null);
      toast.success(form.id ? "Запис оновлено" : "Запис додано");
    });
  };

  const removeEntry = (id: string) => {
    const snapshot = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    startTransition(async () => {
      const result = await deleteEducationEntryAction(id);
      if (!result.ok) {
        toast.error(result.error);
        setEntries(snapshot);
      }
    });
  };

  const removeDoc = (entryId: string, docId: string) => {
    const snapshot = entries;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entryId ? { ...e, documents: e.documents.filter((d) => d.id !== docId) } : e,
      ),
    );
    startTransition(async () => {
      const result = await deleteEducationDocumentAction(docId);
      if (!result.ok) {
        toast.error(result.error);
        setEntries(snapshot);
      }
    });
  };

  const isEducation = form?.kind === "EDUCATION";
  const isConference = form?.kind === "CONFERENCE";
  const isShort = form?.kind === "SHORT_PROGRAM";
  const isTraining = form?.kind === "TRAINING";
  const isSpecialization = form?.kind === "SPECIALIZATION";

  return (
    <div className="space-y-9">
      {SECTIONS.map((section) => {
        const items = byKind.get(section.kind) ?? [];
        const formOpenHere = form && form.kind === section.kind;
        return (
          <section key={section.kind}>
            <h3 className={cn("text-[15px] font-medium", ink.strong)}>{section.title}</h3>
            <p className={cn("mt-1 text-[13px]", ink.soft)}>{section.hint}</p>

            {items.length > 0 && (
              <ul className="mt-3 space-y-2.5">
                {items.map((e) => {
                  const period = periodLabel(e);
                  return (
                    <li
                      key={e.id}
                      className="rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5"
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          aria-hidden
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F8F4EC] text-[#876428]"
                        >
                          <GraduationCap className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-[14px] font-medium", ink.strong)}>
                            {entryTitle(e)}
                          </p>
                          {(e.specialization || e.degree) && (
                            <p className={cn("mt-0.5 text-[13px]", ink.body)}>
                              {[e.degree ? DEGREE_LABEL[e.degree] : null, e.specialization]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                          <p
                            className={cn(
                              "mt-1 flex flex-wrap items-center gap-2 text-[12px]",
                              ink.soft,
                            )}
                          >
                            {e.institution && e.title ? e.institution : null}
                            {e.institution && e.title && period ? (
                              <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                            ) : null}
                            {period}
                            {e.role && (
                              <>
                                <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                                {ROLE_LABEL[e.role]}
                              </>
                            )}
                          </p>

                          {e.documents.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {e.documents.map((d) => (
                                <li
                                  key={d.id}
                                  className="flex items-center gap-2 text-[12px] text-[#4A5568]"
                                >
                                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                  <span className="min-w-0 flex-1 truncate">{d.fileName}</span>
                                  <span className={DOC_STATUS_COLOR[d.status]}>
                                    {DOC_STATUS_LABEL[d.status]}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeDoc(e.id, d.id)}
                                    aria-label="Видалити документ"
                                    className={cn(
                                      "grid h-6 w-6 place-items-center rounded text-[#5C6672] hover:bg-[#142744]/[0.06]",
                                      focusRing,
                                    )}
                                  >
                                    <X className="h-3 w-3" aria-hidden />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <label
                              className={cn(
                                "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[#142744]/25 px-2.5 py-1 text-[12px] text-[#142744]",
                                "hover:border-[#142744]/45",
                                focusRing,
                              )}
                            >
                              {uploadingFor === e.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                              ) : (
                                <UploadCloud className="h-3 w-3" aria-hidden />
                              )}
                              Додати документ
                              <input
                                type="file"
                                accept="image/*,.pdf"
                                className="sr-only"
                                onChange={(ev) => {
                                  const files = Array.from(ev.target.files ?? []);
                                  if (files.length) {
                                    setUploadingFor(e.id);
                                    void startUpload(files);
                                  }
                                  ev.target.value = "";
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => setForm({ ...e })}
                            aria-label={`Редагувати «${entryTitle(e)}»`}
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06] hover:text-[#142744]",
                              focusRing,
                            )}
                          >
                            <Pencil className="h-4 w-4" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeEntry(e.id)}
                            disabled={pending}
                            aria-label={`Видалити «${entryTitle(e)}»`}
                            className={cn(
                              "grid h-9 w-9 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06] hover:text-[#8A4B33]",
                              focusRing,
                            )}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {!formOpenHere && (
              <button
                type="button"
                onClick={() => setForm(emptyForm(section.kind))}
                className={cn(
                  "mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-dashed border-[#142744]/25 px-3.5 text-[13px] font-medium text-[#142744]",
                  "hover:border-[#142744]/45 hover:bg-[#FFFDF8]/60",
                  focusRing,
                )}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                {section.addLabel}
              </button>
            )}

            {formOpenHere && form && (
              <div className="mt-3 space-y-4 rounded-xl border border-[#142744]/15 bg-[#FFFDF8]/60 p-4 sm:p-5">
                {!isEducation && (
                  <Field label={isConference ? "Назва конференції" : "Назва"}>
                    <input
                      className={inputClass}
                      value={form.title ?? ""}
                      onChange={(ev) => set("title", ev.target.value || null)}
                      placeholder={
                        isSpecialization ? "Напр.: Юнгіанська психотерапія" : "Назва програми"
                      }
                    />
                  </Field>
                )}

                <Field
                  label={
                    isEducation
                      ? "Заклад освіти"
                      : isConference || isShort
                        ? "Організатор"
                        : "Організація / інститут"
                  }
                >
                  <input
                    className={inputClass}
                    value={form.institution ?? ""}
                    onChange={(ev) => set("institution", ev.target.value || null)}
                    placeholder="Напр.: КНУ імені Тараса Шевченка"
                  />
                </Field>

                {isEducation && (
                  <>
                    <Field label="Факультет / кафедра">
                      <input
                        className={inputClass}
                        value={form.faculty ?? ""}
                        onChange={(ev) => set("faculty", ev.target.value || null)}
                      />
                    </Field>
                    <Field label="Спеціальність">
                      <input
                        className={inputClass}
                        value={form.specialization ?? ""}
                        onChange={(ev) => set("specialization", ev.target.value || null)}
                        placeholder="Напр.: психологія"
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Освітній рівень">
                        <select
                          className={inputClass}
                          value={form.degree ?? ""}
                          onChange={(ev) =>
                            set("degree", (ev.target.value || null) as DegreeLevel | null)
                          }
                        >
                          <option value="">Не вказано</option>
                          {(Object.keys(DEGREE_LABEL) as DegreeLevel[]).map((d) => (
                            <option key={d} value={d}>
                              {DEGREE_LABEL[d]}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Країна">
                        <input
                          className={inputClass}
                          value={form.country ?? ""}
                          onChange={(ev) => set("country", ev.target.value || null)}
                          placeholder="Україна"
                        />
                      </Field>
                    </div>
                  </>
                )}

                {isTraining && (
                  <Field label="Тип програми">
                    <select
                      className={inputClass}
                      value={form.programType ?? ""}
                      onChange={(ev) => set("programType", ev.target.value || null)}
                    >
                      <option value="">Не вказано</option>
                      {PROGRAM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                {(isShort || isTraining) && (
                  <Field label={isShort ? "Спікер / тренер" : "Викладач / тренер"}>
                    <input
                      className={inputClass}
                      value={form.trainer ?? ""}
                      onChange={(ev) => set("trainer", ev.target.value || null)}
                    />
                  </Field>
                )}

                {isConference && (
                  <>
                    <Field label="Роль">
                      <select
                        className={inputClass}
                        value={form.role ?? ""}
                        onChange={(ev) =>
                          set("role", (ev.target.value || null) as ConferenceRole | null)
                        }
                      >
                        <option value="">Не вказано</option>
                        {(Object.keys(ROLE_LABEL) as ConferenceRole[]).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Назва доповіді (необов'язково)">
                      <input
                        className={inputClass}
                        value={form.presentationTitle ?? ""}
                        onChange={(ev) => set("presentationTitle", ev.target.value || null)}
                      />
                    </Field>
                    <Field label="Посилання (необов'язково)">
                      <input
                        className={inputClass}
                        value={form.link ?? ""}
                        onChange={(ev) => set("link", ev.target.value || null)}
                        placeholder="https://…"
                      />
                    </Field>
                  </>
                )}

                {isShort ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Дата">
                      <input
                        className={inputClass}
                        value={form.eventDate ?? ""}
                        onChange={(ev) => set("eventDate", ev.target.value || null)}
                        placeholder="Напр.: березень 2025"
                      />
                    </Field>
                    <Field label="Тривалість">
                      <input
                        className={inputClass}
                        value={form.duration ?? ""}
                        onChange={(ev) => set("duration", ev.target.value || null)}
                        placeholder="Напр.: 16 годин"
                      />
                    </Field>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Рік початку">
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          value={form.startYear ?? ""}
                          onChange={(ev) =>
                            set(
                              "startYear",
                              ev.target.value
                                ? Number(ev.target.value.replace(/\D/g, "").slice(0, 4))
                                : null,
                            )
                          }
                          placeholder="2018"
                        />
                      </Field>
                      <Field label={form.ongoing ? "Очікуваний рік завершення" : "Рік завершення"}>
                        <input
                          className={inputClass}
                          inputMode="numeric"
                          value={(form.ongoing ? form.expectedEndYear : form.endYear) ?? ""}
                          onChange={(ev) => {
                            const n = ev.target.value
                              ? Number(ev.target.value.replace(/\D/g, "").slice(0, 4))
                              : null;
                            set(form.ongoing ? "expectedEndYear" : "endYear", n);
                          }}
                          placeholder="2022"
                        />
                      </Field>
                    </div>

                    {!isEducation && (
                      <Field label="Тривалість (необов'язково)">
                        <input
                          className={inputClass}
                          value={form.duration ?? ""}
                          onChange={(ev) => set("duration", ev.target.value || null)}
                          placeholder="Напр.: 2 роки, 120 годин"
                        />
                      </Field>
                    )}

                    <label className="flex items-center gap-2.5 text-[14px] text-[#4A5568]">
                      <input
                        type="checkbox"
                        checked={form.ongoing}
                        onChange={(ev) => set("ongoing", ev.target.checked)}
                        className="h-4 w-4 accent-[#1C3557]"
                      />
                      Навчання триває
                    </label>
                  </>
                )}

                <Field label="Короткий опис (необов'язково)">
                  <textarea
                    className={cn(inputClass, "h-auto py-2.5 leading-relaxed")}
                    rows={3}
                    value={form.description ?? ""}
                    onChange={(ev) => set("description", ev.target.value || null)}
                  />
                </Field>

                <p className={cn("text-[12px]", ink.soft)}>
                  Документ можна прикріпити після збереження — він не обов&apos;язковий.
                </p>

                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button type="button" onClick={save} disabled={pending} className={btnPrimary}>
                    {pending ? "Зберігаємо…" : "Зберегти"}
                  </button>
                  <button type="button" onClick={() => setForm(null)} className={btnGhost}>
                    Скасувати
                  </button>
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
