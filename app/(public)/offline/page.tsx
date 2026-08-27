import Link from "next/link";
import { WifiOff } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Офлайн" };

export default function OfflinePage() {
  return (
    <div className="container max-w-md py-24 text-center">
      <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
      <h1 className="mt-6 text-3xl font-semibold">Немає інтернету</h1>
      <p className="mt-3 text-muted-foreground">
        Ви офлайн. Раніше переглянуті профілі та статті можуть бути доступні. Спробуйте оновити
        сторінку після відновлення з'єднання.
      </p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">На головну</Link>
        </Button>
      </div>
    </div>
  );
}
