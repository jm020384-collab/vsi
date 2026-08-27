import Image from "next/image";

import { Eyebrow, Lead, SectionTitle, Wrap } from "../ui";
import { GlassPanel } from "../decor";

/* Фірмові іконки-тайли з public/brand/motifs — золоте мереживо на папері */
const PILLARS = [
  {
    icon: "/brand/motifs/ethics.png",
    title: "Конфіденційність за замовчуванням",
    body: "Зміст сесій не розголошується. Винятки — лише ті, що прямо передбачені законом і про які вас попереджають на першій зустрічі.",
  },
  {
    icon: "/brand/motifs/documents.png",
    title: "Підтверджена кваліфікація",
    body: "Дипломи, години особистого аналізу, супервізійний стаж і членство у спільнотах перевіряються до публікації профілю.",
  },
  {
    icon: "/brand/motifs/profile.png",
    title: "Обов'язкова супервізія",
    body: "Кожен фахівець платформи регулярно виносить свою роботу на супервізію. Це умова присутності на vsi, а не побажання.",
  },
  {
    icon: "/brand/motifs/community.png",
    title: "Канал зворотного зв'язку",
    body: "Якщо межі порушено, ви можете звернутися до етичної комісії. Кожне звернення розглядається, відповідь надходить письмово.",
  },
];

export function Ethics() {
  return (
    <section id="ethics" className="relative overflow-hidden bg-[#1C3557]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 85% 15%, rgba(233,222,206,0.12) 0%, transparent 62%)",
        }}
      />

      <Wrap className="relative py-20 lg:py-28">
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

          <ul className="border-[#F8F4EC]/12 bg-[#F8F4EC]/12 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2">
            {PILLARS.map(({ icon, title, body }) => (
              <li key={title} className="group bg-[#1C3557] p-7">
                {/* Паперовий тайл на синьому — мотив плиток бренд-борду */}
                <span
                  className="inline-block overflow-hidden rounded-xl border border-[#F8F4EC]/15 transition-colors duration-300 group-hover:border-[#B38B49]/60 motion-reduce:transition-none"
                  aria-hidden
                >
                  <Image
                    src={icon}
                    alt=""
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover"
                  />
                </span>
                <h3
                  className="mt-5 text-xl font-normal leading-snug text-[#F8F4EC]"
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
