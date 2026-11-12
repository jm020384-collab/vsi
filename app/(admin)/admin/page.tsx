import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { loadSiteStats } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const [week, pendingTherapists, pendingReviews, publishedArticles, newRequests] =
    await Promise.all([
      // Статистика не повинна валити всю панель, якщо з нею щось не так.
      loadSiteStats(7).catch(() => null),
      prisma.therapistProfile.count({ where: { status: "PENDING", deletedAt: null } }),
      prisma.review.count({ where: { status: "PENDING" } }),
      prisma.article.count({ where: { status: "PUBLISHED", deletedAt: null } }),
      prisma.contactRequest.count({ where: { status: "NEW" } }),
    ]);

  return (
    <div className="container max-w-5xl py-10">
      <h1 className="text-3xl font-semibold">Адмін-панель</h1>

      {week && (
        <Card className="mt-8">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <div>
              <div className="text-sm text-muted-foreground">Відвідувачі за 7 днів</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums">
                {week.totals.visitors.toLocaleString("uk-UA")}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                з них зайшли на «Фахівці»: {week.totals.catalog} · переглядів сторінок:{" "}
                {week.totals.views}
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/stats">Уся статистика</Link>
            </Button>
          </CardContent>
        </Card>
      )}

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
