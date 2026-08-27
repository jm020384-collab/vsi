"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-md py-24 text-center">
      <h1 className="text-3xl font-semibold">Щось пішло не так</h1>
      <p className="mt-3 text-muted-foreground">
        Спробуйте оновити сторінку або повторіть пізніше.
      </p>
      <Button className="mt-6" onClick={reset}>
        Спробувати ще раз
      </Button>
    </div>
  );
}
