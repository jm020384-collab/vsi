"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, User } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing-client";
import type { AppFileRouter } from "@/lib/uploadthing";
import { focusRing } from "@/components/preview/vsi/theme";

/**
 * Завантаження зображення через UploadThing — після завершення передає
 * готовий publicUrl наверх (форма зберігає його у прихованому полі).
 * За замовчуванням налаштований під фото профілю; `endpoint`/`label`/`icon`
 * дозволяють перевикористати той самий компонент для інших зображень
 * (напр. обкладинки події) без дублювання аплоад-логіки.
 */
export function PhotoUploader({
  value,
  onChange,
  endpoint = "profilePhoto",
  label = "фото",
  icon: Icon = User,
  previewClassName = "h-24 w-24",
  sizes = "96px",
}: {
  value: string | null;
  onChange: (url: string) => void;
  endpoint?: keyof AppFileRouter;
  label?: string;
  icon?: React.ElementType;
  previewClassName?: string;
  sizes?: string;
}) {
  const [preview, setPreview] = useState<string | null>(value);
  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const url = res?.[0]?.ufsUrl;
      if (url) {
        setPreview(url);
        onChange(url);
      }
    },
    onUploadError: (error) => {
      toast.error(error.message || `Не вдалося завантажити ${label}`);
    },
  });

  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          "border-[#142744]/12 relative shrink-0 overflow-hidden rounded-2xl border bg-[#F8F4EC]",
          previewClassName,
        )}
      >
        {preview ? (
          <Image src={preview} alt="" fill sizes={sizes} className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-[#8C93A0]">
            <Icon className="h-8 w-8" aria-hidden />
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 grid place-items-center bg-[#142744]/40">
            <Loader2 className="h-5 w-5 animate-spin text-[#F8F4EC]" aria-hidden />
          </div>
        )}
      </div>

      <label
        className={cn(
          "inline-flex min-h-[44px] cursor-pointer items-center rounded-xl border border-[#142744]/20 bg-[#FFFDF8] px-4 text-sm font-medium text-[#142744]",
          "transition-colors hover:border-[#142744]/40 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
          focusRing,
        )}
      >
        {preview ? `Змінити ${label}` : `Завантажити ${label}`}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void startUpload([file]);
          }}
        />
      </label>
    </div>
  );
}
