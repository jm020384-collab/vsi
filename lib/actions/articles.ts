"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ARTICLE_FIELD_LABELS, articleSchema } from "@/lib/schemas/article-form";
import { describeFieldErrors, unixLines } from "@/lib/forms/errors";

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
    excerpt: unixLines(formData.get("excerpt")),
    coverUrl: formData.get("coverUrl") || null,
    content: unixLines(formData.get("content")),
    tags: formData.getAll("tags"),
    kind: formData.get("kind") || "ARTICLE",
    abstract: unixLines(formData.get("abstract")) || null,
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
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    // Лише назви полів, без тексту: щоб у журналі було видно, на чому спотикаються.
    console.warn("[article] не пройшла перевірку:", Object.keys(fieldErrors).join(", "));
    return {
      ok: false,
      error: describeFieldErrors("Текст не збережено", fieldErrors, ARTICLE_FIELD_LABELS),
      fieldErrors,
    };
  }

  const { tags, status, ...data } = parsed.data;
  const publish = status === "PUBLISHED";

  const baseSlug = slugify(data.title, { lower: true, strict: true, locale: "uk" }) || "text";
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
