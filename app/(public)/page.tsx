import { Hero } from "@/components/preview/vsi/sections/hero";
import { ThemeCircles } from "@/components/preview/vsi/sections/theme-circles";
import { SpecialistsRow } from "@/components/preview/vsi/sections/specialists-row";
import { TextsRow } from "@/components/preview/vsi/sections/texts-row";
import { ForProfessionals } from "@/components/preview/vsi/sections/for-professionals";
import { EventsRow } from "@/components/preview/vsi/sections/events-row";
import { Approach } from "@/components/preview/vsi/sections/approach";
import { HowToChoose } from "@/components/preview/vsi/sections/how-to-choose";
import { QuoteBand } from "@/components/preview/vsi/sections/quote-band";
import { Ethics } from "@/components/preview/vsi/sections/ethics";
import { Closing } from "@/components/preview/vsi/sections/closing";
import { PaperTexture } from "@/components/preview/vsi/decor";
import { loadTherapistsCached } from "@/lib/therapists";

/**
 * Головна сторінка «vsi» — за макетом користувача.
 *
 * Порядок згори: знайомство (hero з двома входами), теми, фахівці,
 * тексти, темна смуга для фахівців, найближчі події. Далі — довші
 * пояснювальні блоки (підхід, як обрати, цитата, етика), яких у макеті
 * немає, але вони несуть реальний зміст, тож лишені нижче за основним
 * потоком. Завершує сторінку слоган бренду.
 */
export default async function HomePage() {
  const therapists = await loadTherapistsCached();

  return (
    <div className="relative">
      {/* Зерно теплого паперу поверх сторінки */}
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <PaperTexture className="!fixed" />
      </div>

      <div className="relative z-[2]">
        <Hero />
        <ThemeCircles />
        <SpecialistsRow therapists={therapists} />
        <TextsRow />
        <ForProfessionals />
        <EventsRow />
        <Approach />
        <HowToChoose />
        <QuoteBand />
        <Ethics />
        <Closing />
      </div>
    </div>
  );
}
