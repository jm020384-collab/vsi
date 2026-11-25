/**
 * Структуровані дані schema.org: пошуковики й помічники на основі ШІ
 * читають з них, хто такий фахівець і хто автор статті.
 *
 * Сюди потрапляє те, що фахівці написали самі, тож «<» екрануємо: інакше
 * рядок із «</script>» у назві зламав би сторінку.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
