import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.app";

interface BuildMetadataOptions {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image = "/og-image.png",
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${APP_URL}/${locale}${normalizedPath}`;

  const alternateLanguages: Record<string, string> = {};

  for (const loc of locales) {
    alternateLanguages[loc] = `${APP_URL}/${loc}${normalizedPath}`;
  }

  // Extra hreflang variants
  alternateLanguages["en-GB"] = `${APP_URL}/en${normalizedPath}`;
  alternateLanguages["en-AE"] = `${APP_URL}/en${normalizedPath}`;
  alternateLanguages["pt-PT"] = `${APP_URL}/pt${normalizedPath}`;
  alternateLanguages["pt-BR"] = `${APP_URL}/pt${normalizedPath}`;
  alternateLanguages["x-default"] = `${APP_URL}/fr${normalizedPath}`;

  return {
    title,
    description,
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Pawmedic",
      locale,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function buildPageTitle(pageTitle: string): string {
  return `${pageTitle} | Pawmedic`;
}
