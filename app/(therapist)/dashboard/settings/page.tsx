import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { AccountSecurity } from "@/components/dashboard/account-security";

export const metadata: Metadata = { title: "Налаштування · Кабінет фахівця" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      pendingEmail: true,
      emailVerified: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
  if (!user) redirect("/login");

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
        Налаштування
      </p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Мій профіль → Безпека
      </h1>

      <AccountSecurity
        email={user.email}
        pendingEmail={user.pendingEmail}
        emailVerified={!!user.emailVerified}
        registeredAt={user.createdAt.toISOString()}
        lastLoginAt={user.lastLoginAt?.toISOString() ?? null}
      />
    </div>
  );
}
