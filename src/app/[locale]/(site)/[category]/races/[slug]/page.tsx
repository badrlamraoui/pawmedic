import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  BREEDS,
  getBreed,
  getAllBreedSlugs,
  SIZE_LABELS,
  CARE_LEVEL_LABELS,
  EXERCISE_LABELS,
  GROOMING_LABELS,
  PREVALENCE_LABELS,
  PREVALENCE_COLORS,
} from "@/lib/breeds";
import { getVetForArticle } from "@/lib/vets";
import { getCanonicalCategory } from "@/lib/categories";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

interface PageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBreedSlugs();
  return slugs.flatMap((slug) => {
    const breed = BREEDS.find((b) => b.slug === slug)!;
    const cat = breed.category; // "chien" | "chat"
    return ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({
      locale,
      category: cat,
      slug,
    }));
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale, category } = await params;
  const breed = getBreed(slug);
  if (!breed) return {};
  return {
    title: `${breed.name} — Race, caractère, santé & soins | Pawmedic`,
    description: `Tout sur le ${breed.name} : caractère, taille (${breed.weightMale.min}–${breed.weightMale.max} kg), espérance de vie (${breed.lifespanMin}–${breed.lifespanMax} ans), maladies génétiques et conseils d'entretien. Validé par un vétérinaire.`,
    alternates: { canonical: `${APP_URL}/${locale}/${category}/races/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function BreedDetailPage({ params }: PageProps) {
  const { locale, category, slug } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const breed = getBreed(slug);
  if (!breed) notFound();

  // Use getVetForArticle to pick a consistent vet based on category and theme
  const vet = getVetForArticle(breed.category, "races", slug);

  const [bioP1, bioP2] = breed.description.split("\n\n");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${breed.name} — Race, caractère, santé & soins`,
    description: `Guide complet sur le ${breed.name} : morphologie, tempérament, maladies prédisposées, soins.`,
    url: `${APP_URL}/${locale}/${category}/races/${slug}`,
    dateModified: breed.lastUpdatedAt,
    author: {
      "@type": "Person",
      name: vet.name,
      jobTitle: vet.title,
    },
    about: {
      "@type": "Animal",
      name: breed.name,
    },
  };

  // Related breeds (same category, different slug)
  const related = BREEDS.filter(
    (b) => b.category === breed.category && b.slug !== slug
  ).slice(0, 4);

  const goodBadge = (val: boolean) =>
    val ? (
      <span className="flex items-center gap-1 text-green-700 text-xs font-semibold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Oui
      </span>
    ) : (
      <span className="flex items-center gap-1 text-red-600 text-xs font-semibold">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Non
      </span>
    );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8 flex items-center gap-1.5 flex-wrap">
          <Link href={`/${locale}`} className="hover:text-[#0d9488] transition-colors">{t("breadcrumb.home")}</Link>
          <span>/</span>
          <Link href={`/${locale}/${category}`} className="hover:text-[#0d9488] transition-colors capitalize">{breed.category}</Link>
          <span>/</span>
          <Link href={`/${locale}/${category}/races`} className="hover:text-[#0d9488] transition-colors">{t("breeds.breadcrumb")}</Link>
          <span>/</span>
          <span className="text-ink">{breed.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10 pb-10 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={`${breed.photo}?auto=format&fit=crop&crop=center&w=300&h=220&q=80`}
              alt={breed.name}
              className="w-full sm:w-56 h-44 rounded-2xl object-cover shrink-0 shadow-md"
            />
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1">
                  {breed.category === "chien" ? "Chien" : "Chat"}
                </span>
                {breed.recognizedBy.map((r) => (
                  <span key={r} className="text-[10px] font-mono uppercase tracking-wider text-muted bg-cream border border-border rounded-full px-2 py-0.5">
                    {r}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-2">{breed.name}</h1>
              <p className="text-sm text-muted mb-4">{breed.origin}</p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Taille</p>
                  <p className="font-semibold text-ink text-xs">{SIZE_LABELS[breed.size]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Poids mâle</p>
                  <p className="font-semibold text-ink text-xs">{breed.weightMale.min}–{breed.weightMale.max} kg</p>
                </div>
                {breed.heightMale && (
                  <div>
                    <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Hauteur</p>
                    <p className="font-semibold text-ink text-xs">{breed.heightMale.min}–{breed.heightMale.max} cm</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">Espérance de vie</p>
                  <p className="font-semibold text-ink text-xs">{breed.lifespanMin}–{breed.lifespanMax} ans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
          {/* Main content */}
          <div className="space-y-8">

            {/* Description */}
            <section>
              <h2 className="text-lg font-bold text-ink mb-4">{t("breeds.description")}</h2>
              <p className="text-sm text-ink/85 leading-relaxed mb-4">{bioP1}</p>
              {bioP2 && <p className="text-sm text-ink/85 leading-relaxed">{bioP2}</p>}
            </section>

            {/* Temperament */}
            <section>
              <h2 className="text-lg font-bold text-ink mb-3">{t("breeds.temperament")}</h2>
              <div className="flex flex-wrap gap-2">
                {breed.temperament.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* Common diseases */}
            <section>
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <span className="text-red-500">🩺</span>
                {t("breeds.diseases")}
              </h2>
              <div className="space-y-4">
                {breed.commonDiseases.map((disease, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-ink">{disease.name}</h3>
                      <span
                        className="text-[9px] font-mono uppercase tracking-wider rounded-full px-2 py-0.5"
                        style={{
                          color: PREVALENCE_COLORS[disease.prevalence],
                          background: disease.prevalence === "frequente" ? "#fef2f2" : disease.prevalence === "moderee" ? "#fffbeb" : "#f0fdf4",
                          border: `1px solid ${disease.prevalence === "frequente" ? "#fecaca" : disease.prevalence === "moderee" ? "#fde68a" : "#bbf7d0"}`,
                        }}
                      >
                        {PREVALENCE_LABELS[disease.prevalence]}
                      </span>
                    </div>
                    <p className="text-xs text-ink/80 leading-relaxed mb-3">{disease.description}</p>
                    <div className="flex gap-2 items-start text-xs">
                      <span className="text-[#0d9488] font-bold shrink-0">💡</span>
                      <p className="text-[#0d9488] leading-relaxed"><span className="font-semibold">{t("breeds.prevention")}:</span> {disease.preventionTip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vet note */}
            <section className="p-5 rounded-xl border border-[#0d9488]/20 bg-[#f0fdfa]/60">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`${vet.photo}?auto=format&fit=crop&crop=faces&w=48&h=48&q=80`}
                  alt={vet.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  style={{ border: `2px solid ${vet.color}` }}
                />
                <div>
                  <p className="text-xs font-bold text-ink">{vet.name}</p>
                  <p className="text-[10px] text-muted">{vet.title}</p>
                </div>
              </div>
              <p className="text-sm text-ink/80 leading-relaxed italic">
                &ldquo;{breed.description.split("\n\n")[0].slice(0, 200)}...&rdquo;
              </p>
            </section>

          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-4">
              {/* Fiche technique */}
              <div className="rounded-2xl border border-border bg-[#f0fdfa]/40 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">{t("breeds.technicalSheet")}</p>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted mb-0.5">{t("breeds.careLevel")}</p>
                    <p className="font-semibold text-ink">{CARE_LEVEL_LABELS[breed.careLevel]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-0.5">{t("breeds.exercise")}</p>
                    <p className="font-semibold text-ink">{EXERCISE_LABELS[breed.exerciseNeeds]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-0.5">{t("breeds.grooming")}</p>
                    <p className="font-semibold text-ink">{GROOMING_LABELS[breed.groomingFrequency]}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{t("breeds.apartment")}</p>
                    {goodBadge(breed.apartmentFriendly)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{t("breeds.children")}</p>
                    {goodBadge(breed.goodWithChildren)}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted">{t("breeds.otherPets")}</p>
                    {goodBadge(breed.goodWithOtherPets)}
                  </div>
                </div>
              </div>

              {/* Related breeds */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">{t("breeds.similar")}</p>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/${locale}/${category}/races/${r.slug}`}
                        className="group flex items-center gap-2.5 hover:text-[#0d9488] transition-colors"
                      >
                        <img
                          src={`${r.photo}?auto=format&fit=crop&w=32&h=32&q=70`}
                          alt={r.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-sm text-ink group-hover:text-[#0d9488]">{r.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/${locale}/${category}/races`}
                    className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs text-[#0d9488] font-semibold hover:underline"
                  >
                    {t("breeds.viewAll")}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Badge */}
              <div className="rounded-2xl border border-border p-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("breeds.validatedBy")} {vet.name.split(" ")[1]}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
