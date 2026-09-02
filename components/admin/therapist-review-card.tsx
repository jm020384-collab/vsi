"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { approveTherapistAction, rejectTherapistAction } from "@/lib/actions/admin-therapists";

const AGE_GROUP_LABEL: Record<string, string> = {
  CHILDREN: "Діти",
  TEENS: "Підлітки",
  ADULTS: "Дорослі",
};

const WORK_FORMAT_LABEL: Record<string, string> = {
  INDIVIDUAL: "Індивідуально",
  COUPLES: "Пари",
  FAMILY: "Сім'я",
  GROUP: "Група",
};

const SESSION_FORMAT_LABEL: Record<string, string> = {
  ONLINE: "Онлайн",
  OFFLINE: "Очно",
  BOTH: "Онлайн і очно",
};

const DOC_TYPE_LABEL: Record<string, string> = {
  DIPLOMA: "Диплом",
  CERTIFICATE: "Сертифікат",
  ID: "Документ, що посвідчує особу",
  OTHER: "Інше",
};

const DOC_STATUS_LABEL: Record<string, string> = {
  PENDING: "На розгляді",
  VERIFIED: "Верифіковано",
  NEEDS_UPDATE: "Потрібне оновлення",
};

const DOC_STATUS_VARIANT: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  VERIFIED: "success",
  NEEDS_UPDATE: "destructive",
};

export interface TherapistReviewData {
  id: string;
  fullName: string;
  email: string;
  emailVerified: boolean;
  registeredAt: string;
  lastLoginAt: string | null;
  city: string;
  yearsExperience: number;
  sessionFormat: string;
  contactEmail: string | null;
  contactPhone: string | null;
  bio: string;
  professionalTitle: string | null;
  analyticalOrientation: string | null;
  ageGroups: string[];
  workFormats: string[];
  professionalInterests: string[];
  associations: string[];
  supervisionStatus: string | null;
  personalTherapyStatus: string | null;
  specializations: string[];
  languages: string[];
  submittedAt: string;
  documents: { id: string; fileName: string; fileUrl: string; docType: string; status: string }[];
}

export function TherapistReviewCard({ therapist: t }: { therapist: TherapistReviewData }) {
  const [pending, startTransition] = useTransition();
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveTherapistAction(t.id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Профіль «${t.fullName}» схвалено`);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectTherapistAction(t.id, reason);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Профіль «${t.fullName}» відхилено`);
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle>{t.fullName}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.email} · {t.city} · подано {new Date(t.submittedAt).toLocaleDateString("uk-UA")}
            </p>
          </div>
          <Badge variant="warning">На розгляді</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-line text-sm leading-relaxed">{t.bio}</p>

        <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Досвід</dt>
            <dd>{t.yearsExperience} р.</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Формат сесій</dt>
            <dd>{SESSION_FORMAT_LABEL[t.sessionFormat] ?? t.sessionFormat}</dd>
          </div>
          {t.professionalTitle && (
            <div>
              <dt className="text-muted-foreground">Кваліфікація</dt>
              <dd>{t.professionalTitle}</dd>
            </div>
          )}
          {t.analyticalOrientation && (
            <div>
              <dt className="text-muted-foreground">Підхід</dt>
              <dd>{t.analyticalOrientation}</dd>
            </div>
          )}
          {(t.contactEmail || t.contactPhone) && (
            <div>
              <dt className="text-muted-foreground">Контакт</dt>
              <dd>{[t.contactEmail, t.contactPhone].filter(Boolean).join(" · ")}</dd>
            </div>
          )}
          {t.supervisionStatus && (
            <div>
              <dt className="text-muted-foreground">Супервізія</dt>
              <dd>{t.supervisionStatus}</dd>
            </div>
          )}
          {t.personalTherapyStatus && (
            <div>
              <dt className="text-muted-foreground">Особиста терапія</dt>
              <dd>{t.personalTherapyStatus}</dd>
            </div>
          )}
        </dl>

        {t.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {t.specializations.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
              </Badge>
            ))}
          </div>
        )}

        {(t.ageGroups.length > 0 || t.workFormats.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {t.ageGroups.map((g) => (
              <Badge key={g} variant="outline">
                {AGE_GROUP_LABEL[g] ?? g}
              </Badge>
            ))}
            {t.workFormats.map((f) => (
              <Badge key={f} variant="outline">
                {WORK_FORMAT_LABEL[f] ?? f}
              </Badge>
            ))}
          </div>
        )}

        {t.languages.length > 0 && (
          <p className="text-sm text-muted-foreground">Мови: {t.languages.join(", ")}</p>
        )}

        {t.professionalInterests.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Професійні інтереси: {t.professionalInterests.join(", ")}
          </p>
        )}

        {t.associations.length > 0 && (
          <p className="text-sm text-muted-foreground">Асоціації: {t.associations.join(", ")}</p>
        )}

        <div className="rounded-md border p-3">
          <p className="text-sm font-medium">Акаунт і безпека</p>
          <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                {t.emailVerified ? (
                  <span className="text-[#245A41]">✓ Підтверджено</span>
                ) : (
                  <span className="text-[#876428]">⚠ Не підтверджено</span>
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <dt className="text-muted-foreground">Реєстрація</dt>
              <dd>{new Date(t.registeredAt).toLocaleDateString("uk-UA")}</dd>
            </div>
            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <dt className="text-muted-foreground">Останній вхід</dt>
              <dd>{t.lastLoginAt ? new Date(t.lastLoginAt).toLocaleDateString("uk-UA") : "—"}</dd>
            </div>
          </dl>
        </div>

        <div>
          <p className="text-sm font-medium">Документи ({t.documents.length})</p>
          {t.documents.length === 0 ? (
            <p className="mt-1 text-sm text-muted-foreground">Файлів не завантажено.</p>
          ) : (
            <ul className="mt-1.5 space-y-1">
              {t.documents.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-2 text-sm">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  <a
                    href={d.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    {d.fileName}
                  </a>
                  <span className="text-muted-foreground">
                    ({DOC_TYPE_LABEL[d.docType] ?? d.docType})
                  </span>
                  <Badge variant={DOC_STATUS_VARIANT[d.status] ?? "outline"}>
                    {DOC_STATUS_LABEL[d.status] ?? d.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t pt-4">
          <Button type="button" size="sm" disabled={pending} onClick={handleApprove}>
            Схвалити
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setShowReject((v) => !v)}
          >
            Відхилити
          </Button>
        </div>

        {showReject && (
          <div className="space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <label className="text-sm font-medium" htmlFor={`reason-${t.id}`}>
              Причина відхилення (побачить фахівець)
            </label>
            <Textarea
              id={`reason-${t.id}`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Наприклад: додайте скан диплома вищої освіти за фахом"
              rows={3}
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={pending || reason.trim().length < 5}
              onClick={handleReject}
            >
              Підтвердити відхилення
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
