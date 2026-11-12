import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { loadSiteStats } from "@/lib/analytics";
import { PERIODS, SiteStatsView } from "@/components/admin/site-stats";

export const metadata: Metadata = { title: "Статистика · Адмін-панель" };
export const dynamic = "force-dynamic";

export default async function AdminStatsPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");

  const requested = Number((await searchParams).days);
  const days = PERIODS.find((p) => p === requested) ?? 30;

  const [stats, therapists] = await Promise.all([
    loadSiteStats(days),
    prisma.therapistProfile.findMany({ select: { slug: true, fullName: true } }),
  ]);

  return (
    <div className="container max-w-5xl py-10">
      <SiteStatsView
        stats={stats}
        names={Object.fromEntries(therapists.map((t) => [t.slug, t.fullName]))}
        basePath="/admin/stats"
      />
    </div>
  );
}
