import { Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { ink } from "../theme";

const STEPS = [
  {
    n: "01",
    title: "Сформулюйте запит приблизно",
    body: "Не обов'язково знати точну назву того, що відбувається. «Не розумію, чому це повторюється» — уже достатній початок.",
  },
  {
    n: "02",
    title: "Звузьте за практичними умовами",
    body: "Формат, мова, вартість, час у розкладі. Ці критерії не менш важливі за метод: терапія має бути можливою регулярно.",
  },
  {
    n: "03",
    title: "Заплануйте першу зустріч",
    body: "Перша сесія — це взаємне знайомство. Ви маєте право поставити питання про освіту, супервізію та досвід із вашою темою.",
  },
  {
    n: "04",
    title: "Дайте собі три-чотири зустрічі",
    body: "Відчуття контакту рідко виникає одразу. Але якщо після кількох сесій немає безпеки — це вагома причина шукати далі.",
  },
];

export function HowToChoose() {
  return (
    <section id="how-to-choose" className="bg-[#E9DECE]">
      <Wrap className="py-20 lg:py-28">
        <div className="max-w-2xl">
          <Eyebrow>Як обрати фахівця</Eyebrow>
          <SectionTitle className="mt-6">Чотири кроки без поспіху</SectionTitle>
          <Lead className="mt-6">
            Вибір терапевта — це не пошук найкращого взагалі, а пошук того, з ким можлива саме ваша
            робота.
          </Lead>
        </div>

        <ol className="border-[#142744]/12 bg-[#142744]/12 lg:mt-18 mt-14 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="group relative flex flex-col bg-[#F8F4EC] p-7">
              <div className="flex items-center gap-3">
                <span
                  className="text-[#142744]/28 text-3xl font-normal"
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                  aria-hidden
                >
                  {s.n}
                </span>
                <span
                  aria-hidden
                  className="h-px flex-1 bg-[#B38B49]/45 transition-all duration-500 group-hover:bg-[#B38B49] motion-reduce:transition-none"
                />
              </div>

              <h3
                className={`mt-5 text-2xl font-normal leading-snug ${ink.strong}`}
                style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
              >
                {s.title}
              </h3>
              <p className={`mt-3 text-[15px] leading-relaxed ${ink.muted}`}>{s.body}</p>
            </li>
          ))}
        </ol>
      </Wrap>
    </section>
  );
}
