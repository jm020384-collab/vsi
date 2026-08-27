import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Вхід" };

export default function LoginPage() {
  return (
    <div className="container max-w-md py-16">
      <Card>
        <CardHeader>
          <CardTitle>Вхід</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Ще немає акаунту?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Реєстрація
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
