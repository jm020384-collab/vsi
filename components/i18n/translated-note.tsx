import { cn } from "@/lib/utils";

/**
 * Позначка на сторінках, де показано переклад слів фахівця.
 *
 * Читач має знати, що це не авторські формулювання: у психотерапії
 * відтінок слова важить, а відповідає автор за свій оригінал. Напис
 * російський завжди — перекладів іншими мовами немає.
 */
export function TranslatedNote({ show, className }: { show: boolean; className?: string }) {
  if (!show) return null;
  return (
    <p className={cn("text-[13px] italic text-[#5C6672]", className)} lang="ru">
      Перевод с украинского
    </p>
  );
}
