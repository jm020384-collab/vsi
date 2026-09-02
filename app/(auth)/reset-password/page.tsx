import type { Metadata } from "next";
import Link from "next/link";
import { X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Новий пароль" };

interface PageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <div className="container max-w-md py-16 text-center">
        <X className="mx-auto h-8 w-8 text-destructive" aria-hidden />
        <h1 className="mt-3 text-2xl font-semibold">Посилання недійсне</h1>
        <p className="mt-3 text-muted-foreground">
          Перейдіть за посиланням із листа ще раз, або запросіть нове.
        </p>
        <Link href="/forgot-password" className="mt-6 inline-block text-primary underline">
          Відновити пароль
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Новий пароль</CardTitle>
        </CardHeader>
        <CardContent>
          <ResetPasswordForm token={token} email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
