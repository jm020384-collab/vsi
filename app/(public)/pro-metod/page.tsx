import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Про метод",
  description:
    "Що таке аналітично орієнтована психотерапія, як вона відрізняється від інших підходів та коли її варто розглянути.",
};

export default function ProMethodPage() {
  return (
    <article className="container max-w-3xl py-16">
      <h1 className="text-4xl font-semibold md:text-5xl">
        Що таке аналітично орієнтована психотерапія
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Аналітично орієнтована психотерапія — підхід, що спирається на ідеї психоаналізу, але
        адаптований до сучасного ритму життя. Ми досліджуємо несвідомі мотиви, повторювані сценарії,
        образи себе та інших, що формувалися з дитинства.
      </p>

      <h2 className="mt-12 text-2xl font-semibold">Кому це підходить</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Тим, хто помічає повторювані сценарії в стосунках чи роботі</li>
        <li>Тим, хто хоче глибше зрозуміти себе, а не лише прибрати симптом</li>
        <li>Тим, хто готовий працювати у середньо- чи довгостроковому форматі</li>
      </ul>

      <h2 className="mt-12 text-2xl font-semibold">Як відбуваються сесії</h2>
      <p className="mt-4 text-muted-foreground">
        Зазвичай — 1–2 рази на тиждень, по 50 хвилин. Формат — очний або онлайн. Тривалість роботи
        визначається спільно з фахівцем і залежить від запиту.
      </p>

      <h2 className="mt-12 text-2xl font-semibold">
        Чим відрізняється від класичного психоаналізу
      </h2>
      <p className="mt-4 text-muted-foreground">
        Аналітично орієнтований підхід зберігає ключові принципи аналізу (увага до несвідомого,
        перенесення, історії), але працює в режимі обличчя до обличчя і з меншою частотою сесій. Це
        робить його доступнішим, не втрачаючи глибини.
      </p>

      <div className="mt-12 rounded-lg border border-border bg-secondary/40 p-6">
        <p className="text-sm">
          Цей розділ — освітня заглушка. У продакшні тут буде розгорнутий матеріал, узгоджений з
          професійною спільнотою.
        </p>
      </div>
    </article>
  );
}
