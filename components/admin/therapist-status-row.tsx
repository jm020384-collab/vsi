"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reactivateTherapistAction, suspendTherapistAction } from "@/lib/actions/admin-therapists";

export function TherapistStatusRow({
  id,
  fullName,
  email,
  city,
  mode,
}: {
  id: string;
  fullName: string;
  email: string;
  city: string;
  mode: "active" | "suspended";
}) {
  const [pending, startTransition] = useTransition();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleSuspend = () => {
    startTransition(async () => {
      const result = await suspendTherapistAction(id, reason);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Профіль «${fullName}» деактивовано`);
    });
  };

  const handleReactivate = () => {
    startTransition(async () => {
      const result = await reactivateTherapistAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`Профіль «${fullName}» знову активний`);
    });
  };

  return (
    <li className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{fullName}</div>
        <div className="truncate text-xs text-muted-foreground">
          {email} · {city}
        </div>
      </div>

      {mode === "suspended" ? (
        <Button
          type="button"
          size="sm"
          disabled={pending}
          onClick={handleReactivate}
          className="shrink-0"
        >
          Активувати знову
        </Button>
      ) : showReason ? (
        <div className="flex w-full flex-col gap-2 sm:max-w-sm">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Причина деактивації (побачить фахівець)"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={pending || reason.trim().length < 5}
              onClick={handleSuspend}
            >
              Підтвердити
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => setShowReason(false)}
            >
              Скасувати
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => setShowReason(true)}
          className="shrink-0"
        >
          Деактивувати
        </Button>
      )}
    </li>
  );
}
