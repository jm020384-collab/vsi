import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Супервізія · Кабінет фахівця" };

export default async function SupervisionPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ComingSoon
      title="Супервізія"
      note="Пошук супервізора за напрямом, форматом і мовою — і можливість самому публікувати умови супервізії для колег. Розділ у розробці."
    />
  );
}
