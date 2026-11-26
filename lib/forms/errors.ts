/**
 * Один рядок про все, що завадило зберегти форму.
 *
 * Помилку біля поля легко не помітити: форма довга, а кнопка внизу.
 * Крім того, не кожне поле має власний підпис помилки. Тому біля кнопки
 * перелічуємо все — з назвою поля, як вона написана на формі.
 */
export function describeFieldErrors(
  lead: string,
  fieldErrors: Record<string, string[] | undefined>,
  labels: Record<string, string>,
): string {
  const parts = Object.entries(fieldErrors).flatMap(([field, messages]) =>
    messages?.[0] ? [`${labels[field] ?? field} — ${messages[0]}`] : [],
  );
  return parts.length ? `${lead}: ${parts.join("; ")}.` : `${lead}.`;
}

/** Браузер надсилає переноси як \r\n — без цього вони рахувалися б двічі. */
export function unixLines<T>(value: T): T | string {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n") : value;
}
