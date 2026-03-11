import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  MEDICATIONS,
  getAllMedicationSlugs,
  getMedication,
  DRUG_CLASS_LABELS,
  SPECIES_LABELS,
} from "@/lib/medications";
import { VETS } from "@/lib/vets";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

// Dr. Julie Bernard is the pharmacology expert
const PHARMACOLOGIST = VETS.find((v) => v.slug === "dr-julie-bernard")!;

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllMedicationSlugs();
  return slugs.flatMap((slug) =>
    ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const med = getMedication(slug);
  if (!med) return {};
  return {
    title: `${med.name} (${med.genericName}) — Médicament vétérinaire | Pawmedic`,
    description: `Tout sur ${med.name} : indications, posologie par espèce, effets secondaires, contre-indications et interactions médicamenteuses. Validé par ${PHARMACOLOGIST.name}.`,
    alternates: { canonical: `${APP_URL}/${locale}/medicaments/${slug}` },
    robots: { index: true, follow: true },
  };
}

export default async function MedicationPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const med = getMedication(slug);
  if (!med) notFound();

  const profileUrl = `${APP_URL}/${locale}/medicaments/${med.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Drug",
    name: med.name,
    activeIngredient: med.genericName,
      description: med.indications.join(". "),
    prescriptionStatus: med.prescription
      ? "https://schema.org/PrescriptionOnly"
      : "https://schema.org/OTC",
    indication: med.indications.join("; "),
    contraindication: med.contraindications.join("; "),
    drugClass: DRUG_CLASS_LABELS[med.drugClass],
    url: profileUrl,
    isPartOf: {
      "@type": "MedicalWebPage",
      name: "Base de données médicaments vétérinaires Pawmedic",
      url: `${APP_URL}/${locale}/medicaments`,
    },
    author: {
      "@type": "Person",
      name: PHARMACOLOGIST.name,
      jobTitle: PHARMACOLOGIST.title,
    },
    dateModified: med.lastUpdatedAt,
  };

  // Related medications (same drug class, excluding self)
  const related = MEDICATIONS.filter(
    (m) => m.drugClass === med.drugClass && m.slug !== med.slug
  ).slice(0, 4);

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
          <Link href={`/${locale}/medicaments`} className="hover:text-[#0d9488] transition-colors">{t("medications.breadcrumb")}</Link>
          <span>/</span>
          <span className="text-ink">{med.name}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10 pb-10 border-b border-border">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1">
              {DRUG_CLASS_LABELS[med.drugClass]}
            </span>
            {med.prescription ? (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
                {t("medications.prescription")} (Rx)
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                {t("medications.otc")}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">{med.name}</h1>
          <p className="text-lg text-muted mb-4">{med.genericName}</p>

          {med.alternateNames && med.alternateNames.length > 0 && (
            <p className="text-xs text-muted">
              <span className="font-semibold">Noms alternatifs :</span>{" "}
              {med.alternateNames.join(", ")}
            </p>
          )}

          {/* Species badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {med.species.map((sp) => (
              <span
                key={sp}
                className="text-xs font-semibold text-ink bg-cream border border-border rounded-full px-3 py-1"
              >
                {SPECIES_LABELS[sp]}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main content */}
          <div className="space-y-8">

            {/* Disclaimer */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                {t("medications.disclaimer")}
              </p>
            </div>

            {/* Indications */}
            <section>
              <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f0fdfa] border border-[#0d9488]/30 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
                </span>
                {t("medications.indications")}
              </h2>
              <ul className="space-y-2">
                {med.indications.map((ind, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/85">
                    <span className="text-[#0d9488] font-bold mt-0.5 shrink-0">→</span>
                    {ind}
                  </li>
                ))}
              </ul>
            </section>

            {/* Posology table */}
            <section>
              <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#f0fdfa] border border-[#0d9488]/30 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#0d9488]" />
                </span>
                {t("medications.posology")}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f0fdfa] border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-bold text-[#0d9488] uppercase tracking-wide">{t("medications.species")}</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-[#0d9488] uppercase tracking-wide">{t("medications.dose")}</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-[#0d9488] uppercase tracking-wide">{t("medications.frequency")}</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-[#0d9488] uppercase tracking-wide">{t("medications.route")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {med.posology.map((pos, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-[#f5fffe] transition-colors">
                        <td className="px-4 py-3 font-semibold text-ink capitalize">{SPECIES_LABELS[pos.species]}</td>
                        <td className="px-4 py-3 text-ink/80">{pos.dose}</td>
                        <td className="px-4 py-3 text-ink/80">{pos.frequency}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono bg-cream border border-border rounded px-1.5 py-0.5 capitalize">
                            {pos.route}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {med.posology.some((p) => p.notes) && (
                <div className="mt-3 space-y-1.5">
                  {med.posology.filter((p) => p.notes).map((p, i) => (
                    <p key={i} className="text-xs text-muted flex gap-1.5 items-start">
                      <span className="font-bold text-[#0d9488] shrink-0">ℹ</span>
                      <span><span className="font-semibold capitalize">{SPECIES_LABELS[p.species]} :</span> {p.notes}</span>
                    </p>
                  ))}
                </div>
              )}
            </section>

            {/* Vét note */}
            <section className="p-5 rounded-xl border border-[#0d9488]/20 bg-[#f0fdfa]/60">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`${PHARMACOLOGIST.photo}?auto=format&fit=crop&crop=faces&w=48&h=48&q=80`}
                  alt={PHARMACOLOGIST.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  style={{ border: `2px solid ${PHARMACOLOGIST.color}` }}
                />
                <div>
                  <p className="text-xs font-bold text-ink">{PHARMACOLOGIST.name}</p>
                  <p className="text-[10px] text-muted">{PHARMACOLOGIST.title}</p>
                </div>
              </div>
              <p className="text-sm text-ink/85 leading-relaxed italic">&ldquo;{med.vetNote}&rdquo;</p>
            </section>

            {/* Side effects */}
            <section>
              <h2 className="text-base font-bold text-ink mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-orange-400" />
                </span>
                {t("medications.sideEffects")}
              </h2>
              <ul className="space-y-1.5">
                {med.sideEffects.map((se, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink/85">
                    <span className="text-orange-500 font-bold mt-0.5 shrink-0">!</span>
                    {se}
                  </li>
                ))}
              </ul>
            </section>

            {/* Contraindications */}
            {med.contraindications.length > 0 && (
              <section className="p-4 rounded-xl bg-red-50 border border-red-200">
                <h2 className="text-base font-bold text-red-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  {t("medications.contraindications")}
                </h2>
                <ul className="space-y-1.5">
                  {med.contraindications.map((ci, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="font-bold shrink-0">✗</span>
                      {ci}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Interactions */}
            {med.interactions.length > 0 && (
              <section className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                <h2 className="text-base font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                  {t("medications.interactions")}
                </h2>
                <ul className="space-y-1.5">
                  {med.interactions.map((inter, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                      <span className="font-bold shrink-0">↔</span>
                      {inter}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Storage */}
            {med.storageConditions && (
              <section className="flex items-start gap-3 p-4 rounded-xl bg-cream border border-border">
                <svg className="w-5 h-5 text-muted shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-ink mb-0.5">{t("medications.storage")}</p>
                  <p className="text-sm text-ink/80">{med.storageConditions}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-4">
              {/* Quick info card */}
              <div className="rounded-2xl border border-border bg-[#f0fdfa]/40 p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-4">{t("medications.keyInfo")}</p>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted mb-0.5">{t("medications.activeIngredient")}</dt>
                    <dd className="font-semibold text-ink">{med.genericName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-0.5">{t("medications.therapeuticClass")}</dt>
                    <dd className="font-semibold text-ink">{DRUG_CLASS_LABELS[med.drugClass]}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-0.5">{t("medications.prescription")}</dt>
                    <dd className="font-semibold text-ink">{med.prescription ? t("medications.prescriptionRequired") : t("medications.otcSale")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-0.5">{t("medications.speciesConcerned")}</dt>
                    <dd className="flex flex-wrap gap-1 mt-1">
                      {med.species.map((sp) => (
                        <span key={sp} className="text-[10px] font-mono bg-white border border-border rounded-full px-1.5 py-0.5 text-ink">
                          {SPECIES_LABELS[sp]}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted mb-0.5">{t("medications.lastUpdated")}</dt>
                    <dd className="text-ink">{new Date(med.lastUpdatedAt).toLocaleDateString(locale, { year: "numeric", month: "long" })}</dd>
                  </div>
                </dl>

                <div className="mt-5 pt-4 border-t border-border">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t("medications.verified")}
                  </div>
                </div>
              </div>

              {/* Related medications */}
              {related.length > 0 && (
                <div className="rounded-2xl border border-border bg-white p-5">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">{t("medications.relatedMeds")}</p>
                  <div className="space-y-2">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/${locale}/medicaments/${r.slug}`}
                        className="group flex items-center justify-between text-sm hover:text-[#0d9488] transition-colors"
                      >
                        <span className="text-ink group-hover:text-[#0d9488]">{r.name}</span>
                        <svg className="w-3.5 h-3.5 text-muted group-hover:text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href={`/${locale}/medicaments`}
                    className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-xs text-[#0d9488] font-semibold hover:underline"
                  >
                    {t("medications.viewAll")}
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}

              {/* Emergency contact */}
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-xs font-bold text-red-700 mb-2 flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  {t("medications.emergency")}
                </p>
                <p className="text-xs text-red-800 leading-relaxed">
                  <strong>CNITV :</strong> 04 78 87 10 40<br />
                  Centre national d&apos;information toxicologique vétérinaire
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
