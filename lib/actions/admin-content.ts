"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export type AdminActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session.user;
}

/**
 * Модерація статей — лише для тих, що автор сам надіслав на перевірку
 * (status=REVIEW). Пряма публікація автором лишається доступною, як і
 * раніше: це не обов'язкова черга, а опційний другий погляд.
 *
 * Повертає {ok,error} замість throw — ці дії викликаються напряму з
 * клієнта, і кинутий виняток міг би дійти як необроблена 500-помилка
 * замість акуратного повідомлення.
 */
export async function approveArticleAction(articleId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article || article.status !== "REVIEW") {
    return { ok: false, error: "Статтю не знайдено або вона вже розглянута" };
  }

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: {
        status: "PUBLISHED",
        reviewNote: null,
        publishedAt: article.publishedAt ?? new Date(),
      },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "article.approved",
        entity: "Article",
        entityId: articleId,
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard/articles");
  revalidatePath("/blog");
  revalidatePath(`/blog/${article.slug}`);
  return { ok: true };
}

export async function rejectArticleAction(
  articleId: string,
  reason: string,
): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const note = reason.trim();
  if (note.length < 5) {
    return { ok: false, error: "Вкажіть причину (щонайменше 5 символів)" };
  }

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article || article.status !== "REVIEW") {
    return { ok: false, error: "Статтю не знайдено або вона вже розглянута" };
  }

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: { status: "DRAFT", reviewNote: note },
    }),
    prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "article.rejected",
        entity: "Article",
        entityId: articleId,
        meta: { reason: note },
      },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/articles");
  revalidatePath("/dashboard/articles");
  return { ok: true };
}

export async function approveReviewAction(reviewId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.status !== "PENDING") {
    return { ok: false, error: "Відгук не знайдено або він вже розглянутий" };
  }

  await prisma.$transaction([
    prisma.review.update({
      where: { id: reviewId },
      data: { status: "APPROVED", reviewedBy: admin.id, reviewedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: { actorId: admin.id, action: "review.approved", entity: "Review", entityId: reviewId },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function rejectReviewAction(reviewId: string): Promise<AdminActionResult> {
  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Потрібно увійти як адміністратор" };

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review || review.status !== "PENDING") {
    return { ok: false, error: "Відгук не знайдено або він вже розглянутий" };
  }

  await prisma.$transaction([
    prisma.review.update({
      where: { id: reviewId },
      data: { status: "REJECTED", reviewedBy: admin.id, reviewedAt: new Date() },
    }),
    prisma.auditLog.create({
      data: { actorId: admin.id, action: "review.rejected", entity: "Review", entityId: reviewId },
    }),
  ]);

  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  return { ok: true };
}
