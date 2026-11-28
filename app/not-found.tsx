import Link from "@/components/i18n/link";
import { Button } from "@/components/ui/button";
import { getI18n } from "@/lib/i18n/server";

export default async function NotFound() {
  const { tr } = await getI18n();
  return (
    <div className="container max-w-md py-16 text-center">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-4 text-muted-foreground">{tr("Сторінку не знайдено.")}</p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">{tr("На головну")}</Link>
        </Button>
      </div>
    </div>
  );
}
