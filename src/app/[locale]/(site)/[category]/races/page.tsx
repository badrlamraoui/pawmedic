import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  getBreedsByCategory,
  SIZE_LABELS,
  CARE_LEVEL_LABELS,
  EXERCISE_LABELS,
  type BreedCategory,
} from "@/lib/breeds";
import { getCanonicalCategory } from "@/lib/categories";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

const BREED_CATEGORIES: BreedCategory[] = ["chien", "chat"];

interface PageProps {
  params: Promise<{ locale: string; category: string }>;
}

export async function generateStaticParams() {
  return BREED_CATEGORIES.flatMap((cat) =>
    ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({
      locale,
      category: cat,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category } = await params;
  const canonical = getCanonicalCategory(category, locale) as BreedCategory;
  const isChien = canonical === "chien";
  const noun = isChien ? "chien" : "chat";
  const nounPlural = isChien ? "chiens" : "chats";
  return {
    title: `Races de ${nounPlural} — Guide complet par race | Pawmedic`,
    description: `Découvrez toutes les races de ${nounPlural} : caractère, taille, espérance de vie, maladies prédisposées, entretien. Guide complet validé par des vétérinaires.`,
    alternates: { canonical: `${APP_URL}/${locale}/${category}/races` },
    robots: { index: true, follow: true },
  };
}

export default async function BreedIndexPage({ params }: PageProps) {
  const { locale, category } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const canonical = getCanonicalCategory(category, locale) as BreedCategory;
  const breeds = getBreedsByCategory(canonical);
  const isChien = canonical === "chien";
  const noun = isChien ? "chien" : "chat";
  const nounPlural = isChien ? "chiens" : "chats";
  const emoji = isChien ? "🐕" : "🐱";

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-8 flex items-center gap-1.5">
        <Link href={`/${locale}`} className="hover:text-[#0d9488] transition-colors">{t("breadcrumb.home")}</Link>
        <span>/</span>
        <Link href={`/${locale}/${category}`} className="hover:text-[#0d9488] transition-colors capitalize">{canonical}</Link>
        <span>/</span>
        <span className="text-ink">{t("breeds.breadcrumb")}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="text-4xl mb-3">{emoji}</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
          {t("breeds.allBreeds")} <span className="text-[#0d9488]">{nounPlural}</span>
        </h1>
        <p className="text-base text-muted max-w-2xl leading-relaxed">
          {breeds.length} {t("breeds.documented")} : {t("breeds.description")}
        </p>
      </div>

      {/* Breed grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {breeds.map((breed) => (
          <Link
            key={breed.slug}
            href={`/${locale}/${category}/races/${breed.slug}`}
            className="group block rounded-2xl border border-border overflow-hidden hover:border-[#0d9488]/40 hover:shadow-md bg-white transition-all"
          >
            {/* Photo */}
            <div className="relative h-40 overflow-hidden bg-cream">
              <img
                src={`${breed.photo}?auto=format&fit=crop&w=400&h=200&q=75`}
                alt={breed.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Info */}
            <div className="p-4">
              <h2 className="text-sm font-bold text-ink group-hover:text-[#0d9488] transition-colors mb-1">
                {breed.name}
              </h2>
              <p className="text-xs text-muted mb-3">{breed.origin}</p>

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider bg-cream border border-border rounded-full px-2 py-0.5 text-muted">
                  {SIZE_LABELS[breed.size].split(" ")[0] + " " + SIZE_LABELS[breed.size].split(" ")[1]}
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider bg-cream border border-border rounded-full px-2 py-0.5 text-muted">
                  {breed.lifespanMin}–{breed.lifespanMax} ans
                </span>
                <span
                  className="text-[9px] font-mono uppercase tracking-wider rounded-full px-2 py-0.5"
                  style={{
                    background: breed.careLevel === "facile" ? "#f0fdf4" : breed.careLevel === "modere" ? "#fefce8" : "#fff7ed",
                    color: breed.careLevel === "facile" ? "#16a34a" : breed.careLevel === "modere" ? "#ca8a04" : "#ea580c",
                    border: `1px solid ${breed.careLevel === "facile" ? "#bbf7d0" : breed.careLevel === "modere" ? "#fde68a" : "#fed7aa"}`,
                  }}
                >
                  {CARE_LEVEL_LABELS[breed.careLevel]}
                </span>
              </div>

              {/* Diseases count */}
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">
                  {breed.commonDiseases.length} maladie{breed.commonDiseases.length > 1 ? "s" : ""} prédisposante{breed.commonDiseases.length > 1 ? "s" : ""}
                </span>
                <svg className="w-4 h-4 text-muted group-hover:text-[#0d9488] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
