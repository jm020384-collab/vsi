import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Відновлення пароля" };

export default function ForgotPasswordPage() {
  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Відновлення пароля</CardTitle>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Згадали пароль?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Увійти
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
