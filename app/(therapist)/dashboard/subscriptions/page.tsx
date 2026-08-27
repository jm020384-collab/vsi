import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { ComingSoon } from "@/components/dashboard/coming-soon";

export const metadata: Metadata = { title: "Мої підписки · Кабінет фахівця" };

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ComingSoon
      title="Мої підписки"
      note="Стежте за темами, авторами, супервізорами та організаціями — і отримуйте персоналізовану стрічку нового в аналітичному середовищі VSI. Розділ у розробці."
    />
  );
}
