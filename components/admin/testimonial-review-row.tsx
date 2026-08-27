"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { approveReviewAction, rejectReviewAction } from "@/lib/actions/admin-content";

export function TestimonialReviewRow({
  id,
  authorName,
  therapistName,
  content,
  createdAt,
}: {
  id: string;
  authorName: string;
  therapistName: string;
  content: string;
  createdAt: string;
}) {
  const [pending, startTransition] = useTransition();

  const handleApprove = () => {
    startTransition(async () => {
      const result = await approveReviewAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Відгук опубліковано");
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      const result = await rejectReviewAction(id);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Відгук відхилено");
    });
  };

  return (
    <li className="border-b border-border py-5 last:border-0">
      <div className="text-sm font-medium">
        {authorName} → {therapistName}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{createdAt}</div>
      <p className="mt-2 text-sm text-muted-foreground">{content}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={pending} onClick={handleApprove}>
          Опублікувати
        </Button>
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={handleReject}>
          Відхилити
        </Button>
      </div>
    </li>
  );
}
