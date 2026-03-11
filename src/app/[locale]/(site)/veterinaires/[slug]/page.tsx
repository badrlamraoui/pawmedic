import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { VETS, getVetForArticle } from "@/lib/vets";
import { getAllArticles } from "@/lib/articles";
import { getCategorySlug } from "@/lib/categories";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return VETS.flatMap((vet) =>
    ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({
      locale,
      slug: vet.slug,
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vet = VETS.find((v) => v.slug === slug);
  if (!vet) return {};
  return {
    title: `${vet.name} — ${vet.title} | Pawmedic`,
    description: `${vet.name}, ${vet.title} diplômé(e) de ${vet.schoolFull}. Découvrez son parcours et ses articles sur la santé animale.`,
    robots: { index: true, follow: true },
  };
}

export default async function VetProfilePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const vet = VETS.find((v) => v.slug === slug);
  if (!vet) notFound();

  // Articles written by this vet (based on assignment logic)
  const allArticles = getAllArticles(locale);
  const vetArticles = allArticles
    .filter((a) => getVetForArticle(a.category, a.theme, a.slug).slug === vet.slug)
    .slice(0, 6);

  const profileUrl = `${APP_URL}/${locale}/veterinaires/${vet.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: vet.name,
    jobTitle: vet.title,
    worksFor: {
      "@type": "Organization",
      name: "Pawmedic",
      url: APP_URL,
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: vet.schoolFull,
    },
    knowsAbout: vet.specializations,
    description: vet.bio.split("\n\n")[0],
    url: profileUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: vet.city,
      addressCountry: "FR",
    },
  };

  const [bioP1, bioP2] = vet.bio.split("\n\n");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-5 py-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-[#0d9488] transition-colors">Accueil</Link>
          <span>/</span>
          <Link href={`/${locale}/veterinaires`} className="hover:text-[#0d9488] transition-colors">Vétérinaires</Link>
          <span>/</span>
          <span className="text-ink">{vet.name}</span>
        </nav>

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start gap-8 mb-12 pb-12 border-b border-border">
          {/* Photo */}
          <img
            src={`${vet.photo}?auto=format&fit=crop&crop=faces&w=192&h=192&q=85`}
            alt={vet.name}
            className="w-24 h-24 rounded-2xl object-cover shrink-0 shadow-md"
            style={{ border: `3px solid ${vet.color}` }}
          />

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vétérinaire diplômé(e)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-1">{vet.name}</h1>
            <p className="text-base text-muted mb-3">{vet.title}</p>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
                {vet.schoolFull} · {vet.graduationYear}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {vet.city}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {vet.years} ans d&apos;expérience
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">

          {/* Left: bio + articles */}
          <div>
            {/* Biography */}
            <section className="mb-10">
              <h2 className="text-lg font-bold text-ink mb-4">Biographie</h2>
              <p className="text-sm text-ink/80 leading-relaxed mb-4">{bioP1}</p>
              {bioP2 && <p className="text-sm text-ink/80 leading-relaxed">{bioP2}</p>}
            </section>

            {/* Articles */}
            {vetArticles.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                  <span className="text-[#0d9488]">📄</span>
                  Articles vérifiés par {vet.name.split(" ")[1]}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vetArticles.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/${locale}/${getCategorySlug(a.category, locale)}/${a.slug}`}
                      className="group block p-4 rounded-xl border border-border hover:border-[#0d9488]/30 hover:shadow-sm bg-white transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="font-mono text-[9px] uppercase font-semibold"
                          style={{ color: vet.color }}
                        >
                          {a.theme ?? a.category}
                        </span>
                        <span className="font-mono text-[9px] text-muted">{a.readingTime} min</span>
                      </div>
                      <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-[#0d9488] transition-colors line-clamp-2">
                        {a.title}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: specializations sidebar */}
          <aside>
            <div className="rounded-2xl border border-border bg-[#f0fdfa]/50 p-5 sticky top-24">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">Spécialisations</p>
              <div className="flex flex-col gap-2">
                {vet.specializations.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-ink">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] shrink-0" />
                    {s}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">Formation</p>
                <p className="text-sm font-semibold text-ink">{vet.schoolFull}</p>
                <p className="text-xs text-muted mt-0.5">Diplôme d&apos;État de Docteur Vétérinaire · {vet.graduationYear}</p>
              </div>

              <div className="mt-5 pt-5 border-t border-border">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Contenu médicalement vérifié
                </div>
              </div>
            </div>
          </aside>
        </div>

      </div>
    </>
  );
}
