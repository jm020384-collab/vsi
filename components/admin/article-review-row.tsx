"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { approveArticleAction, rejectArticleAction } from "@/lib/actions/admin-content";

export function ArticleReviewRow({
  id,
  title,
  authorName,
  createdAt,
  excerpt,
}: {
  id: string;
  title: string;
  authorName: string;
  createdAt: string;
  excerpt: string;
}) {
  const [pending, startTransition] = useTransition();
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveArticleAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`«${title}» опубліковано`);
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectArticleAction(id, reason);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success(`«${title}» повернено авторові`);
    });
  };

  return (
    <li className="border-b border-border py-5 last:border-0">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">
        {authorName} · {createdAt}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" disabled={pending} onClick={handleApprove}>
          Опублікувати
        </Button>
        {!showReason && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => setShowReason(true)}
          >
            Повернути авторові
          </Button>
        )}
      </div>

      {showReason && (
        <div className="mt-3 space-y-2 rounded-md border border-destructive/30 bg-destructive/5 p-3">
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Що варто доопрацювати (побачить автор)"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={pending || reason.trim().length < 5}
              onClick={handleReject}
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
      )}
    </li>
  );
}
