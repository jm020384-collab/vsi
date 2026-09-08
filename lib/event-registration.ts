/**
 * Чи приймає подія нових учасників.
 *
 * Дві незалежні причини перестати приймати: ведучий закрив запис вручну
 * або скінчилися місця. Логіка живе окремим модулем, бо потрібна і на
 * сервері (дії реєстрації), і в рендері сторінок — а файл із "use server"
 * не може експортувати нічого, крім асинхронних функцій.
 */
export function acceptsRegistrations(
  event: { registrationOpen: boolean; seatsTotal: number | null },
  registeredCount: number,
): boolean {
  if (!event.registrationOpen) return false;
  if (event.seatsTotal !== null && registeredCount >= event.seatsTotal) return false;
  return true;
}

/** Чому саме запис закритий — для повідомлення поруч із кнопкою. */
export function registrationClosedReason(
  event: { registrationOpen: boolean; seatsTotal: number | null },
  registeredCount: number,
): "closed" | "full" | null {
  if (!event.registrationOpen) return "closed";
  if (event.seatsTotal !== null && registeredCount >= event.seatsTotal) return "full";
  return null;
}
