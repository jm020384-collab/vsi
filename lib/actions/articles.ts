"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ARTICLE_KINDS } from "@/lib/schemas/article";
import { LIBRARY_CATEGORIES } from "@/components/preview/vsi/data";

const PUBLISH_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED"] as const;

const articleSchema = z.object({
  title: z.string().min(6, "Заголовок надто короткий").max(160),
  excerpt: z.string().min(20, "Короткий опис надто короткий").max(400),
  coverUrl: z.string().url().optional().nullable(),
  content: z.string().min(80, "Текст надто короткий"),
  // Категорії — фіксований список (LIBRARY_CATEGORIES), не довільний текст:
  // /library фільтрує рівно за цими значеннями, довільні теги там ніколи
  // не збігались і робили реальні статті невидимими під жодним фільтром.
  tags: z.array(z.enum(LIBRARY_CATEGORIES)).max(6),
  kind: z.enum(ARTICLE_KINDS).default("ARTICLE"),
  abstract: z.string().max(600).optional().nullable(),
  topicSlug: z.string().max(80).optional().nullable(),
  references: z.array(z.string()).max(20),
  mediaUrl: z.string().url().optional().or(z.literal("")).nullable(),
  status: z.enum(PUBLISH_STATUSES),
});

export type ArticleState =
  | { ok: true; slug: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Публікація власного тексту фахівцем — «блог» у просторі фахівця.
 * Кожен фахівець веде свій блог сам: без редактора-посередника
 * стаття зʼявляється в бібліотеці одразу після publish=true.
 */
export async function createArticleAction(
  _prev: ArticleState | null,
  formData: FormData,
): Promise<ArticleState> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Потрібно увійти" };
  }

  const raw = {
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    coverUrl: formData.get("coverUrl") || null,
    content: formData.get("content"),
    tags: formData.getAll("tags"),
    kind: formData.get("kind") || "ARTICLE",
    abstract: formData.get("abstract") || null,
    topicSlug: formData.get("topicSlug") || null,
    references: String(formData.get("references") ?? "")
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean),
    mediaUrl: formData.get("mediaUrl") || null,
    status: formData.get("status") || "DRAFT",
  };

  const parsed = articleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Перевірте форму",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { tags, status, ...data } = parsed.data;
  const publish = status === "PUBLISHED";

  const baseSlug = slugify(data.title, { lower: true, strict: true, locale: "uk" });
  let slug = baseSlug;
  let suffix = 0;
  for (;;) {
    const exists = await prisma.article.findUnique({ where: { slug } });
    if (!exists) break;
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const tagRecords = await Promise.all(
    tags.map((nameUk) =>
      prisma.tag.upsert({
        where: { slug: slugify(nameUk, { lower: true, strict: true, locale: "uk" }) },
        update: {},
        create: {
          slug: slugify(nameUk, { lower: true, strict: true, locale: "uk" }),
          nameUk,
        },
      }),
    ),
  );

  await prisma.article.create({
    data: {
      ...data,
      slug,
      authorId: session.user.id,
      status,
      publishedAt: publish ? new Date() : null,
      tags: { create: tagRecords.map((t) => ({ tagId: t.id })) },
    },
  });

  revalidatePath("/dashboard/articles");
  revalidatePath("/library");

  return { ok: true, slug };
}

export async function deleteArticleAction(articleId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Потрібно увійти");

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article || article.authorId !== session.user.id) {
    throw new Error("Статтю не знайдено");
  }

  await prisma.article.delete({ where: { id: articleId } });
  revalidatePath("/dashboard/articles");
  revalidatePath("/library");
}
