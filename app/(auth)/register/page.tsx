import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, CalendarDays, Inbox, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ink } from "@/components/preview/vsi/theme";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = { title: "Реєстрація фахівця" };

const VALUE_BLOCKS = [
  {
    icon: BadgeCheck,
    title: "Будуйте професійну присутність",
    text: "Створюйте верифікований простір і представляйте свою практику через професійну позицію, тексти та дослідження.",
  },
  {
    icon: CalendarDays,
    title: "Будьте в аналітичному середовищі",
    text: "Стежте за лекціями, семінарами, конференціями, групами та професійними подіями.",
  },
  {
    icon: Users,
    title: "Знаходьте супервізію і розвиток",
    text: "Шукайте супервізорів, навчальні програми та професійні групи.",
  },
  {
    icon: Inbox,
    title: "Отримуйте звернення",
    text: "Дозвольте клієнтам знайомитися з вашим підходом і звертатися через VSI або напряму.",
  },
];

export default function RegisterPage() {
  return (
    <div className="container max-w-4xl py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
          Для фахівців
        </p>
        <h1
          className={cn(
            "mt-4 text-balance text-4xl font-normal leading-[1.1] sm:text-5xl",
            ink.strong,
          )}
          style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
        >
          Ваш професійний простір у VSI
        </h1>
        <p className={cn("mt-4 text-pretty text-[16px] leading-relaxed", ink.muted)}>
          Профіль, публікації, звернення, супервізія, події та професійний розвиток в одному
          середовищі.
        </p>

        <div className="mt-10 grid gap-8 text-left sm:grid-cols-2">
          {VALUE_BLOCKS.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-[#876428]" aria-hidden />
              <h2
                className={cn("mt-3 text-lg font-normal leading-snug", ink.strong)}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                {title}
              </h2>
              <p className={cn("mt-1.5 text-[14px] leading-relaxed", ink.muted)}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Реєстрація фахівця</CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Вже є акаунт?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Увійти
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
