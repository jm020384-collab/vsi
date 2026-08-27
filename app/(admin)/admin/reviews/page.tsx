import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { TestimonialReviewRow } from "@/components/admin/testimonial-review-row";

export const metadata: Metadata = { title: "Відгуки на модерації · Адмін-панель" };

export default async function AdminReviewsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const reviews = await prisma.review.findMany({
    where: { status: "PENDING" },
    include: { therapist: { select: { fullName: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold">Відгуки на модерації</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {reviews.length === 0
          ? "Немає відгуків, що очікують розгляду."
          : `На розгляді: ${reviews.length}`}
      </p>

      {reviews.length > 0 && (
        <ul className="mt-8">
          {reviews.map((r) => (
            <TestimonialReviewRow
              key={r.id}
              id={r.id}
              authorName={r.authorName}
              therapistName={r.therapist.fullName}
              content={r.content}
              createdAt={r.createdAt.toLocaleDateString("uk-UA")}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
