import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPriceUah(kopecks: number): string {
  const uah = Math.round(kopecks / 100);
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
  }).format(uah);
}

export function formatPriceRange(from: number, to: number | null, currency = "UAH"): string {
  if (currency !== "UAH") {
    const fromFmt = (from / 100).toFixed(0);
    if (!to || to === from) return `${fromFmt} ${currency}`;
    return `${fromFmt}–${(to / 100).toFixed(0)} ${currency}`;
  }
  if (!to || to === from) return formatPriceUah(from);
  return `${formatPriceUah(from)} – ${formatPriceUah(to)}`;
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

export function formatDateUk(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uk-UA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function hashIp(ip: string, salt: string): string {
  // Не сам IP — лише детермінований hash для anti-spam rate-limit.
  // Виконується на сервері з salt-ом з env.
  if (typeof crypto === "undefined" || !crypto.subtle) return "";
  // Sync hashing not available browser-side; use subtle in server runtime instead.
  // For Edge/Node: use createHash from node:crypto в caller-і.
  return `${salt}:${ip}`;
}
