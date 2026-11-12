import Image from "next/image";

import { Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { GlassPanel } from "../decor";

/**
 * Іконки намальовані на власному темно-синьому тлі (кути близько
 * #071f41), тож секція тримає саме цей глибокий синій, а не світліший
 * #1C3557: інакше під кожною іконкою читався б темний квадрат.
 */
const PILLARS = [
  {
    icon: "/brand/motifs/ethics-privacy.webp",
    title: "Конфіденційність за замовчуванням",
    body: "Зміст сесій не розголошується. Винятки — лише ті, що прямо передбачені законом і про які вас попереджають на першій зустрічі.",
  },
  {
    icon: "/brand/motifs/ethics-credentials.webp",
    title: "Підтверджена кваліфікація",
    body: "Дипломи, години особистого аналізу, супервізійний стаж і членство у спільнотах перевіряються до публікації профілю.",
  },
  {
    icon: "/brand/motifs/ethics-supervision.webp",
    title: "Обов'язкова супервізія",
    body: "Кожен фахівець платформи регулярно виносить свою роботу на супервізію. Це умова присутності на vsi.",
  },
  {
    icon: "/brand/motifs/ethics-feedback.webp",
    title: "Канал зворотного зв'язку",
    body: "Якщо межі порушено, ви можете звернутися до етичної комісії. Кожне звернення розглядається, відповідь надається письмово.",
  },
];

/**
 * Квадрат файлу розчиняється в тлі секції. Малюнок займає середину,
 * тож тримаємо його щільним до 82% радіуса і гасимо лише самий край —
 * інакше золота гілка ліворуч почала б бліднути.
 */
const FADE_TO_BACKDROP = {
  maskImage: "radial-gradient(closest-side circle at 50% 50%, #000 82%, transparent 100%)",
  WebkitMaskImage: "radial-gradient(closest-side circle at 50% 50%, #000 82%, transparent 100%)",
} as const;

export function Ethics() {
  return (
    <section id="ethics" className="relative overflow-hidden bg-[#142744]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 85% 15%, rgba(233,222,206,0.10) 0%, transparent 62%)",
        }}
      />

      <Wrap className="relative py-10 lg:py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          <div>
            <Eyebrow tone="dark">Етика і безпека</Eyebrow>
            <SectionTitle tone="dark" className="mt-6">
              Довіра — це процедура, а не обіцянка
            </SectionTitle>
            <Lead tone="dark" className="mt-6">
              Терапія працює лише там, де є безпека. Тому ми описуємо правила прямо: що захищено,
              ким перевірено і що робити, якщо щось пішло не так.
            </Lead>

            <GlassPanel tone="dark" className="mt-8 p-6">
              <p className="text-sm leading-relaxed text-[#D6D3DD]">
                <span className="font-medium text-[#F8F4EC]">Кризова допомога.</span> Платформа не
                працює з невідкладними станами. Якщо є загроза життю — зверніться до екстреної
                допомоги за номером{" "}
                <span className="whitespace-nowrap font-medium text-[#F8F4EC]">103</span> або на
                цілодобову лінію запобігання самогубствам{" "}
                <span className="whitespace-nowrap font-medium text-[#F8F4EC]">7333</span>.
              </p>
            </GlassPanel>
          </div>

          {/*
            Одна рамка навколо всіх чотирьох пунктів, без внутрішніх ліній:
            раніше клітинки розділяло мереживо в один піксель, на макеті
            його немає. Рамка без заливки — щоб іконки лягали просто на
            тло секції й не утворювали видимих плиток.
          */}
          <ul className="grid gap-x-10 gap-y-12 rounded-[28px] border border-[#F8F4EC]/15 p-8 sm:grid-cols-2 lg:p-10">
            {PILLARS.map(({ icon, title, body }) => (
              <li key={title}>
                <Image
                  src={icon}
                  alt=""
                  aria-hidden
                  width={1254}
                  height={1254}
                  sizes="160px"
                  className="-mb-2 -ml-2 -mt-3 h-[128px] w-[128px]"
                  style={FADE_TO_BACKDROP}
                />
                <h3
                  className="mt-3 text-xl font-normal leading-snug text-[#F8F4EC]"
                  style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
                >
                  {title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#C9C7D1]">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}
