import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  MEDICATIONS,
  DRUG_CLASS_LABELS,
  SPECIES_LABELS,
  type DrugClass,
  type MedicationSpecies,
} from "@/lib/medications";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return ["fr", "en", "es", "de", "it", "pt", "nl"].map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: `${t("medications.dbTitle")} | Pawmedic`,
    description:
      "Base de données complète des médicaments vétérinaires pour chiens, chats, lapins et NAC. Posologies, effets secondaires, contre-indications validés par des vétérinaires.",
    alternates: { canonical: `${APP_URL}/${locale}/medicaments` },
    robots: { index: true, follow: true },
  };
}

const DRUG_CLASS_ORDER: DrugClass[] = [
  "antiparasitaire-externe",
  "antiparasitaire-interne",
  "antibiotique",
  "anti-inflammatoire",
  "analgesique",
  "antiemetique",
  "antiepileptique",
  "cardioprotecteur",
  "anxiolytique",
  "antifongique",
  "immunosuppresseur",
  "hormonal",
  "ophtalmologique",
  "otologique",
  "dermatologique",
  "digestif",
  "complement-alimentaire",
  "diuretique",
];

const SPECIES_FILTER: MedicationSpecies[] = ["chien", "chat", "lapin", "oiseau", "rongeur", "reptile", "furet"];

export default async function MedicamentsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t("medications.dbTitle"),
    url: `${APP_URL}/${locale}/medicaments`,
    description: "Répertoire des médicaments vétérinaires courants avec posologies, effets secondaires et contre-indications.",
    inLanguage: locale,
  };

  const byClass = DRUG_CLASS_ORDER.reduce<Record<string, typeof MEDICATIONS>>(
    (acc, cls) => {
      const meds = MEDICATIONS.filter((m) => m.drugClass === cls);
      if (meds.length > 0) acc[cls] = meds;
      return acc;
    },
    {}
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-5xl mx-auto px-5 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted mb-8 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-[#0d9488] transition-colors">{t("breadcrumb.home")}</Link>
          <span>/</span>
          <span className="text-ink">{t("medications.breadcrumb")}</span>
        </nav>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#0d9488] bg-[#f0fdfa] border border-[#0d9488]/20 rounded-full px-2.5 py-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("medications.verified")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
            {t("medications.dbTitle").split(" ").slice(0, 2).join(" ")}<br />
            <span className="text-[#0d9488]">{t("medications.dbTitle").split(" ").slice(2).join(" ")}</span>
          </h1>
          <p className="text-base text-muted max-w-2xl leading-relaxed">
            {MEDICATIONS.length} {t("medications.dbTitle").toLowerCase()} : posologies par espèce, effets secondaires,
            contre-indications et interactions médicamenteuses. Informations validées par nos vétérinaires.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
          <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            {t("medications.disclaimer")}
          </p>
        </div>

        {/* Quick filters by species */}
        <div className="mb-10">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-3">{t("medications.filterBySpecies")}</p>
          <div className="flex flex-wrap gap-2">
            {SPECIES_FILTER.map((sp) => (
              <a
                key={sp}
                href={`#espece-${sp}`}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border border-border bg-white hover:border-[#0d9488] hover:text-[#0d9488] transition-colors text-ink"
              >
                {SPECIES_LABELS[sp]}
              </a>
            ))}
          </div>
        </div>

        {/* Medications by class */}
        <div className="space-y-12">
          {Object.entries(byClass).map(([cls, meds]) => (
            <section key={cls}>
              <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-[#0d9488] rounded-full shrink-0" />
                {DRUG_CLASS_LABELS[cls as DrugClass]}
                <span className="text-xs font-normal text-muted ml-1">({meds.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {meds.map((med) => (
                  <Link
                    key={med.slug}
                    href={`/${locale}/medicaments/${med.slug}`}
                    className="group block p-4 rounded-xl border border-border hover:border-[#0d9488]/40 hover:shadow-sm bg-white transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-sm font-bold text-ink group-hover:text-[#0d9488] transition-colors">
                          {med.name}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">{med.genericName}</p>
                      </div>
                      {med.prescription ? (
                        <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 rounded-full px-1.5 py-0.5">
                          Rx
                        </span>
                      ) : (
                        <span className="shrink-0 text-[9px] font-mono font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">
                          OTC
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {med.species.map((sp) => (
                        <span
                          key={sp}
                          className="text-[9px] font-mono uppercase tracking-wider text-muted bg-cream border border-border rounded-full px-1.5 py-0.5"
                        >
                          {SPECIES_LABELS[sp]}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Species anchor sections */}
        {SPECIES_FILTER.map((sp) => {
          const spMeds = MEDICATIONS.filter((m) => m.species.includes(sp));
          if (spMeds.length === 0) return null;
          return (
            <section key={sp} id={`espece-${sp}`} className="mt-16 pt-8 border-t border-border">
              <h2 className="text-xl font-bold text-ink mb-6">
                {t("medications.medsForSpecies")} {SPECIES_LABELS[sp]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {spMeds.map((med) => (
                  <Link
                    key={med.slug}
                    href={`/${locale}/medicaments/${med.slug}`}
                    className="group flex items-center justify-between p-3 rounded-xl border border-border hover:border-[#0d9488]/40 bg-white transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-[#0d9488] transition-colors">{med.name}</p>
                      <p className="text-xs text-muted">{med.genericName}</p>
                    </div>
                    <svg className="w-4 h-4 text-muted group-hover:text-[#0d9488] shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
