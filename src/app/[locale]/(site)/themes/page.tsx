import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import Breadcrumb from "@/components/site/Breadcrumb";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

const THEMES = [
  {
    key: "sante",
    label: "Santé & maladies",
    emoji: "🩺",
    desc: "Symptômes, diagnostics, soins d'urgence",
    color: "bg-red-50 border-red-200 hover:border-red-400",
    accent: "text-red-700",
    dot: "bg-red-400",
  },
  {
    key: "alimentation",
    label: "Alimentation",
    emoji: "🍖",
    desc: "Nutrition, régimes, compléments alimentaires",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    accent: "text-orange-700",
    dot: "bg-orange-400",
  },
  {
    key: "races",
    label: "Races",
    emoji: "🧬",
    desc: "Caractère, morphologie, origines des races",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    accent: "text-purple-700",
    dot: "bg-purple-400",
  },
  {
    key: "comportement",
    label: "Comportement",
    emoji: "🧠",
    desc: "Éducation, socialisation, stress",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    accent: "text-blue-700",
    dot: "bg-blue-400",
  },
  {
    key: "elevage",
    label: "Élevage",
    emoji: "🐣",
    desc: "Reproduction, portées, sevrage",
    color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400",
    accent: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  {
    key: "sorties",
    label: "Sorties & activités",
    emoji: "🏃",
    desc: "Sport, balades, voyages avec votre animal",
    color: "bg-lime-50 border-lime-200 hover:border-lime-400",
    accent: "text-lime-700",
    dot: "bg-lime-400",
  },
  {
    key: "medicaments",
    label: "Médicaments",
    emoji: "💊",
    desc: "Traitements, antiparasitaires, posologie",
    color: "bg-teal-50 border-teal-200 hover:border-teal-400",
    accent: "text-teal-700",
    dot: "bg-teal-400",
  },
  {
    key: "veterinaire",
    label: "Vétérinaire",
    emoji: "🏥",
    desc: "Consultations, urgences, coût des soins",
    color: "bg-cyan-50 border-cyan-200 hover:border-cyan-400",
    accent: "text-cyan-700",
    dot: "bg-cyan-400",
  },
  {
    key: "pedigree",
    label: "Pedigree & LOF",
    emoji: "📋",
    desc: "Inscriptions, expositions canines, lignées",
    color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400",
    accent: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  {
    key: "toilettage",
    label: "Toilettage",
    emoji: "🛁",
    desc: "Brossage, bain, coupe de griffes",
    color: "bg-pink-50 border-pink-200 hover:border-pink-400",
    accent: "text-pink-700",
    dot: "bg-pink-400",
  },
  {
    key: "voyages",
    label: "Voyages",
    emoji: "✈️",
    desc: "Transporter son animal, destinations pet-friendly",
    color: "bg-sky-50 border-sky-200 hover:border-sky-400",
    accent: "text-sky-700",
    dot: "bg-sky-400",
  },
  {
    key: "jeux",
    label: "Jeux & activités",
    emoji: "🎾",
    desc: "Enrichissement mental, jouets, activités",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    accent: "text-green-700",
    dot: "bg-green-400",
  },
] as const;

// Species to show as example links per theme card
const SPECIES_EXAMPLES = ["chien", "chat", "lapin", "oiseau", "rongeurs", "reptile"];

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Tous nos thèmes — Races, Santé, Alimentation, Comportement — Pawmedic",
    description:
      "Explorez tous nos sujets : santé animale, alimentation, races, comportement, élevage, sorties. Guides vétérinaires complets pour propriétaires d'animaux.",
    alternates: { canonical: `${APP_URL}/${locale}/themes` },
    openGraph: {
      title: "Tous nos thèmes — Pawmedic",
      description:
        "Explorez tous nos sujets : santé animale, alimentation, races, comportement, élevage, sorties.",
      type: "website",
      locale: "fr_FR",
      siteName: "Pawmedic",
    },
    robots: { index: true, follow: true },
  };
}

export default async function ThemesPage({ params }: PageProps) {
  const { locale } = await params;
  const allArticles = getAllArticles();

  // Compute article count per theme
  const themesWithCount = THEMES.map((t) => ({
    ...t,
    count: allArticles.filter((a) => a.theme === t.key).length,
  }));

  const totalArticles = allArticles.length;
  const themesWithArticles = themesWithCount.filter((t) => t.count > 0).length;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tous nos thèmes — Pawmedic",
      description:
        "Explorez tous nos sujets : santé animale, alimentation, races, comportement, élevage, sorties.",
      url: `${APP_URL}/${locale}/themes`,
      publisher: {
        "@type": "Organization",
        name: "Pawmedic",
        url: APP_URL,
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
          item: `${APP_URL}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Thèmes",
          item: `${APP_URL}/${locale}/themes`,
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
        {/* Page header */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Accueil", href: `/${locale}` },
              { label: "Thèmes" },
            ]}
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight mb-3">
            Tous nos thèmes
          </h1>
          <p className="text-base text-muted leading-relaxed max-w-2xl">
            Retrouvez tous nos guides organisés par sujet : santé, alimentation, comportement,
            élevage et bien plus encore. Sélectionnez un thème pour filtrer les guides par espèce.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-border">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-2xl font-bold text-ink">{totalArticles}</span>
            <span className="text-xs text-muted">guides au total</span>
          </div>
          <div className="w-px h-6 bg-border hidden sm:block" />
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-2xl font-bold text-ink">{THEMES.length}</span>
            <span className="text-xs text-muted">thèmes disponibles</span>
          </div>
          {themesWithArticles > 0 && (
            <>
              <div className="w-px h-6 bg-border hidden sm:block" />
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-2xl font-bold text-[#0d9488]">
                  {themesWithArticles}
                </span>
                <span className="text-xs text-muted">thèmes avec contenu</span>
              </div>
            </>
          )}
        </div>

        {/* Themes grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {themesWithCount.map((theme) => (
            <div
              key={theme.key}
              className={`group relative flex flex-col gap-4 border rounded-2xl p-6 transition-all duration-200 ${theme.color}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" role="img" aria-hidden="true">
                    {theme.emoji}
                  </span>
                  <div>
                    <h2 className={`text-base font-semibold ${theme.accent}`}>{theme.label}</h2>
                    <p className="text-xs text-muted mt-0.5">{theme.desc}</p>
                  </div>
                </div>
                {theme.count > 0 && (
                  <span className={`shrink-0 font-mono text-xs font-bold px-2 py-1 rounded-full bg-white/60 ${theme.accent}`}>
                    {theme.count} guide{theme.count > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {/* Species links */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {SPECIES_EXAMPLES.map((species) => {
                  const hasArticles = allArticles.some(
                    (a) => a.category === species && a.theme === theme.key
                  );
                  if (!hasArticles) return null;
                  const speciesLabels: Record<string, string> = {
                    chien: "Chien",
                    chat: "Chat",
                    lapin: "Lapin",
                    oiseau: "Oiseau",
                    rongeurs: "Rongeurs",
                    reptile: "Reptile",
                  };
                  return (
                    <Link
                      key={species}
                      href={`/${locale}/${species}?theme=${theme.key}`}
                      className={`text-xs px-2.5 py-1 rounded-full bg-white/70 font-medium transition-colors hover:bg-white ${theme.accent}`}
                    >
                      {speciesLabels[species]}
                    </Link>
                  );
                })}
                {theme.count === 0 && (
                  <span className="text-xs text-muted italic">Guides à venir…</span>
                )}
                {theme.count > 0 && (
                  <Link
                    href={`/${locale}/chien?theme=${theme.key}`}
                    className={`ml-auto text-xs font-medium flex items-center gap-1 ${theme.accent} hover:underline`}
                  >
                    Explorer
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA — explore by species */}
        <div className="mt-12 rounded-2xl bg-[#f0fdfa] border border-[#0d9488]/20 px-6 py-8 text-center">
          <p className="text-sm font-semibold text-[#0d9488] uppercase tracking-widest mb-2 font-mono">
            Explorer par espèce
          </p>
          <h3 className="text-xl font-bold text-ink mb-4">
            Choisissez votre animal de compagnie
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { key: "chien", label: "Chien", emoji: "🐕" },
              { key: "chat", label: "Chat", emoji: "🐱" },
              { key: "lapin", label: "Lapin", emoji: "🐰" },
              { key: "oiseau", label: "Oiseau", emoji: "🦜" },
              { key: "rongeurs", label: "Rongeurs", emoji: "🐹" },
              { key: "reptile", label: "Reptile", emoji: "🦎" },
              { key: "poisson", label: "Poisson", emoji: "🐟" },
              { key: "furet", label: "Furet", emoji: "🦡" },
            ].map((species) => (
              <Link
                key={species.key}
                href={`/${locale}/${species.key}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#0d9488]/20 text-sm font-medium text-ink hover:border-[#0d9488]/50 hover:shadow-sm transition-all"
              >
                <span role="img" aria-hidden="true">{species.emoji}</span>
                {species.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
