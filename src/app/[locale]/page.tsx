import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import HeroSite from "@/components/site/HeroSite";
import UrgencesBanner from "@/components/site/UrgencesBanner";
import CategorySection from "@/components/site/CategorySection";
import PopularGuidesSection from "@/components/landing/PopularGuidesSection";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Pawmedic — Guides santé pour tous vos animaux",
    description:
      "Guides vétérinaires pour chiens, chats, lapins, oiseaux, rongeurs, reptiles et tous vos animaux domestiques.",
    metadataBase: new URL(APP_URL),
    alternates: {
      canonical: `${APP_URL}/${locale}`,
    },
    openGraph: {
      title: "Pawmedic — Guides santé pour tous vos animaux",
      description:
        "Guides vétérinaires pour chiens, chats, lapins, oiseaux, rongeurs, reptiles et tous vos animaux domestiques.",
      type: "website",
      siteName: "Pawmedic",
    },
    robots: { index: true, follow: true },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSite locale={locale} />
        <UrgencesBanner locale={locale} />
        <PopularGuidesSection locale={locale} />
        <CategorySection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
