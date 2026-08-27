import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [pendingTherapists, pendingReviews, publishedArticles, newRequests] = await Promise.all([
    prisma.therapistProfile.count({ where: { status: "PENDING", deletedAt: null } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    prisma.contactRequest.count({ where: { status: "NEW" } }),
  ]);

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-semibold">Адмін-панель</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Фахівці на модерації</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{pendingTherapists}</div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/therapists">Переглянути</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Відгуки на модерації</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{pendingReviews}</div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/reviews">Переглянути</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Опубліковані статті</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{publishedArticles}</div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/articles">Керувати</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Нові звернення</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{newRequests}</div>
            <Button asChild className="mt-4" variant="outline" size="sm">
              <Link href="/admin/requests">Переглянути</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
