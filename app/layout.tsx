import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { JsonLd, ORGANIZATION_ID, SITE_URL } from "@/components/seo/json-ld";
import { PageTracker } from "@/components/analytics/page-tracker";
import { auth } from "@/auth";
import { BRAND, SITE_NAME, SITE_DESCRIPTION } from "@/lib/brand";

import "./globals.css";

const sans = Inter({
  // latin-ext потрібен знаку vsi: у ньому живе безкрапкова «ı» (U+0131)
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_NAME} · ${BRAND.tagline}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "аналітична психотерапія",
    "юнгіанська терапія",
    "психоаналіз",
    "психотерапевт Україна",
    "пошук психолога",
    "індивідуація",
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: { telephone: false },
  // «./» означає «адреса саме цієї сторінки»: пошуковик знає, яка з копій
  // (з www, з параметрами реклами) основна.
  alternates: { canonical: "./" },
  // Заголовок і опис прев'ю навмисно не задані: тоді кожна сторінка бере
  // свої, а не однакові на весь сайт.
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: SITE_NAME,
    url: "./",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: BRAND.themeColor.background },
    { media: "(prefers-color-scheme: dark)", color: BRAND.themeColor.dark },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="uk" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        {/*
          storageKey навмисно новий: у старому ключі в багатьох уже
          лежить "system" з попередньої конфігурації, і next-themes
          застосовує його як клас навіть при enableSystem={false} —
          сторінка отримувала невалідний клас "system" замість light.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="vsi-theme"
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
            <Toaster richColors closeButton position="top-center" />
            <PageTracker />
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Organization",
                    "@id": ORGANIZATION_ID,
                    name: SITE_NAME,
                    url: SITE_URL,
                    description: SITE_DESCRIPTION,
                    logo: `${SITE_URL}/icons/icon-512.png`,
                    sameAs: ["https://www.facebook.com/profile.php?id=61593751903159"],
                  },
                  {
                    "@type": "WebSite",
                    name: SITE_NAME,
                    url: SITE_URL,
                    inLanguage: "uk",
                    publisher: { "@id": ORGANIZATION_ID },
                  },
                ],
              }}
            />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
