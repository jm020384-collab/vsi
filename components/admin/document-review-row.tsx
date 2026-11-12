"use client";

import { useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reviewDocumentAction, type DocumentDecision } from "@/lib/actions/admin-therapists";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "На розгляді",
  VERIFIED: "Перевірено",
  NEEDS_UPDATE: "Потрібне уточнення",
};

const STATUS_VARIANT: Record<string, "warning" | "success" | "outline"> = {
  PENDING: "warning",
  VERIFIED: "success",
  NEEDS_UPDATE: "outline",
};

const DONE_MESSAGE: Record<DocumentDecision, string> = {
  VERIFIED: "Документ підтверджено — позначка з'явилась у профілі",
  NEEDS_UPDATE: "Позначено: потрібне уточнення",
  PENDING: "Рішення скасовано",
};

export interface DocumentReviewData {
  id: string;
  label: string;
  /** false — файл завантажено окремо, без запису освіти. */
  attached: boolean;
  detail: string | null;
  fileUrl: string | null;
  fileName: string | null;
  status: string;
  uploadedAt: string;
}

export function DocumentReviewRow({ doc }: { doc: DocumentReviewData }) {
  const [pending, startTransition] = useTransition();

  const decide = (decision: DocumentDecision) => {
    startTransition(async () => {
      const result = await reviewDocumentAction(doc.id, decision);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(DONE_MESSAGE[decision]);
    });
  };

  return (
    <li className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">{doc.label}</span>
          <Badge variant={STATUS_VARIANT[doc.status] ?? "outline"}>
            {STATUS_LABEL[doc.status] ?? doc.status}
          </Badge>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {[doc.detail, `завантажено ${new Date(doc.uploadedAt).toLocaleDateString("uk-UA")}`]
            .filter(Boolean)
            .join(" · ")}
        </div>
        {!doc.attached && (
          <p className="mt-1 text-xs text-muted-foreground">
            Файл не прив&apos;язаний до запису освіти, тож позначки в профілі не дасть — фахівцеві
            варто прикріпити його до потрібного запису.
          </p>
        )}
        {doc.fileUrl && (
          <a
            href={doc.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1.5 text-sm underline underline-offset-2"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            Відкрити файл
            {doc.fileName && <span className="sr-only">: {doc.fileName}</span>}
          </a>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {doc.status === "VERIFIED" ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={pending}
            onClick={() => decide("PENDING")}
          >
            Скасувати підтвердження
          </Button>
        ) : (
          <>
            <Button type="button" size="sm" disabled={pending} onClick={() => decide("VERIFIED")}>
              Підтвердити
            </Button>
            {doc.status !== "NEEDS_UPDATE" && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                onClick={() => decide("NEEDS_UPDATE")}
              >
                Потрібне уточнення
              </Button>
            )}
          </>
        )}
      </div>
    </li>
  );
}
