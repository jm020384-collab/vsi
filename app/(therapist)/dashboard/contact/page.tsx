import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ink } from "@/components/preview/vsi/theme";
import { ContactSettingsForm } from "@/components/dashboard/contact-settings-form";
import { SocialSupportSettingsForm } from "@/components/dashboard/social-support-form";

export const metadata: Metadata = { title: "Контакт і доступність · Кабінет фахівця" };

export default async function ContactSettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const therapist = await prisma.therapistProfile.findUnique({
    where: { userId: session.user.id },
    select: {
      acceptingNewClients: true,
      acceptsRequestsViaVsi: true,
      offersSupervision: true,
      offersGroupWork: true,
      sessionFormat: true,
      participatesInSocialSupport: true,
      socialSupportDays: true,
      socialSupportDayParts: true,
      socialSupportMinRate: true,
      socialSupportCurrency: true,
      languages: { include: { language: true } },
    },
  });

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#5C6672]">
        Контакт і доступність
      </p>
      <h1
        className={cn("mt-3 text-3xl font-normal sm:text-4xl", ink.strong)}
        style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
      >
        Як з вами зв'язуватися
      </h1>
      <p className={cn("mt-3 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
        Формат зустрічей і мови роботи редагуються в{" "}
        <a href="/dashboard/profile" className="underline">
          анкеті профілю
        </a>
        . Тут — лише швидкі перемикачі доступності.
      </p>

      {therapist && (
        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
          <div className="flex items-center gap-2">
            <dt className={ink.soft}>Формат:</dt>
            <dd className={ink.body}>
              {
                { ONLINE: "Онлайн", OFFLINE: "Очно", BOTH: "Онлайн і очно" }[
                  therapist.sessionFormat
                ]
              }
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className={ink.soft}>Мови:</dt>
            <dd className={ink.body}>
              {therapist.languages.map((l) => l.language.nameUk).join(", ") || "—"}
            </dd>
          </div>
        </dl>
      )}

      {therapist ? (
        <>
          <ContactSettingsForm
            initial={{
              acceptingNewClients: therapist.acceptingNewClients,
              acceptsRequestsViaVsi: therapist.acceptsRequestsViaVsi,
              offersSupervision: therapist.offersSupervision,
              offersGroupWork: therapist.offersGroupWork,
            }}
          />

          <section className="mt-12">
            <h2
              className={cn("text-2xl font-normal", ink.strong)}
              style={{ fontFamily: "var(--vsi-serif), Georgia, serif" }}
            >
              Соціальна підтримка
            </h2>
            <p className={cn("mt-2 max-w-lg text-[15px] leading-relaxed", ink.muted)}>
              Програма VSI для людей, які потребують допомоги, але мають обмежені фінансові
              можливості. Участь добровільна.
            </p>
            <SocialSupportSettingsForm
              initial={{
                participates: therapist.participatesInSocialSupport,
                days: therapist.socialSupportDays,
                dayParts: therapist.socialSupportDayParts,
                minRate:
                  therapist.socialSupportMinRate == null
                    ? null
                    : Math.round(therapist.socialSupportMinRate / 100),
                currency: therapist.socialSupportCurrency,
              }}
            />
          </section>
        </>
      ) : (
        <p className={cn("mt-8 text-[15px]", ink.muted)}>
          Спершу заповніть{" "}
          <a href="/dashboard/profile" className="underline">
            анкету профілю
          </a>
          .
        </p>
      )}
    </div>
  );
}
