"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";
import {
  addVerificationDocumentAction,
  removeVerificationDocumentAction,
} from "@/lib/actions/documents";
import { focusRing, ink } from "@/components/preview/vsi/theme";

export interface DocumentItem {
  id: string;
  fileName: string;
  docType: "DIPLOMA" | "CERTIFICATE" | "ID" | "OTHER";
  status: "PENDING" | "VERIFIED" | "NEEDS_UPDATE";
  reviewNote?: string | null;
}

const DOC_TYPE_LABEL: Record<DocumentItem["docType"], string> = {
  DIPLOMA: "Диплом",
  CERTIFICATE: "Сертифікат",
  ID: "Документ, що посвідчує особу",
  OTHER: "Інше",
};

const STATUS_LABEL: Record<DocumentItem["status"], string> = {
  PENDING: "На розгляді",
  VERIFIED: "Верифіковано",
  NEEDS_UPDATE: "Потрібне оновлення",
};

const STATUS_COLOR: Record<DocumentItem["status"], string> = {
  PENDING: "text-[#876428]",
  VERIFIED: "text-[#245A41]",
  NEEDS_UPDATE: "text-[#8A4B33]",
};

/**
 * Дипломи й сертифікати — реальне завантаження в UploadThing, метадані
 * одразу зберігаються через Server Action. Перевірка — вручну
 * адміністратором, тому щойно завантажений файл має статус
 * «На розгляді», доки reviewedAt лишається порожнім.
 */
export function DiplomaUploader({ initialDocuments }: { initialDocuments: DocumentItem[] }) {
  const [docs, setDocs] = useState(initialDocuments);
  const [docType, setDocType] = useState<DocumentItem["docType"]>("DIPLOMA");
  const [pending, startTransition] = useTransition();

  const { startUpload, isUploading } = useUploadThing("diplomaDocument", {
    onClientUploadComplete: (res) => {
      if (!res) return;
      startTransition(async () => {
        for (const f of res) {
          const result = await addVerificationDocumentAction({
            fileUrl: f.ufsUrl,
            fileName: f.name,
            fileKey: f.key,
            docType,
          });
          if (!result.ok) {
            toast.error(result.error);
            continue;
          }
          // id беремо з бази, а не f.key: саме за цим id працює видалення.
          setDocs((prev) => [
            ...prev,
            { id: result.id, fileName: f.name, docType, status: "PENDING" },
          ]);
        }
      });
    },
    onUploadError: (error) => {
      toast.error(error.message || "Не вдалося завантажити файл");
    },
  });

  const remove = (id: string) => {
    const snapshot = docs;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    startTransition(async () => {
      const result = await removeVerificationDocumentAction(id);
      if (!result.ok) {
        toast.error(result.error);
        setDocs(snapshot); // повертаємо файл у список, якщо видалення не вдалось
      }
    });
  };

  return (
    <div>
      {docs.length > 0 && (
        <ul className="mb-4 space-y-2.5">
          {docs.map((d) => (
            <li
              key={d.id}
              className="flex items-center gap-3.5 rounded-xl border border-[#142744]/10 bg-[#FFFDF8] p-3.5"
            >
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#F8F4EC] text-[#876428]"
              >
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block truncate text-[14px] font-medium", ink.strong)}>
                  {d.fileName}
                </span>
                <span className={cn("mt-0.5 flex items-center gap-2 text-[12px]", ink.soft)}>
                  {DOC_TYPE_LABEL[d.docType]}
                  <span aria-hidden className="h-1 w-1 rounded-full bg-[#B38B49]" />
                  <span className={STATUS_COLOR[d.status]}>{STATUS_LABEL[d.status]}</span>
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
                aria-label={`Видалити ${d.fileName}`}
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#5C6672] hover:bg-[#142744]/[0.06] hover:text-[#8A4B33]",
                  focusRing,
                )}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={docType}
          onChange={(e) => setDocType(e.target.value as DocumentItem["docType"])}
          className={cn(
            "h-11 rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3 text-sm text-[#142744]",
            "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
          )}
        >
          {Object.entries(DOC_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <label
          className={cn(
            "inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#142744]/25 bg-transparent px-4 text-sm font-medium text-[#142744]",
            "transition-colors hover:border-[#142744]/45 hover:bg-[#FFFDF8]/60 motion-reduce:transition-none",
            focusRing,
          )}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : (
            <UploadCloud className="h-4 w-4" aria-hidden />
          )}
          Додати файл
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              if (files.length) void startUpload(files);
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <p className={cn("mt-2 text-[12px]", ink.soft)}>PDF або зображення, до 8 МБ кожен.</p>
    </div>
  );
}
