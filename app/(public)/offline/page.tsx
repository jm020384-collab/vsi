import type { Metadata } from "next";
import Link from "@/components/i18n/link";
import { WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, tr } = await getI18n();
  return pageMetadata(locale, "/offline", {
    title: tr("Офлайн"),
  });
}

export default async function OfflinePage() {
  const { tr } = await getI18n();
  return (
    <div className="container max-w-md py-16 text-center">
      <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
      <h1 className="mt-4 text-3xl font-semibold">{tr("Немає інтернету")}</h1>
      <p className="mt-3 text-muted-foreground">
        {tr(
          "Ви офлайн. Раніше переглянуті профілі та статті можуть бути доступні. Спробуйте оновити сторінку після відновлення з'єднання.",
        )}
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">{tr("На головну")}</Link>
        </Button>
      </div>
    </div>
  );
}
