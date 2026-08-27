import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container max-w-md py-24 text-center">
      <h1 className="text-5xl font-semibold">404</h1>
      <p className="mt-4 text-muted-foreground">Сторінку не знайдено.</p>
      <div className="mt-8">
        <Button asChild>
          <Link href="/">На головну</Link>
        </Button>
      </div>
    </div>
  );
}
