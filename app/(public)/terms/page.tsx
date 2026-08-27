export const metadata = { title: "Угода користувача" };

export default function TermsPage() {
  return (
    <article className="container max-w-3xl py-12">
      <h1 className="text-3xl font-semibold">Угода користувача</h1>
      <p className="mt-2 text-sm text-muted-foreground">TODO: остаточний текст готує юрист.</p>

      <h2 className="mt-8 text-xl font-semibold">1. Загальні положення</h2>
      <p className="mt-2 text-muted-foreground">
        Платформа надає інформаційні послуги та зв'язок між пацієнтом і фахівцем. Платформа не є
        медичним закладом, не надає медичної допомоги і не несе відповідальності за якість та
        результат консультацій.
      </p>

      <h2 className="mt-6 text-xl font-semibold">2. Реєстрація фахівця</h2>
      <p className="mt-2 text-muted-foreground">
        Фахівець підтверджує кваліфікацію документами. До завершення перевірки профіль не є
        публічним.
      </p>

      <h2 className="mt-6 text-xl font-semibold">3. Запити на консультацію</h2>
      <p className="mt-2 text-muted-foreground">
        Подання запиту не є записом на сесію. Подальші домовленості — між пацієнтом і фахівцем
        напряму.
      </p>

      <h2 className="mt-6 text-xl font-semibold">4. Заборонений контент</h2>
      <p className="mt-2 text-muted-foreground">
        Образливі, неправдиві, дискримінаційні матеріали — підстава для блокування.
      </p>

      <h2 className="mt-6 text-xl font-semibold">5. Зміни умов</h2>
      <p className="mt-2 text-muted-foreground">
        Платформа залишає за собою право змінювати умови з повідомленням про це на сайті.
      </p>
    </article>
  );
}
