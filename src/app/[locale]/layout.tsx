import type { Metadata } from "next";
import { Fraunces, Poppins, DM_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";
import { locales, type Locale } from "@/i18n/config";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-dm-mono",
  weight: ["300", "400", "500"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "Pawmedic — La santé de votre animal, enfin claire",
    template: "%s | Pawmedic",
  },
  description:
    "Diagnostic IA instantané, carnet de santé numérique et déchiffrage d'ordonnances pour chiens et chats.",
  keywords: ["santé animale", "vétérinaire", "diagnostic IA", "chien", "chat", "pawmedic"],
  authors: [{ name: "Pawmedic" }],
  creator: "Pawmedic",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.app"),
  icons: {
    icon: "/favicon.ico",
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale} className={`${fraunces.variable} ${poppins.variable} ${dmMono.variable}`}>
        <body className="font-sans bg-cream text-ink antialiased">
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#1a1a18",
                  color: "#fafaf8",
                  border: "1px solid #8a8778",
                  fontFamily: "var(--font-dm-sans)",
                },
              }}
            />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
