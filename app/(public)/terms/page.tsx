import type { Metadata } from "next";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  return pageMetadata(locale, "/terms", {
    title: tr("Угода користувача"),
  });
}

export default async function TermsPage() {
  const { tr } = await getI18n();
  return (
    <article className="container max-w-3xl py-8">
      <h1 className="text-3xl font-semibold">{tr("Угода користувача")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {tr("TODO: остаточний текст готує юрист.")}
      </p>

      <h2 className="mt-6 text-xl font-semibold">{tr("1. Загальні положення")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr(
          "Платформа надає інформаційні послуги та зв'язок між пацієнтом і фахівцем. Платформа не є медичним закладом, не надає медичної допомоги і не несе відповідальності за якість та результат консультацій.",
        )}
      </p>

      <h2 className="mt-4 text-xl font-semibold">{tr("2. Реєстрація фахівця")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr(
          "Фахівець підтверджує кваліфікацію документами. До завершення перевірки профіль не є публічним. Скани документів, які фахівець прикріплює до записів про освіту, показуються в його публічному профілі.",
        )}
      </p>

      <h2 className="mt-4 text-xl font-semibold">{tr("3. Запити на консультацію")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr(
          "Подання запиту не є записом на сесію. Подальші домовленості — між пацієнтом і фахівцем напряму.",
        )}
      </p>

      <h2 className="mt-4 text-xl font-semibold">{tr("4. Заборонений контент")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr("Образливі, неправдиві, дискримінаційні матеріали — підстава для блокування.")}
      </p>

      <h2 className="mt-4 text-xl font-semibold">{tr("5. Зміни умов")}</h2>
      <p className="mt-2 text-muted-foreground">
        {tr("Платформа залишає за собою право змінювати умови з повідомленням про це на сайті.")}
      </p>
    </article>
  );
}
