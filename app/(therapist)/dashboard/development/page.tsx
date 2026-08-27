import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Професійний розвиток · Кабінет фахівця" };

export default async function DevelopmentPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ComingSoon
      title="Професійний розвиток"
      note="Навчальні програми, курси, конференції та рекомендовані матеріали — персоналізовані під ваші професійні інтереси. Розділ у розробці."
    />
  );
}
