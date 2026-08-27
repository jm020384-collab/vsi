import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Налаштування · Кабінет фахівця" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ComingSoon
      title="Налаштування"
      note="Керування акаунтом, сповіщеннями та мовою інтерфейсу. Розділ у розробці."
    />
  );
}
