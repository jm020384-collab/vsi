import { ArrowRight } from "lucide-react";

import { ButtonLink, Eyebrow, SectionTitle, Wrap } from "../ui";
import { TherapistCard } from "../therapist-card";
import { THERAPISTS } from "../data";

const FEATURED_COUNT = 4;

/**
 * Тизер на головній — не повний каталог. Фільтри й повний список
 * лишаються на /therapists; тут лише запрошення туди зазирнути.
 */
export function Therapists() {
  const featured = THERAPISTS.slice(0, FEATURED_COUNT);

  return (
    <section id="therapists" className="bg-[#F8F4EC]">
      <Wrap className="py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>Рекомендовані фахівці</Eyebrow>
            <SectionTitle className="mt-6">Кожен профіль проходить ручну перевірку</SectionTitle>
          </div>

          <ButtonLink href="/therapists" variant="outline" className="shrink-0">
            Усі фахівці
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((t, i) => (
            <TherapistCard key={t.id} therapist={t} seed={i} />
          ))}
        </div>
      </Wrap>
    </section>
  );
}
