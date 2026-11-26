import { z } from "zod";

import { LIBRARY_CATEGORIES } from "@/components/preview/vsi/data";
import { ARTICLE_KINDS, ARTICLE_LIMITS as L } from "./article";

export const PUBLISH_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED"] as const;

/** Назви полів такі, як на формі, — для переліку помилок біля кнопки. */
export const ARTICLE_FIELD_LABELS: Record<string, string> = {
  title: "Заголовок",
  excerpt: "Короткий опис",
  coverUrl: "Обкладинка",
  content: "Текст",
  tags: "Категорії",
  kind: "Тип матеріалу",
  abstract: "Абстракт",
  topicSlug: "Тема",
  references: "Джерела",
  mediaUrl: "Медіа-посилання",
};

export const articleSchema = z.object({
  title: z
    .string()
    .min(L.title.min, `щонайменше ${L.title.min} символів`)
    .max(L.title.max, `не більше ${L.title.max} символів`),
  excerpt: z
    .string()
    .min(L.excerpt.min, `щонайменше ${L.excerpt.min} символів`)
    .max(L.excerpt.max, `не більше ${L.excerpt.max} символів; решту перенесіть у «Текст»`),
  coverUrl: z.string().url("завантажте зображення ще раз").optional().nullable(),
  content: z.string().min(L.content.min, `щонайменше ${L.content.min} символів`),
  // Категорії — фіксований список (LIBRARY_CATEGORIES), не довільний текст:
  // /library фільтрує рівно за цими значеннями, довільні теги там ніколи
  // не збігались і робили реальні статті невидимими під жодним фільтром.
  tags: z.array(z.enum(LIBRARY_CATEGORIES)),
  kind: z.enum(ARTICLE_KINDS).default("ARTICLE"),
  abstract: z
    .string()
    .max(L.abstract.max, `не більше ${L.abstract.max} символів`)
    .optional()
    .nullable(),
  topicSlug: z.string().max(80, "оберіть тему зі списку").optional().nullable(),
  references: z.array(z.string()).max(L.references.max, `не більше ${L.references.max} рядків`),
  mediaUrl: z
    .string()
    .url("посилання має починатися з https://")
    .optional()
    .or(z.literal(""))
    .nullable(),
  status: z.enum(PUBLISH_STATUSES),
});
