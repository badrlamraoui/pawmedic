import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { getCategorySlug } from "@/lib/categories";

interface HeroSiteProps {
  locale: string;
}

const SPECIES_MAIN = [
  {
    canonical: "chien",
    emoji: "🐕",
    photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=700&q=80",
    color: "#d97706",
    light: "#fffbeb",
  },
  {
    canonical: "chat",
    emoji: "🐱",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80",
    color: "#9333ea",
    light: "#faf5ff",
  },
];

const SPECIES_OTHER = [
  { canonical: "lapin",    emoji: "🐰" },
  { canonical: "oiseau",   emoji: "🦜" },
  { canonical: "rongeurs", emoji: "🐹" },
  { canonical: "reptile",  emoji: "🦎" },
  { canonical: "poisson",  emoji: "🐟" },
  { canonical: "furet",    emoji: "🦡" },
];

// Labels per locale for species names
const SPECIES_LABELS: Record<string, Record<string, string>> = {
  fr: { chien: "Chien",    chat: "Chat",  lapin: "Lapin",  oiseau: "Oiseau", rongeurs: "Rongeurs", reptile: "Reptile",  furet: "Furet",   poisson: "Poisson" },
  en: { chien: "Dog",      chat: "Cat",   lapin: "Rabbit", oiseau: "Bird",   rongeurs: "Rodents",  reptile: "Reptile",  furet: "Ferret",  poisson: "Fish"    },
  es: { chien: "Perro",    chat: "Gato",  lapin: "Conejo", oiseau: "Pájaro", rongeurs: "Roedores", reptile: "Reptil",   furet: "Hurón",   poisson: "Pez"     },
  de: { chien: "Hund",     chat: "Katze", lapin: "Kaninchen", oiseau: "Vogel", rongeurs: "Nagetiere", reptile: "Reptil", furet: "Frettchen", poisson: "Fisch" },
  it: { chien: "Cane",     chat: "Gatto", lapin: "Coniglio",  oiseau: "Uccello", rongeurs: "Roditori", reptile: "Rettile", furet: "Furetto", poisson: "Pesce" },
  pt: { chien: "Cão",      chat: "Gato",  lapin: "Coelho", oiseau: "Pássaro", rongeurs: "Roedores", reptile: "Réptil",  furet: "Furão",   poisson: "Peixe"  },
  nl: { chien: "Hond",     chat: "Kat",   lapin: "Konijn", oiseau: "Vogel",  rongeurs: "Knaagdieren", reptile: "Reptiel", furet: "Fret",  poisson: "Vis"   },
};

// Descriptions per locale (Chien + Chat main cards)
const SPECIES_DESC: Record<string, Record<string, string>> = {
  fr: { chien: "Santé, alimentation, races, comportement",   chat: "Nutrition, maladies, races, bien-être" },
  en: { chien: "Health, nutrition, breeds, behaviour",       chat: "Nutrition, health, breeds, well-being" },
  es: { chien: "Salud, alimentación, razas, comportamiento", chat: "Nutrición, enfermedades, razas, bienestar" },
  de: { chien: "Gesundheit, Ernährung, Rassen, Verhalten",   chat: "Ernährung, Krankheiten, Rassen, Wohlbefinden" },
  it: { chien: "Salute, alimentazione, razze, comportamento", chat: "Nutrizione, malattie, razze, benessere" },
  pt: { chien: "Saúde, alimentação, raças, comportamento",   chat: "Nutrição, doenças, raças, bem-estar" },
  nl: { chien: "Gezondheid, voeding, rassen, gedrag",        chat: "Voeding, ziekten, rassen, welzijn" },
};

// Hero text per locale
const HERO_TEXT: Record<string, { eyebrow: string; title1: string; titleHighlight: string; title2: string; subtitle: string; ctaDog: string; ctaCat: string; statGuides: string; statSpecies: string; statFree: string }> = {
  fr: { eyebrow: "Guide complet du propriétaire d'animal", title1: "Tout ce qu'il faut savoir sur", titleHighlight: "vos animaux", title2: "de compagnie.", subtitle: "Races, santé, alimentation, comportement, élevage, sorties — des guides vétérinaires accessibles pour bien s'occuper de votre animal.", ctaDog: "Guides Chien", ctaCat: "Guides Chat", statGuides: "guides vétérinaires", statSpecies: "espèces couvertes", statFree: "accès 100% gratuit" },
  en: { eyebrow: "Complete pet owner's guide", title1: "Everything you need to know about", titleHighlight: "your pets", title2: ".", subtitle: "Breeds, health, nutrition, behaviour, care, activities — accessible vet guides to take good care of your pet.", ctaDog: "Dog Guides", ctaCat: "Cat Guides", statGuides: "vet guides", statSpecies: "species covered", statFree: "100% free access" },
  es: { eyebrow: "Guía completa del dueño de mascotas", title1: "Todo lo que necesitas saber sobre", titleHighlight: "tus animales", title2: "domésticos.", subtitle: "Razas, salud, alimentación, comportamiento, cría, salidas — guías veterinarias accesibles para cuidar bien a tu animal.", ctaDog: "Guías Perro", ctaCat: "Guías Gato", statGuides: "guías veterinarias", statSpecies: "especies cubiertas", statFree: "acceso 100% gratuito" },
  de: { eyebrow: "Vollständiger Leitfaden für Tierbesitzer", title1: "Alles, was Sie über", titleHighlight: "Ihre Haustiere", title2: "wissen müssen.", subtitle: "Rassen, Gesundheit, Ernährung, Verhalten, Aufzucht, Aktivitäten — zugängliche Tierarztratgeber für die optimale Tierpflege.", ctaDog: "Hund-Ratgeber", ctaCat: "Katzen-Ratgeber", statGuides: "Tierarzt-Ratgeber", statSpecies: "Arten abgedeckt", statFree: "100% kostenloser Zugang" },
  it: { eyebrow: "Guida completa del proprietario di animali", title1: "Tutto quello che c'è da sapere sui", titleHighlight: "tuoi animali", title2: "domestici.", subtitle: "Razze, salute, alimentazione, comportamento, allevamento, uscite — guide veterinarie accessibili per prenderti cura del tuo animale.", ctaDog: "Guide Cane", ctaCat: "Guide Gatto", statGuides: "guide veterinarie", statSpecies: "specie coperte", statFree: "accesso 100% gratuito" },
  pt: { eyebrow: "Guia completo do dono de animais", title1: "Tudo o que precisa de saber sobre", titleHighlight: "os seus animais", title2: "de estimação.", subtitle: "Raças, saúde, alimentação, comportamento, criação, passeios — guias veterinários acessíveis para cuidar bem do seu animal.", ctaDog: "Guias Cão", ctaCat: "Guias Gato", statGuides: "guias veterinários", statSpecies: "espécies cobertas", statFree: "acesso 100% gratuito" },
  nl: { eyebrow: "Complete gids voor huisdiereigenaren", title1: "Alles wat u moet weten over", titleHighlight: "uw huisdieren", title2: ".", subtitle: "Rassen, gezondheid, voeding, gedrag, fokken, uitjes — toegankelijke dierengeneeskunde-gidsen voor een goede verzorging van uw dier.", ctaDog: "Hond Gidsen", ctaCat: "Kat Gidsen", statGuides: "dierengeneeskunde-gidsen", statSpecies: "soorten gedekt", statFree: "100% gratis toegang" },
};

// Trust bar per locale
const TRUST_ITEMS: Record<string, Array<{ icon: string; label: string }>> = {
  fr: [{ icon: "🩺", label: "Relu par des vétérinaires" }, { icon: "📅", label: "Mis à jour régulièrement" }, { icon: "✅", label: "100% indépendant" }, { icon: "🇫🇷", label: "Contenu français" }, { icon: "🆓", label: "Accès totalement gratuit" }],
  en: [{ icon: "🩺", label: "Reviewed by vets" }, { icon: "📅", label: "Regularly updated" }, { icon: "✅", label: "100% independent" }, { icon: "🇬🇧", label: "English content" }, { icon: "🆓", label: "Completely free access" }],
  es: [{ icon: "🩺", label: "Revisado por veterinarios" }, { icon: "📅", label: "Actualizado regularmente" }, { icon: "✅", label: "100% independiente" }, { icon: "🇪🇸", label: "Contenido en español" }, { icon: "🆓", label: "Acceso totalmente gratuito" }],
  de: [{ icon: "🩺", label: "Von Tierärzten geprüft" }, { icon: "📅", label: "Regelmäßig aktualisiert" }, { icon: "✅", label: "100% unabhängig" }, { icon: "🇩🇪", label: "Deutsche Inhalte" }, { icon: "🆓", label: "Vollständig kostenlos" }],
  it: [{ icon: "🩺", label: "Revisionato da veterinari" }, { icon: "📅", label: "Aggiornato regolarmente" }, { icon: "✅", label: "100% indipendente" }, { icon: "🇮🇹", label: "Contenuto italiano" }, { icon: "🆓", label: "Accesso completamente gratuito" }],
  pt: [{ icon: "🩺", label: "Revisto por veterinários" }, { icon: "📅", label: "Atualizado regularmente" }, { icon: "✅", label: "100% independente" }, { icon: "🇵🇹", label: "Conteúdo em português" }, { icon: "🆓", label: "Acesso totalmente gratuito" }],
  nl: [{ icon: "🩺", label: "Beoordeeld door dierenartsen" }, { icon: "📅", label: "Regelmatig bijgewerkt" }, { icon: "✅", label: "100% onafhankelijk" }, { icon: "🇳🇱", label: "Nederlandse inhoud" }, { icon: "🆓", label: "Volledig gratis toegang" }],
};

export default function HeroSite({ locale }: HeroSiteProps) {
  const total = getAllArticles().length;
  const t = HERO_TEXT[locale] ?? HERO_TEXT.fr;
  const labels = SPECIES_LABELS[locale] ?? SPECIES_LABELS.fr;
  const descs = SPECIES_DESC[locale] ?? SPECIES_DESC.fr;
  const trust = TRUST_ITEMS[locale] ?? TRUST_ITEMS.fr;

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-5" style={{ paddingTop: "clamp(48px, 6.5vw, 90px)", paddingBottom: "clamp(48px, 6.5vw, 90px)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_1fr] items-center" style={{ gap: "clamp(16px, 2vw, 32px)" }}>

            {/* Left — copy */}
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-[#f0fdfa] border border-[#0d9488]/20 px-3.5 py-1.5 mb-7 transition-all duration-200" style={{ borderRadius: "clamp(6px, 1vw, 12px)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0d9488] animate-pulse" />
                <span className="font-mono text-[10px] text-[#0d9488] uppercase tracking-[2px]">
                  {t.eyebrow}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[clamp(38px,4vw,52px)] font-bold text-ink leading-[1.07] mb-5 tracking-tight">
                {t.title1}<br />
                <em className="text-[#0d9488] not-italic">{t.titleHighlight}</em> {t.title2}
              </h1>

              {/* Subtext */}
              <p className="text-base text-muted leading-relaxed mb-8 max-w-[500px]">
                {t.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href={`/${locale}/${getCategorySlug("chien", locale)}`}
                  className="px-6 py-3 bg-[#0d9488] text-white text-sm font-semibold hover:bg-[#0f766e] hover:shadow-lg hover:shadow-[#0d9488]/20 transition-all duration-200 flex items-center gap-2"
                  style={{ borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                >
                  🐕 {t.ctaDog}
                </Link>
                <Link
                  href={`/${locale}/${getCategorySlug("chat", locale)}`}
                  className="px-6 py-3 bg-white border border-border text-ink text-sm font-semibold hover:border-gray-300 hover:bg-cream hover:shadow-sm transition-all duration-200 flex items-center gap-2"
                  style={{ borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                >
                  🐱 {t.ctaCat}
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                {[
                  [total.toString() + "+", t.statGuides],
                  ["8", t.statSpecies],
                  ["0€", t.statFree],
                ].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-xl font-bold text-[#0d9488]">{val}</div>
                    <div className="text-[11px] text-muted mt-0.5 font-mono">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — species cards */}
            <div className="hidden lg:flex flex-col gap-3">
              {/* Chien + Chat big cards */}
              <div className="grid grid-cols-2 gap-3">
                {SPECIES_MAIN.map((sp) => (
                  <Link
                    key={sp.canonical}
                    href={`/${locale}/${getCategorySlug(sp.canonical, locale)}`}
                    className="group relative overflow-hidden h-44 block transition-all duration-300"
                    style={{ borderRadius: "clamp(12px, 2.5vw, 24px)" }}
                  >
                    <img
                      src={sp.photo}
                      alt={labels[sp.canonical]}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/65 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-xl font-bold text-white flex items-center gap-2">
                        <span>{sp.emoji}</span>
                        <span>{labels[sp.canonical]}</span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5 leading-snug">{descs[sp.canonical]}</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Other species pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {SPECIES_OTHER.map((sp) => (
                  <Link
                    key={sp.canonical}
                    href={`/${locale}/${getCategorySlug(sp.canonical, locale)}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-cream border border-border text-sm text-ink hover:border-[#0d9488]/40 hover:bg-[#f0fdfa] transition-all duration-200"
                    style={{ borderRadius: "clamp(6px, 1vw, 12px)" }}
                  >
                    <span>{sp.emoji}</span>
                    <span className="font-medium">{labels[sp.canonical]}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────── */}
      <div className="bg-[#1a1a18] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 py-3.5">
          <div className="flex justify-center gap-8 flex-wrap">
            {trust.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-sm opacity-70">{icon}</span>
                <span className="text-[12px] text-white/50 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
