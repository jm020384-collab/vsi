"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, PartyPopper } from "lucide-react";

import { cn } from "@/lib/utils";
import { createArticleAction, type ArticleState } from "@/lib/actions/articles";
import { ARTICLE_KINDS } from "@/lib/schemas/article";
import { LIBRARY_CATEGORIES, THEMES } from "@/components/preview/vsi/data";
import { PhotoUploader } from "@/components/dashboard/photo-uploader";
import { focusRing, ink } from "@/components/preview/vsi/theme";

const inputClass = cn(
  "w-full rounded-xl border border-[#142744]/15 bg-[#FFFDF8] px-3.5 py-3 text-[15px] text-[#142744]",
  "placeholder:text-[#8C93A0]",
  "focus:border-[#1C3557] focus:outline-none focus:ring-2 focus:ring-[#1C3557]/25",
);

const KIND_LABEL: Record<(typeof ARTICLE_KINDS)[number], string> = {
  ARTICLE: "Стаття",
  NOTE: "Професійна нотатка",
  RESEARCH: "Дослідження",
  BOOK_REVIEW: "Рецензія на книгу",
  VIDEO: "Відео",
  AUDIO: "Аудіо",
};

const TOPIC_OPTIONS = THEMES.flatMap((t) => [
  { slug: t.slug, title: t.title },
  ...t.subthemes.map((s) => ({ slug: s.slug, title: s.title })),
]);

/**
 * Композитор тексту — фахівець пише і публікує сам, без редактора-
 * посередника. Проста форма замість повноцінного WYSIWYG: платформа
 * не диктує, як має виглядати думка.
 */
export function ArticleComposer() {
  const [state, formAction, pending] = useActionState<ArticleState | null, FormData>(
    (prev, fd) => createArticleAction(prev, fd),
    null,
  );
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  if (state?.ok) {
    return (
      <div className="mx-auto w-full max-w-[560px] py-16 text-center">
        <span
          aria-hidden
          className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#1C3557]/[0.08] text-[#1C3557]"
        >
          <PartyPopper className="h-7 w-7" />
        </span>
        <h1
          className={cn("mt-6 text-3xl font-normal", ink.strong)}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Текст збережено
        </h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/library/${state.slug}`}
            className={cn(
              "inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "hover:bg-[#142744] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Переглянути
          </Link>
          <Link
            href="/dashboard/articles"
            className={cn(
              "border-[#142744]/22 inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 text-sm font-medium text-[#142744]",
              "hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] motion-reduce:transition-none",
              focusRing,
            )}
          >
            Усі мої тексти
          </Link>
        </div>
      </div>
    );
  }

  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined;

  return (
    <div className="mx-auto w-full max-w-[680px] py-6">
      <Link
        href="/dashboard/articles"
        className={cn(
          "inline-flex min-h-[40px] items-center gap-2 text-sm text-[#4A5568] hover:text-[#142744]",
          focusRing,
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Мій блог
      </Link>

      <h1
        className={cn("mt-4 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Новий текст
      </h1>

      <form action={formAction} className="mt-8 space-y-5">
        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Тип матеріалу
          </label>
          <div className="flex flex-wrap gap-2">
            {ARTICLE_KINDS.map((k, i) => (
              <label
                key={k}
                className={cn(
                  "inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-3.5 text-sm has-[:checked]:border-[#1C3557] has-[:checked]:bg-[#1C3557] has-[:checked]:text-[#FFFDF8]",
                  "border-[#142744]/15 text-[#4A5568] hover:border-[#142744]/35",
                )}
              >
                <input
                  type="radio"
                  name="kind"
                  value={k}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                {KIND_LABEL[k]}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Заголовок</label>
          <input
            name="title"
            required
            className={cn(inputClass, "text-xl")}
            style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            placeholder="Про що ваш текст?"
          />
          {fieldErrors?.title?.[0] && (
            <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.title[0]}</p>
          )}
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Обкладинка <span className={ink.soft}>(необов'язково)</span>
          </label>
          <PhotoUploader
            value={coverUrl}
            onChange={setCoverUrl}
            endpoint="articleCover"
            label="обкладинку"
            icon={ImageIcon}
            previewClassName="h-20 w-32 rounded-xl"
            sizes="128px"
          />
          <input type="hidden" name="coverUrl" value={coverUrl ?? ""} />
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Короткий опис
          </label>
          <textarea
            name="excerpt"
            required
            rows={2}
            className={cn(inputClass, "leading-relaxed")}
            placeholder="Два-три речення для анонсу в бібліотеці"
          />
          {fieldErrors?.excerpt?.[0] && (
            <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.excerpt[0]}</p>
          )}
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Абстракт <span className={ink.soft}>(необов'язково — для дослідницьких текстів)</span>
          </label>
          <textarea
            name="abstract"
            rows={3}
            className={cn(inputClass, "leading-relaxed")}
            placeholder="Стисле наукове резюме тексту"
          />
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>Текст</label>
          <textarea
            name="content"
            required
            rows={16}
            className={cn(inputClass, "leading-relaxed")}
            placeholder="Пишіть вільно — розбивайте на абзаци порожнім рядком."
          />
          {fieldErrors?.content?.[0] && (
            <p className="mt-1.5 text-[13px] text-[#8A4B33]">{fieldErrors.content[0]}</p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
              Тема <span className={ink.soft}>(необов'язково)</span>
            </label>
            <input
              name="topicSlug"
              list="topic-options"
              className={inputClass}
              placeholder="Оберіть зі списку"
            />
            <datalist id="topic-options">
              {TOPIC_OPTIONS.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </datalist>
          </div>
          <div>
            <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
              Медіа-посилання <span className={ink.soft}>(відео/аудіо, необов'язково)</span>
            </label>
            <input name="mediaUrl" type="url" className={inputClass} placeholder="https://…" />
          </div>
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Категорії{" "}
            <span className={ink.soft}>(необов'язково — за ними читачі фільтрують бібліотеку)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {LIBRARY_CATEGORIES.map((c) => (
              <label
                key={c}
                className={cn(
                  "inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-3.5 text-sm has-[:checked]:border-[#1C3557] has-[:checked]:bg-[#1C3557] has-[:checked]:text-[#FFFDF8]",
                  "border-[#142744]/15 text-[#4A5568] hover:border-[#142744]/35",
                )}
              >
                <input type="checkbox" name="tags" value={c} className="sr-only" />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={cn("mb-1.5 block text-sm font-medium", ink.strong)}>
            Джерела <span className={ink.soft}>(кожне з нового рядка, необов'язково)</span>
          </label>
          <textarea
            name="references"
            rows={3}
            className={cn(inputClass, "leading-relaxed")}
            placeholder={"Jung, C.G. (1964). Man and His Symbols."}
          />
        </div>

        {state?.ok === false && (
          <p className="rounded-lg border border-[#8A4B33]/25 bg-[#8A4B33]/[0.06] px-4 py-3 text-[14px] text-[#8A4B33]">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            name="status"
            value="PUBLISHED"
            disabled={pending}
            className={cn(
              "inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#1C3557] px-6 text-sm font-medium text-[#FFFDF8]",
              "hover:bg-[#142744] disabled:opacity-60 motion-reduce:transition-none",
              focusRing,
            )}
          >
            {pending ? "Публікуємо…" : "Опублікувати"}
          </button>
          <button
            type="submit"
            name="status"
            value="REVIEW"
            disabled={pending}
            className={cn(
              "border-[#142744]/22 inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 text-sm font-medium text-[#142744]",
              "hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] disabled:opacity-60 motion-reduce:transition-none",
              focusRing,
            )}
          >
            Надіслати на перевірку
          </button>
          <button
            type="submit"
            name="status"
            value="DRAFT"
            disabled={pending}
            className={cn(
              "border-[#142744]/22 inline-flex min-h-[46px] items-center justify-center rounded-xl border px-6 text-sm font-medium text-[#142744]",
              "hover:border-[#142744]/45 hover:bg-[#142744]/[0.04] disabled:opacity-60 motion-reduce:transition-none",
              focusRing,
            )}
          >
            Зберегти чернетку
          </button>
        </div>
      </form>
    </div>
  );
}
