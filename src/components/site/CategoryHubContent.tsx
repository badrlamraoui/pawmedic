import Link from "next/link";
import ArticleCard from "@/components/landing/ArticleCard";
import Breadcrumb from "@/components/site/Breadcrumb";
import type { ArticleFrontmatter, ArticleCategory } from "@/lib/articles";
import { getBreedsByCategory, type BreedCategory } from "@/lib/breeds";

const THEMES = [
  { key: "sante", label: "Santé", emoji: "🩺" },
  { key: "alimentation", label: "Alimentation", emoji: "🍖" },
  { key: "races", label: "Races", emoji: "🧬" },
  { key: "comportement", label: "Comportement", emoji: "🧠" },
  { key: "elevage", label: "Élevage", emoji: "🐣" },
  { key: "sorties", label: "Sorties", emoji: "🏃" },
  { key: "medicaments", label: "Médicaments", emoji: "💊" },
  { key: "veterinaire", label: "Vétérinaire", emoji: "🏥" },
  { key: "pedigree", label: "Pedigree", emoji: "📋" },
  { key: "toilettage", label: "Toilettage", emoji: "🛁" },
  { key: "voyages", label: "Voyages", emoji: "✈️" },
  { key: "jeux", label: "Jeux", emoji: "🎾" },
] as const;

interface CategoryMeta {
  label: string;
  emoji: string;
  description: string;
  photo: string;
}

interface CategoryHubContentProps {
  locale: string;
  category: ArticleCategory;
  meta: CategoryMeta;
  allArticles: ArticleFrontmatter[];
  selectedTheme?: string;
}

export default function CategoryHubContent({
  locale,
  category,
  meta,
  allArticles,
  selectedTheme,
}: CategoryHubContentProps) {
  // Filter articles by selected theme (if any)
  const displayedArticles = selectedTheme
    ? allArticles.filter((a) => a.theme === selectedTheme)
    : allArticles;

  // Build theme chips: only show themes that have at least 1 article in this category
  const availableThemes = THEMES.map((t) => ({
    ...t,
    count: allArticles.filter((a) => a.theme === t.key).length,
  })).filter((t) => t.count > 0);

  // Count unique themes in this category
  const themesCount = availableThemes.length;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Guides ${meta.label} — Pawmedic`,
      description: meta.description,
      url: `https://pawmedic.fr/${locale}/${category}`,
      publisher: {
        "@type": "Organization",
        name: "Pawmedic",
        url: "https://pawmedic.fr",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: `https://pawmedic.fr/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: meta.label,
          item: `https://pawmedic.fr/${locale}/${category}`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-5 py-10">
        {/* Hero banner */}
        <div className="relative h-56 overflow-hidden rounded-2xl mb-8">
          <img
            src={`${meta.photo.split("?")[0]}?auto=format&fit=crop&w=1200&q=85`}
            alt={meta.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-3xl mb-1">{meta.emoji}</p>
            <h1 className="text-2xl sm:text-3xl font-serif italic font-bold">
              Guides &amp; conseils {meta.label.toLowerCase()}
            </h1>
            <p className="text-sm text-white/80 mt-1 max-w-md">{meta.description}</p>
          </div>
        </div>

        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Accueil", href: `/${locale}` },
            { label: meta.label },
          ]}
        />

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-2xl font-bold text-ink">{allArticles.length}</span>
            <span className="text-xs text-muted">guides disponibles</span>
          </div>
          {themesCount > 0 && (
            <>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xl font-bold text-ink">{themesCount}</span>
                <span className="text-xs text-muted">
                  {themesCount === 1 ? "thème" : "thèmes"} couverts
                </span>
              </div>
            </>
          )}
          {allArticles.length > 0 && (
            <>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xl font-bold text-ink">
                  {allArticles.reduce((acc, a) => acc + a.readingTime, 0)}
                </span>
                <span className="text-xs text-muted">min de lecture au total</span>
              </div>
            </>
          )}
          {allArticles[0]?.publishedAt && (
            <>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted">Mise à jour :</span>
                <span className="font-mono text-xs font-medium text-ink">
                  {new Date(allArticles[0].publishedAt).toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Breeds block — only for chien and chat, and only when no theme is selected or when theme=races */}
        {(category === "chien" || category === "chat") && (!selectedTheme || selectedTheme === "races") && (() => {
          const breeds = getBreedsByCategory(category as BreedCategory).slice(0, 8);
          if (breeds.length === 0) return null;
          return (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-ink flex items-center gap-2">
                  <span className="text-[#0d9488]">🧬</span>
                  Races de {category}
                </h2>
                <Link
                  href={`/${locale}/${category}/races`}
                  className="text-xs text-[#0d9488] font-semibold hover:underline flex items-center gap-1"
                >
                  Voir toutes les races
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {breeds.map((breed) => (
                  <Link
                    key={breed.slug}
                    href={`/${locale}/${category}/races/${breed.slug}`}
                    className="group block rounded-xl border border-border overflow-hidden hover:border-[#0d9488]/40 hover:shadow-sm bg-white transition-all"
                  >
                    <div className="h-24 overflow-hidden">
                      <img
                        src={`${breed.photo}?auto=format&fit=crop&w=200&h=100&q=70`}
                        alt={breed.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-xs font-semibold text-ink group-hover:text-[#0d9488] px-2.5 py-2 transition-colors leading-tight">
                      {breed.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Theme filter chips — only render if themes exist */}
        {availableThemes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href={`/${locale}/${category}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !selectedTheme
                  ? "bg-[#0d9488] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Tous ({allArticles.length})
            </Link>
            {availableThemes.map((t) => (
              <Link
                key={t.key}
                href={`/${locale}/${category}?theme=${t.key}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTheme === t.key
                    ? "bg-[#0d9488] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.emoji} {t.label} ({t.count})
              </Link>
            ))}
          </div>
        )}

        {/* Active theme heading */}
        {selectedTheme && availableThemes.length > 0 && (
          <div className="mb-6">
            {(() => {
              const themeInfo = availableThemes.find((t) => t.key === selectedTheme);
              return themeInfo ? (
                <h2 className="text-lg font-semibold text-ink">
                  {themeInfo.emoji} {themeInfo.label} — {displayedArticles.length}{" "}
                  {displayedArticles.length === 1 ? "guide" : "guides"}
                </h2>
              ) : null;
            })()}
          </div>
        )}

        {/* Articles grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                slug={article.slug}
                readingTime={article.readingTime}
                publishedAt={article.publishedAt}
                locale={locale}
                theme={article.theme}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted text-sm mb-4">
              Aucun guide disponible pour ce thème actuellement.
            </p>
            <Link
              href={`/${locale}/${category}`}
              className="text-sm text-[#0d9488] font-medium hover:underline"
            >
              Voir tous les guides {meta.label.toLowerCase()}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
