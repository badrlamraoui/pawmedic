import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getAllArticles, getArticlesBySpecies } from "@/lib/articles";
import { getVetForArticle } from "@/lib/vets";
import { getCategorySlug } from "@/lib/categories";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

const SUBSPECIES = {
  hamster: {
    label: "Hamster",
    emoji: "🐹",
    photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
    description: "Petit rongeur nocturne très populaire comme animal de compagnie, le hamster nécessite un environnement adapté et des soins spécifiques pour rester en bonne santé.",
    intro: "Le hamster est l'un des rongeurs domestiques les plus populaires, particulièrement apprécié pour sa facilité d'entretien apparente. Cependant, il a des besoins spécifiques souvent méconnus : espace d'habitat minimum de 1 m², roue adaptée à sa taille, alimentation variée et environnement d'éveil nocturne.",
  },
  "cochon-inde": {
    label: "Cochon d'Inde",
    emoji: "🐾",
    photo: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
    description: "Animal social vivant en groupe, le cochon d'Inde est un compagnon bruyant et expressif, idéal pour les familles. Il nécessite une alimentation riche en vitamine C.",
    intro: "Le cochon d'Inde (cobaye) est un animal grégaire qui vit mal la solitude — il doit toujours être élevé par paire ou en groupe. Sa particularité : il ne synthétise pas la vitamine C (comme l'homme) et doit en recevoir quotidiennement dans son alimentation. Poivrons, persil et herbes fraîches sont ses meilleurs amis.",
  },
  souris: {
    label: "Souris",
    emoji: "🐭",
    photo: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119",
    description: "Vive et curieuse, la souris domestique est facile à apprivoiser et à observer. Animal social, elle préfère vivre en groupe de même sexe.",
    intro: "La souris domestique est un animal fascinant, intelligent et extrêmement curieux. Sociale par nature, elle doit vivre en groupe (femelles ensemble, mâles séparés pour éviter les conflits). Sa durée de vie courte (2-3 ans) en fait un animal de compagnie accessible mais qui demandera un suivi vétérinaire attentif si des problèmes de santé apparaissent.",
  },
  rat: {
    label: "Rat",
    emoji: "🐀",
    photo: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91",
    description: "Très intelligent et affectueux, le rat domestique est souvent considéré comme l'un des rongeurs les plus faciles à apprivoiser et les plus proches de l'homme.",
    intro: "Le rat domestique est sans doute le rongeur de compagnie le plus proche de l'humain en termes d'intelligence et de capacité à créer des liens affectifs. Il reconnaît son propriétaire, peut apprendre son prénom et de nombreux tours. Animal social, il doit être élevé en paires ou groupes. Sa durée de vie (2-4 ans) est courte mais intense.",
  },
} as const;

type SubspeciesKey = keyof typeof SUBSPECIES;

interface PageProps {
  params: Promise<{ locale: string; subspecies: string }>;
}

export async function generateStaticParams() {
  const subspeciesKeys = Object.keys(SUBSPECIES) as SubspeciesKey[];
  return subspeciesKeys.flatMap((subspecies) =>
    ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({
      locale,
      subspecies,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subspecies, locale } = await params;
  if (!(subspecies in SUBSPECIES)) return {};
  const sp = SUBSPECIES[subspecies as SubspeciesKey];
  return {
    title: `${sp.label} — Soins, santé et alimentation | Pawmedic`,
    description: `Guide complet sur le ${sp.label.toLowerCase()} : habitat, alimentation, santé et bien-être. Conseils validés par nos vétérinaires.`,
    alternates: { canonical: `${APP_URL}/${locale}/rongeurs/${subspecies}` },
    robots: { index: true, follow: true },
  };
}

export default async function RongeurSubspeciesPage({ params }: PageProps) {
  const { locale, subspecies } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  if (!(subspecies in SUBSPECIES)) notFound();

  const sp = SUBSPECIES[subspecies as SubspeciesKey];

  // Filter articles by species field (hamster, cochon-inde, souris, rat)
  const speciesArticles = getArticlesBySpecies(subspecies, locale);

  // Fallback: show all rongeur articles if no specific ones tagged with species
  const rongeurArticles = speciesArticles.length > 0
    ? speciesArticles
    : getAllArticles(locale).filter((a) => a.category === "rongeurs").slice(0, 12);

  const vet = getVetForArticle("rongeurs", "sante", subspecies);
  const rongeurCategorySlug = getCategorySlug("rongeurs", locale);

  return (
    <div className="max-w-5xl mx-auto px-5 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted mb-8 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-[#0d9488] transition-colors">{t("breadcrumb.home")}</Link>
        <span>/</span>
        <Link href={`/${locale}/${rongeurCategorySlug}`} className="hover:text-[#0d9488] transition-colors">{t("rodents.title")}</Link>
        <span>/</span>
        <span className="text-ink">{sp.label}</span>
      </nav>

      {/* Hero */}
      <div className="mb-10">
        <div className="relative h-52 rounded-2xl overflow-hidden mb-6">
          <img
            src={`${sp.photo}?auto=format&fit=crop&w=1000&h=300&q=80`}
            alt={sp.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <p className="text-3xl mb-1">{sp.emoji}</p>
            <h1 className="text-2xl sm:text-3xl font-bold">{sp.label}</h1>
          </div>
        </div>

        <p className="text-base text-ink/85 leading-relaxed max-w-3xl mb-4">{sp.intro}</p>

        {/* Vet note */}
        <div className="p-4 rounded-xl border border-[#0d9488]/20 bg-[#f0fdfa]/60 flex gap-3">
          <img
            src={`${vet.photo}?auto=format&fit=crop&crop=faces&w=40&h=40&q=80`}
            alt={vet.name}
            className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
            style={{ border: `2px solid ${vet.color}` }}
          />
          <div>
            <p className="text-xs font-bold text-ink">{vet.name} · {vet.title}</p>
            <p className="text-xs text-muted leading-relaxed mt-0.5">{sp.description}</p>
          </div>
        </div>
      </div>

      {/* Articles */}
      <section>
        <h2 className="text-lg font-bold text-ink mb-5">
          {t("rodents.guides")} {sp.emoji} {sp.label}
        </h2>

        {rongeurArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rongeurArticles.map((article) => {
              const catSlug = getCategorySlug(article.category, locale);
              return (
                <Link
                  key={article.slug}
                  href={`/${locale}/${catSlug}/${article.slug}`}
                  className="group block p-4 rounded-xl border border-border hover:border-[#0d9488]/30 hover:shadow-sm bg-white transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] uppercase font-semibold text-[#0d9488]">
                      {article.theme ?? article.category}
                    </span>
                    <span className="font-mono text-[9px] text-muted">{article.readingTime} min</span>
                  </div>
                  <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-[#0d9488] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-muted mt-1.5 line-clamp-2 leading-relaxed">{article.excerpt}</p>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted text-sm mb-4">{t("rodents.noArticles")}</p>
            <Link
              href={`/${locale}/${rongeurCategorySlug}`}
              className="text-sm text-[#0d9488] font-medium hover:underline"
            >
              {t("rodents.seeAll")}
            </Link>
          </div>
        )}
      </section>

      {/* Other subspecies */}
      <section className="mt-12 pt-8 border-t border-border">
        <h2 className="text-base font-bold text-ink mb-4">{t("rodents.others")}</h2>
        <div className="flex flex-wrap gap-3">
          {(Object.entries(SUBSPECIES) as [SubspeciesKey, typeof SUBSPECIES[SubspeciesKey]][])
            .filter(([key]) => key !== subspecies)
            .map(([key, sub]) => (
              <Link
                key={key}
                href={`/${locale}/rongeurs/${key}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-[#0d9488]/40 bg-white hover:shadow-sm transition-all text-sm font-semibold text-ink hover:text-[#0d9488]"
              >
                <span>{sub.emoji}</span>
                {sub.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
