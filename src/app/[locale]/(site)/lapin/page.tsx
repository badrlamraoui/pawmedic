import type { Metadata } from "next";
import { getArticlesByCategory, CATEGORY_META } from "@/lib/articles";
import CategoryHubContent from "@/components/site/CategoryHubContent";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";
const CATEGORY = "lapin" as const;

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ theme?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const meta = CATEGORY_META[CATEGORY];
  return {
    title: `${meta.label} — Guides & conseils complets — Pawmedic`,
    description: `Tous nos guides ${meta.label.toLowerCase()} : santé, alimentation, races, comportement, élevage. Conseils vétérinaires pour votre ${meta.label.toLowerCase()}.`,
    alternates: { canonical: `${APP_URL}/${locale}/${CATEGORY}` },
    openGraph: {
      title: `${meta.label} — Pawmedic`,
      description: meta.description,
      type: "website",
      locale: "fr_FR",
      siteName: "Pawmedic",
      images: [{ url: `${meta.photo.split("?")[0]}?auto=format&fit=crop&w=1200&h=630&q=85` }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LapinPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { theme } = await searchParams;
  const allArticles = getArticlesByCategory(CATEGORY);
  const meta = CATEGORY_META[CATEGORY];

  return (
    <CategoryHubContent
      locale={locale}
      category={CATEGORY}
      meta={meta}
      allArticles={allArticles}
      selectedTheme={theme}
    />
  );
}
