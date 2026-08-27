import Link from "next/link";
import { Check, Mail, X } from "lucide-react";

import { confirmEmail } from "@/lib/actions/verify-email";
import { ResendVerificationButton } from "@/components/auth/resend-verification-button";

export const metadata = { title: "Підтвердження email" };

interface PageProps {
  searchParams: Promise<{ token?: string; email?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const { token, email } = await searchParams;

  // Без параметрів — це посадкова сторінка одразу після реєстрації,
  // до того як людина відкрила лист і перейшла за справжнім посиланням.
  if (!token || !email) {
    return (
      <div className="container max-w-md py-24 text-center">
        <Mail className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h1 className="mt-3 text-2xl font-semibold">Перевірте пошту</h1>
        <p className="mt-3 text-muted-foreground">
          Ми надіслали лист із посиланням для підтвердження реєстрації. Відкрийте його й перейдіть
          за посиланням. Лист міг потрапити у папку «Спам».
        </p>
      </div>
    );
  }

  const result = await confirmEmail(email, token);

  if (result.ok) {
    return (
      <div className="container max-w-md py-24 text-center">
        <Check className="mx-auto h-8 w-8 text-primary" aria-hidden />
        <h1 className="mt-3 text-2xl font-semibold">Email підтверджено</h1>
        <p className="mt-3 text-muted-foreground">Реєстрацію завершено — тепер можна увійти.</p>
        <Link href="/login" className="mt-6 inline-block text-primary underline">
          Увійти
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-md py-24 text-center">
      <X className="mx-auto h-8 w-8 text-destructive" aria-hidden />
      <h1 className="mt-3 text-2xl font-semibold">
        {result.error === "expired" ? "Посилання застаріло" : "Посилання недійсне"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        {result.error === "expired"
          ? "Посилання для підтвердження діяло 24 години. Надішліть новий лист."
          : "Це посилання вже використане або невірне. Надішліть новий лист."}
      </p>
      <div className="mt-6 flex justify-center">
        <ResendVerificationButton email={email} />
      </div>
    </div>
  );
}
