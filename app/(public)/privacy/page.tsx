import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  return pageMetadata(locale, "/privacy", {
    title: tr("Політика конфіденційності"),
  });
}

export default async function PrivacyPage() {
  const { tr } = await getI18n();
  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">{tr("Політика конфіденційності")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {tr("TODO: остаточний текст готує юрист. Нижче — каркас з ключовими розділами.")}
      </p>

      <h2 className="mt-8 text-xl font-semibold">{tr("1. Хто ми")}</h2>
      <p className="mt-2 text-muted-foreground">{tr("Назва юридичної особи, контакти, DPO.")}</p>

      <h2 className="mt-6 text-xl font-semibold">{tr("2. Які дані ми збираємо")}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>{tr("Email і пароль (для зареєстрованих)")}</li>
        <li>{tr("Профільні дані фахівця")}</li>
        <li>{tr("Запити на консультацію (ім'я, контакт, повідомлення)")}</li>
        <li>{tr("Технічні: cookies, hash IP — для anti-spam і функціональності")}</li>
        <li>
          {tr(
            "Статистика відвідувань: які сторінки відкривали і з якого сайту прийшли. Ведемо її самі, без сторонніх лічильників і без cookies; IP-адреса не зберігається — лише її незворотний hash. Якщо ви перейшли за посиланням із рекламними мітками й залишили заявку, поряд із нею зберігається назва цього джерела чи оголошення",
          )}
        </li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">{tr("3. Правові підстави")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr(
          "Згода (art. 6.1.a GDPR), виконання договору (b), законний інтерес (f). Для даних спеціальної категорії (art. 9) — окрема явна згода.",
        )}
      </p>

      <h2 className="mt-6 text-xl font-semibold">{tr("4. Ваші права")}</h2>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>{tr("Доступ до даних і їх копія")}</li>
        <li>{tr("Виправлення та видалення")}</li>
        <li>{tr("Обмеження обробки")}</li>
        <li>{tr("Перенесення")}</li>
        <li>{tr("Скарга до Уповноваженого Верховної Ради з прав людини")}</li>
      </ul>

      <h2 className="mt-6 text-xl font-semibold">{tr("5. Процесори")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr("Vercel, Neon, Resend, UploadThing, Sentry — усі обрані в EU-регіоні.")}
      </p>

      <h2 className="mt-6 text-xl font-semibold">{tr("6. Контакти")}</h2>
      <p className="mt-2 text-muted-foreground">{tr("Email для звернень за GDPR-правами.")}</p>
    </article>
  );
}
