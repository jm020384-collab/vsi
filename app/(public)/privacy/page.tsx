export const metadata = { title: "Політика конфіденційності" };

export default function PrivacyPage() {
  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">Політика конфіденційності</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        TODO: остаточний текст готує юрист. Нижче — каркас з ключовими розділами.
      </p>

      <h2 className="mt-8 text-xl font-semibold">1. Хто ми</h2>
      <p className="mt-2 text-muted-foreground">Назва юридичної особи, контакти, DPO.</p>

      <h2 className="mt-6 text-xl font-semibold">2. Які дані ми збираємо</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Email і пароль (для зареєстрованих)</li>
        <li>Профільні дані фахівця</li>
        <li>Запити на консультацію (ім'я, контакт, повідомлення)</li>
        <li>Технічні: cookies, hash IP — для anti-spam і функціональності</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">3. Правові підстави</h2>
      <p className="mt-2 text-muted-foreground">
        Згода (art. 6.1.a GDPR), виконання договору (b), законний інтерес (f). Для даних спеціальної
        категорії (art. 9) — окрема явна згода.
      </p>

      <h2 className="mt-6 text-xl font-semibold">4. Ваші права</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Доступ до даних і їх копія</li>
        <li>Виправлення та видалення</li>
        <li>Обмеження обробки</li>
        <li>Перенесення</li>
        <li>Скарга до Уповноваженого Верховної Ради з прав людини</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">5. Процесори</h2>
      <p className="mt-2 text-muted-foreground">
        Vercel, Neon, Resend, UploadThing, Sentry — усі обрані в EU-регіоні.
      </p>

      <h2 className="mt-6 text-xl font-semibold">6. Контакти</h2>
      <p className="mt-2 text-muted-foreground">Email для звернень за GDPR-правами.</p>
    </article>
  );
}
