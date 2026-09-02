import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Сесія — JWT: вона лишається валідною, навіть якщо самого User у базі
  // вже нема (видалений акаунт, зміна/скидання бази). Далі такі запити
  // падали на foreign key і показували «Щось пішло не так» замість
  // звичайного повернення на вхід. Перевіряємо тут, у спільній оболонці,
  // щоб покрити всі сторінки кабінету одразу.
  const account = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });
  if (!account) redirect("/login");

  return (
    <div className="bg-[#F8F4EC]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-8 px-5 py-8 sm:px-8 lg:flex-row lg:px-10 lg:py-12">
        <DashboardSidebar userName={session.user.name} isAdmin={session.user.role === "ADMIN"} />
        <main className="min-w-0 flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
