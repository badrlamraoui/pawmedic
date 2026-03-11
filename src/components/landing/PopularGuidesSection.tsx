import Link from "next/link";
import { getArticlesByCategory, getAllArticles, type ArticleFrontmatter } from "@/lib/articles";
import { getCategorySlug } from "@/lib/categories";
import SpeciesExplorer, { type SpeciesItem } from "./SpeciesExplorer";

// ── SPECIES CONFIG ─────────────────────────────────────────────────────────────
const SPECIES_CONFIG = [
  {
    id: "chien",
    emoji: "🐕",
    label: "Chien",
    number: "01",
    color: "#d97706",
    light: "#fffbeb",
    border: "#fde68a",
    tagline: "Tout sur la santé, l'alimentation et le bien-être de votre chien",
    desc: "Maladies, croquettes, éducation, races, antiparasitaires, toilettage — tous les guides pour prendre soin de votre chien au quotidien.",
  },
  {
    id: "chat",
    emoji: "🐱",
    label: "Chat",
    number: "02",
    color: "#9333ea",
    light: "#faf5ff",
    border: "#e9d5ff",
    tagline: "Nutrition, maladies, races et comportement félin",
    desc: "Alimentation, symptômes, comportement, stérilisation, races, litière — tout ce qu'il faut savoir pour un chat épanoui.",
  },
  {
    id: "lapin",
    emoji: "🐰",
    label: "Lapin",
    number: "03",
    color: "#ea580c",
    light: "#fff7ed",
    border: "#fed7aa",
    tagline: "Santé et alimentation du lapin nain et du lapin de compagnie",
    desc: "Foin, légumes, maladies, stérilisation, vaccins — tous les conseils pour un lapin en bonne santé.",
  },
  {
    id: "oiseau",
    emoji: "🦜",
    label: "Oiseau",
    number: "04",
    color: "#0284c7",
    light: "#f0f9ff",
    border: "#bae6fd",
    tagline: "Soins et bien-être de vos oiseaux de compagnie",
    desc: "Perruches, perroquets, canaris — alimentation, maladies, cage, apprivoisement.",
  },
  {
    id: "rongeurs",
    emoji: "🐹",
    label: "Rongeurs",
    number: "05",
    color: "#ca8a04",
    light: "#fefce8",
    border: "#fde68a",
    tagline: "Hamsters, cochons d'Inde, souris et rats domestiques",
    desc: "Cage, alimentation, maladies fréquentes, sociabilisation — tout sur vos petits compagnons.",
  },
  {
    id: "reptile",
    emoji: "🦎",
    label: "Reptile",
    number: "06",
    color: "#65a30d",
    light: "#f7fee7",
    border: "#d9f99d",
    tagline: "Élevage et santé des reptiles en terrarium",
    desc: "Température, alimentation, hibernation, maladies — les bases pour vos lézards, serpents et tortues.",
  },
];

// ── THEME LABELS ───────────────────────────────────────────────────────────────
const THEME_LABELS: Record<string, string> = {
  sante: "Santé",
  alimentation: "Alimentation",
  races: "Races",
  comportement: "Comportement",
  elevage: "Élevage",
  sorties: "Sorties",
  medicaments: "Médicaments",
  veterinaire: "Vétérinaire",
  pedigree: "Pedigree",
  toilettage: "Toilettage",
  voyages: "Voyages",
  jeux: "Jeux",
};

// ── AFFILIATE COMPARATORS ──────────────────────────────────────────────────────
const AFFILIATE_GUIDES = [
  {
    icon: "🍖",
    category: "Alimentation",
    label: "Comparatif",
    title: "Meilleure nourriture pour chien : notre sélection croquettes et pâtées",
    desc: "Protéines, céréales, humidité — on décortique les étiquettes pour vous aider à choisir.",
    href: "/chien/alimentation-chien-barf-avantages-risques",
    cta: "Voir notre sélection",
    badge: "Top picks",
    color: "#d97706",
    light: "#fffbeb",
  },
  {
    icon: "💊",
    category: "Antiparasitaires",
    label: "Comparatif",
    title: "Meilleur antiparasitaire chien et chat 2025 : comparatif complet",
    desc: "Frontline, Advantage, Bravecto, NexGard — efficacité, durée, prix : lequel choisir ?",
    href: "/chien/meilleur-antiparasitaire-chien",
    cta: "Comparer maintenant",
    badge: "Populaire",
    color: "#0d9488",
    light: "#f0fdfa",
  },
  {
    icon: "🏥",
    category: "Assurance",
    label: "Guide",
    title: "Assurance animaux : quel contrat rembourse le mieux les frais vétérinaires ?",
    desc: "Comparatif des meilleures mutuelles pour chien et chat en France en 2025.",
    href: "/chien/assurance-animaux-comparatif-france",
    cta: "Comparer les offres",
    badge: "Nouveau",
    color: "#1d4ed8",
    light: "#eff6ff",
  },
  {
    icon: "🛍️",
    category: "Produits",
    label: "Sélection",
    title: "Accessoires indispensables pour votre chien : notre guide d'achat 2025",
    desc: "Colliers, gamelles, jouets, GPS, transporteurs — les produits vraiment utiles.",
    href: "/produits",
    cta: "Voir les produits",
    badge: "Top picks",
    color: "#6d28d9",
    light: "#f5f3ff",
  },
];

// ── SECTION LABELS ─────────────────────────────────────────────────────────────
const SECTION_LABELS: Record<string, {
  explorerEyebrow: string; explorerTitle: string; explorerLink: string;
  editorialEyebrow: string; editorialTitle: string; editorialLink: string;
  affiliateEyebrow: string; affiliateTitle: string; affiliateSub: string; affiliateLink: string;
  trustEyebrow: string; trustTitle: string; trustBody: string; trustCta1: string; trustCta2: string;
  popular: string; readMore: string; minutes: string;
  trustPoints: Array<{ icon: string; title: string; desc: string }>;
}> = {
  fr: {
    explorerEyebrow: "Explorer par espèce", explorerTitle: "À chaque animal, les bons guides", explorerLink: "Tous les thèmes →",
    editorialEyebrow: "Sélection éditoriale", editorialTitle: "Les guides qui font la différence", editorialLink: "Tous les guides →",
    affiliateEyebrow: "Guides d'achat & comparatifs", affiliateTitle: "Choisissez le meilleur pour votre animal.", affiliateSub: "Nos équipes testent et comparent les produits pour vous aider à faire les meilleurs choix pour la santé et le bien-être de vos animaux.", affiliateLink: "Tous les comparatifs →",
    trustEyebrow: "Pourquoi nous faire confiance", trustTitle: "Un média pensé par des passionnés", trustBody: "Chaque article est rédigé avec rigueur et relu par des professionnels de santé animale.", trustCta1: "Voir les guides chien", trustCta2: "Voir les guides chat",
    popular: "Populaire", readMore: "Lire →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Relu par des vétérinaires", desc: "Chaque guide est vérifié par un professionnel de santé animale avant publication." },
      { icon: "🔬", title: "Conseils pratiques & vérifiables", desc: "Nos recommandations s'appuient sur des sources médicales vétérinaires reconnues." },
      { icon: "✅", title: "Indépendance éditoriale totale", desc: "Aucun partenaire commercial ne peut influencer le contenu de nos guides." },
      { icon: "🔄", title: "Mise à jour régulière", desc: "Nos articles sont révisés dès que les recommandations vétérinaires évoluent." },
    ],
  },
  en: {
    explorerEyebrow: "Explore by species", explorerTitle: "The right guides for every pet", explorerLink: "All topics →",
    editorialEyebrow: "Editorial selection", editorialTitle: "The guides that make a difference", editorialLink: "All guides →",
    affiliateEyebrow: "Buying guides & comparisons", affiliateTitle: "Choose the best for your pet.", affiliateSub: "Our teams test and compare products to help you make the best choices for your pet's health and well-being.", affiliateLink: "All comparisons →",
    trustEyebrow: "Why trust us", trustTitle: "A media built by enthusiasts", trustBody: "Every article is written rigorously and reviewed by animal health professionals.", trustCta1: "See dog guides", trustCta2: "See cat guides",
    popular: "Popular", readMore: "Read →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Reviewed by vets", desc: "Every guide is checked by an animal health professional before publication." },
      { icon: "🔬", title: "Practical & verifiable advice", desc: "Our recommendations are based on recognised veterinary medical sources." },
      { icon: "✅", title: "Full editorial independence", desc: "No commercial partner can influence the content of our guides." },
      { icon: "🔄", title: "Regularly updated", desc: "Our articles are revised whenever veterinary recommendations change." },
    ],
  },
  es: {
    explorerEyebrow: "Explorar por especie", explorerTitle: "Las guías correctas para cada animal", explorerLink: "Todos los temas →",
    editorialEyebrow: "Selección editorial", editorialTitle: "Las guías que marcan la diferencia", editorialLink: "Todas las guías →",
    affiliateEyebrow: "Guías de compra & comparativas", affiliateTitle: "Elige lo mejor para tu animal.", affiliateSub: "Nuestros equipos prueban y comparan productos para ayudarte a tomar las mejores decisiones para la salud y bienestar de tu animal.", affiliateLink: "Todas las comparativas →",
    trustEyebrow: "Por qué confiar en nosotros", trustTitle: "Un medio pensado por apasionados", trustBody: "Cada artículo está redactado con rigor y revisado por profesionales de la salud animal.", trustCta1: "Ver guías perro", trustCta2: "Ver guías gato",
    popular: "Popular", readMore: "Leer →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Revisado por veterinarios", desc: "Cada guía es verificada por un profesional de salud animal antes de publicarse." },
      { icon: "🔬", title: "Consejos prácticos y verificables", desc: "Nuestras recomendaciones se basan en fuentes médicas veterinarias reconocidas." },
      { icon: "✅", title: "Independencia editorial total", desc: "Ningún socio comercial puede influir en el contenido de nuestras guías." },
      { icon: "🔄", title: "Actualización regular", desc: "Nuestros artículos se revisan cuando cambian las recomendaciones veterinarias." },
    ],
  },
  de: {
    explorerEyebrow: "Nach Tierart erkunden", explorerTitle: "Die richtigen Ratgeber für jedes Tier", explorerLink: "Alle Themen →",
    editorialEyebrow: "Redaktionelle Auswahl", editorialTitle: "Die Ratgeber, die den Unterschied machen", editorialLink: "Alle Ratgeber →",
    affiliateEyebrow: "Kaufratgeber & Vergleiche", affiliateTitle: "Wählen Sie das Beste für Ihr Tier.", affiliateSub: "Unsere Teams testen und vergleichen Produkte, damit Sie die besten Entscheidungen für die Gesundheit Ihres Tieres treffen können.", affiliateLink: "Alle Vergleiche →",
    trustEyebrow: "Warum uns vertrauen", trustTitle: "Ein Medium von Tierliebhabern", trustBody: "Jeder Artikel wird sorgfältig verfasst und von Tiergesundheitsexperten geprüft.", trustCta1: "Hund-Ratgeber ansehen", trustCta2: "Katzen-Ratgeber ansehen",
    popular: "Beliebt", readMore: "Lesen →", minutes: "Min",
    trustPoints: [
      { icon: "🩺", title: "Von Tierärzten geprüft", desc: "Jeder Ratgeber wird vor der Veröffentlichung von einem Tiergesundheitsexperten überprüft." },
      { icon: "🔬", title: "Praktische & nachprüfbare Ratschläge", desc: "Unsere Empfehlungen basieren auf anerkannten tiermedizinischen Quellen." },
      { icon: "✅", title: "Vollständige redaktionelle Unabhängigkeit", desc: "Kein Handelspartner kann den Inhalt unserer Ratgeber beeinflussen." },
      { icon: "🔄", title: "Regelmäßige Aktualisierung", desc: "Unsere Artikel werden überarbeitet, sobald sich tiermedizinische Empfehlungen ändern." },
    ],
  },
  it: {
    explorerEyebrow: "Esplora per specie", explorerTitle: "Le guide giuste per ogni animale", explorerLink: "Tutti i temi →",
    editorialEyebrow: "Selezione editoriale", editorialTitle: "Le guide che fanno la differenza", editorialLink: "Tutte le guide →",
    affiliateEyebrow: "Guide d'acquisto & confronti", affiliateTitle: "Scegli il meglio per il tuo animale.", affiliateSub: "I nostri team testano e confrontano i prodotti per aiutarti a fare le scelte migliori per la salute del tuo animale.", affiliateLink: "Tutti i confronti →",
    trustEyebrow: "Perché fidarsi di noi", trustTitle: "Un media pensato da appassionati", trustBody: "Ogni articolo è scritto con rigore e rivisto da professionisti della salute animale.", trustCta1: "Vedi guide cane", trustCta2: "Vedi guide gatto",
    popular: "Popolare", readMore: "Leggi →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Rivisto da veterinari", desc: "Ogni guida è verificata da un professionista della salute animale prima della pubblicazione." },
      { icon: "🔬", title: "Consigli pratici e verificabili", desc: "Le nostre raccomandazioni si basano su fonti mediche veterinarie riconosciute." },
      { icon: "✅", title: "Indipendenza editoriale totale", desc: "Nessun partner commerciale può influenzare il contenuto delle nostre guide." },
      { icon: "🔄", title: "Aggiornamento regolare", desc: "I nostri articoli vengono rivisti quando le raccomandazioni veterinarie cambiano." },
    ],
  },
  pt: {
    explorerEyebrow: "Explorar por espécie", explorerTitle: "Os guias certos para cada animal", explorerLink: "Todos os temas →",
    editorialEyebrow: "Seleção editorial", editorialTitle: "Os guias que fazem a diferença", editorialLink: "Todos os guias →",
    affiliateEyebrow: "Guias de compra & comparações", affiliateTitle: "Escolha o melhor para o seu animal.", affiliateSub: "As nossas equipas testam e comparam produtos para o ajudar a tomar as melhores decisões para a saúde do seu animal.", affiliateLink: "Todas as comparações →",
    trustEyebrow: "Por que confiar em nós", trustTitle: "Um média pensado por apaixonados", trustBody: "Cada artigo é redigido com rigor e revisto por profissionais de saúde animal.", trustCta1: "Ver guias cão", trustCta2: "Ver guias gato",
    popular: "Popular", readMore: "Ler →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Revisto por veterinários", desc: "Cada guia é verificado por um profissional de saúde animal antes da publicação." },
      { icon: "🔬", title: "Conselhos práticos e verificáveis", desc: "As nossas recomendações baseiam-se em fontes médicas veterinárias reconhecidas." },
      { icon: "✅", title: "Independência editorial total", desc: "Nenhum parceiro comercial pode influenciar o conteúdo dos nossos guias." },
      { icon: "🔄", title: "Atualização regular", desc: "Os nossos artigos são revistos quando as recomendações veterinárias mudam." },
    ],
  },
  nl: {
    explorerEyebrow: "Verkennen per soort", explorerTitle: "De juiste gidsen voor elk dier", explorerLink: "Alle onderwerpen →",
    editorialEyebrow: "Redactionele selectie", editorialTitle: "De gidsen die het verschil maken", editorialLink: "Alle gidsen →",
    affiliateEyebrow: "Koopgidsen & vergelijkingen", affiliateTitle: "Kies het beste voor uw dier.", affiliateSub: "Onze teams testen en vergelijken producten om u te helpen de beste keuzes te maken voor de gezondheid van uw dier.", affiliateLink: "Alle vergelijkingen →",
    trustEyebrow: "Waarom ons vertrouwen", trustTitle: "Een medium gemaakt door enthousiastelingen", trustBody: "Elk artikel wordt zorgvuldig geschreven en beoordeeld door diergezondheidsprofessionals.", trustCta1: "Hond gidsen bekijken", trustCta2: "Kat gidsen bekijken",
    popular: "Populair", readMore: "Lezen →", minutes: "min",
    trustPoints: [
      { icon: "🩺", title: "Beoordeeld door dierenartsen", desc: "Elke gids wordt voor publicatie gecontroleerd door een diergezondheidsprofessional." },
      { icon: "🔬", title: "Praktisch & verifieerbaar advies", desc: "Onze aanbevelingen zijn gebaseerd op erkende diergeneeskundige bronnen." },
      { icon: "✅", title: "Volledige redactionele onafhankelijkheid", desc: "Geen commerciële partner kan de inhoud van onze gidsen beïnvloeden." },
      { icon: "🔄", title: "Regelmatige updates", desc: "Onze artikelen worden herzien wanneer dierengeneeskundige aanbevelingen veranderen." },
    ],
  },
};

// ── FEATURED EDITORIAL ─────────────────────────────────────────────────────────
const EDITORIAL_HERO_IMAGES: Record<string, string> = {
  "chien-sante": "https://images.unsplash.com/photo-1633722715463-d30628ceb4f9?auto=format&fit=crop&w=600&h=300&q=80",
  "chien-alimentation": "https://images.unsplash.com/photo-1585838341296-6f4ee35583a8?auto=format&fit=crop&w=600&h=300&q=80",
  "chien-races": "https://images.unsplash.com/photo-1558931420-fcdcc0b5d4d8?auto=format&fit=crop&w=600&h=300&q=80",
  "chat-sante": "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&h=300&q=80",
  "chat-alimentation": "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&h=300&q=80",
  "chat-races": "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=600&h=300&q=80",
};

function getEditorialPicks(articles: ArticleFrontmatter[]): ArticleFrontmatter[] {
  // Pick 1 article from each key theme, prioritizing chien + chat
  const priority = ["sante", "comportement", "alimentation", "races", "veterinaire", "medicaments"];
  const used = new Set<string>();
  const picks: ArticleFrontmatter[] = [];

  for (const theme of priority) {
    if (picks.length >= 6) break;
    const match = articles.find(
      (a) => a.theme === theme && !used.has(a.slug) && (a.category === "chien" || a.category === "chat")
    );
    if (match) {
      picks.push(match);
      used.add(match.slug);
    }
  }

  // Fill remaining from any category
  if (picks.length < 6) {
    for (const a of articles) {
      if (picks.length >= 6) break;
      if (!used.has(a.slug)) {
        picks.push(a);
        used.add(a.slug);
      }
    }
  }

  return picks;
}

const THEME_COLORS: Record<string, { bg: string; text: string }> = {
  sante:        { bg: "bg-red-50",    text: "text-red-700" },
  alimentation: { bg: "bg-orange-50", text: "text-orange-700" },
  races:        { bg: "bg-purple-50", text: "text-purple-700" },
  comportement: { bg: "bg-blue-50",   text: "text-blue-700" },
  elevage:      { bg: "bg-yellow-50", text: "text-yellow-700" },
  sorties:      { bg: "bg-lime-50",   text: "text-lime-700" },
  medicaments:  { bg: "bg-teal-50",   text: "text-teal-700" },
  veterinaire:  { bg: "bg-cyan-50",   text: "text-cyan-700" },
  pedigree:     { bg: "bg-indigo-50", text: "text-indigo-700" },
  toilettage:   { bg: "bg-pink-50",   text: "text-pink-700" },
  voyages:      { bg: "bg-sky-50",    text: "text-sky-700" },
  jeux:         { bg: "bg-green-50",  text: "text-green-700" },
};

interface PopularGuidesSectionProps {
  locale?: string;
}

export default function PopularGuidesSection({ locale = "fr" }: PopularGuidesSectionProps) {
  const allArticles = getAllArticles();
  const sl = SECTION_LABELS[locale] ?? SECTION_LABELS.fr;

  // Build species data for the explorer
  const speciesData: SpeciesItem[] = SPECIES_CONFIG.map((cfg) => {
    const arts = getArticlesByCategory(cfg.id as "chien");
    const uniqueThemes = [...new Set(arts.map((a) => a.theme).filter(Boolean))] as string[];
    return {
      ...cfg,
      themes: uniqueThemes,
      articles: arts.slice(0, 6).map((a) => ({
        title: a.title,
        slug: a.slug,
        theme: a.theme,
        readingTime: a.readingTime,
      })),
      count: arts.length,
    };
  });

  const editorialPicks = getEditorialPicks(allArticles);

  return (
    <div className="bg-cream">

      {/* ── SECTION 0 : THÈMES ───────────────────────────────────── */}
      <section className="px-5 bg-white border-b border-border" style={{ paddingTop: "clamp(48px, 6.5vw, 90px)", paddingBottom: "clamp(48px, 6.5vw, 90px)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between" style={{ marginBottom: "clamp(32px, 4vw, 60px)" }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0d9488] mb-1.5">
                Parcourir par thème
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                Tous les sujets de santé animale
              </h2>
            </div>
            <Link
              href={`/${locale}/themes`}
              className="hidden sm:block text-xs font-semibold text-[#0d9488] hover:underline"
            >
              Voir tous les thèmes →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" style={{ gap: "clamp(12px, 1.5vw, 24px)" }}>
            {[
              { emoji: "🩺", slug: "sante",        label: "Santé & maladies",     desc: "Symptômes, diagnostics, soins" },
              { emoji: "🍖", slug: "alimentation",  label: "Alimentation",          desc: "Nutrition, régimes, compléments" },
              { emoji: "🧬", slug: "races",         label: "Races",                 desc: "Caractère, morphologie, origines" },
              { emoji: "🧠", slug: "comportement",  label: "Comportement",          desc: "Éducation, socialisation, stress" },
              { emoji: "🐣", slug: "elevage",       label: "Élevage",               desc: "Reproduction, portées, sevrage" },
              { emoji: "🏃", slug: "sorties",       label: "Sorties & activités",   desc: "Sport, balades, voyages" },
              { emoji: "💊", slug: "medicaments",   label: "Médicaments",           desc: "Traitements, antiparasitaires" },
              { emoji: "🏥", slug: "veterinaire",   label: "Vétérinaire",           desc: "Consultations, urgences, coût" },
              { emoji: "📋", slug: "pedigree",      label: "Pedigree & LOF",        desc: "Inscriptions, expositions" },
              { emoji: "✂️", slug: "toilettage",    label: "Toilettage",            desc: "Brossage, bain, coupe" },
              { emoji: "✈️", slug: "voyages",       label: "Voyages",               desc: "Transport, passeport, hébergement" },
              { emoji: "🎾", slug: "jeux",          label: "Jeux & enrichissement", desc: "Stimulation, jouets, activités" },
            ].map((theme) => (
              <Link
                key={theme.slug}
                href={`/${locale}/${getCategorySlug("chien", locale)}?theme=${theme.slug}`}
                className="group flex items-start gap-3 p-4 border border-border bg-cream hover:bg-[#f0fdfa] hover:border-[#0d9488]/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                style={{ borderRadius: "clamp(10px, 1.5vw, 16px)" }}
              >
                <span className="text-2xl mt-0.5 shrink-0">{theme.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-ink group-hover:text-[#0d9488] transition-colors leading-tight">
                    {theme.label}
                  </p>
                  <p className="text-[11px] text-muted mt-0.5 leading-snug">{theme.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 1 : SPECIES EXPLORER ─────────────────────────── */}
      <section className="px-5" style={{ paddingTop: "clamp(56px, 7.5vw, 110px)", paddingBottom: "clamp(56px, 7.5vw, 110px)" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: "clamp(32px, 4vw, 60px)" }}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0d9488] mb-2">
              {sl.explorerEyebrow}
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                {sl.explorerTitle}
              </h2>
              <Link
                href={`/${locale}/themes`}
                className="hidden sm:block text-xs font-semibold text-[#0d9488] hover:underline"
              >
                {sl.explorerLink}
              </Link>
            </div>
          </div>

          <SpeciesExplorer species={speciesData} locale={locale} />
        </div>
      </section>

      {/* ── SECTION 2 : SÉLECTION ÉDITORIALE ─────────────────────── */}
      <section className="px-5 bg-white border-t border-border" style={{ paddingTop: "clamp(56px, 7.5vw, 110px)", paddingBottom: "clamp(56px, 7.5vw, 110px)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between" style={{ marginBottom: "clamp(32px, 4vw, 60px)" }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0d9488] mb-2">
                {sl.editorialEyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">
                {sl.editorialTitle}
              </h2>
            </div>
            <Link
              href={`/${locale}/${getCategorySlug("chien", locale)}`}
              className="hidden sm:block text-xs font-semibold text-[#0d9488] hover:underline"
            >
              {sl.editorialLink}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "clamp(16px, 2vw, 32px)" }}>
            {editorialPicks.map((a, i) => {
              const themeColor = a.theme ? THEME_COLORS[a.theme] : null;
              const isPopular = i < 2;
              const heroImage = EDITORIAL_HERO_IMAGES[`${a.category}-${a.theme}`];
              return (
                <Link
                  key={a.slug}
                  href={`/${locale}/${getCategorySlug(a.category, locale)}/${a.slug}`}
                  className="group flex flex-col bg-white border border-border overflow-hidden hover:shadow-lg hover:shadow-gray-200 hover:border-gray-300 hover:-translate-y-1 transition-all duration-300"
                  style={{ borderRadius: "clamp(12px, 2vw, 20px)" }}
                >
                  {/* Hero image */}
                  {heroImage && (
                    <div className="relative h-40 overflow-hidden bg-gray-100">
                      <img
                        src={heroImage}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/15 transition-all duration-300" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <span className={`font-mono text-[9px] uppercase tracking-wide font-bold px-2 py-0.5 rounded-full ${themeColor?.bg ?? "bg-gray-100"} ${themeColor?.text ?? "text-gray-600"}`}>
                        {a.theme ? (THEME_LABELS[a.theme] ?? "Guide") : "Guide"}
                      </span>
                      <div className="flex items-center gap-2">
                        {isPopular && (
                          <span className="font-mono text-[8px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#f0fdfa] text-[#0d9488] border border-[#0d9488]/20">
                            {sl.popular}
                          </span>
                        )}
                        <span className="font-mono text-[9px] text-muted">{a.readingTime} {sl.minutes}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-sm text-ink leading-snug mb-2 flex-1 group-hover:text-[#0d9488] transition-colors line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-2">{a.excerpt}</p>

                    <div className="flex justify-between items-center pt-3 border-t border-border mt-auto">
                      <span className="text-[10px] font-mono text-muted capitalize">{a.category}</span>
                      <span className="text-xs font-semibold text-[#0d9488] group-hover:translate-x-0.5 transition-transform">
                        {sl.readMore}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : GUIDES D'ACHAT (AFFILIATION) ─────────────── */}
      <section className="px-5 bg-[#1a1a18]" style={{ paddingTop: "clamp(60px, 8vw, 120px)", paddingBottom: "clamp(60px, 8vw, 120px)" }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ marginBottom: "clamp(40px, 5vw, 80px)" }}>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0d9488] mb-2">
              {sl.affiliateEyebrow}
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {sl.affiliateTitle}{" "}
                <em className="text-[#0d9488] not-italic">Toujours.</em>
              </h2>
              <Link
                href={`/${locale}/produits`}
                className="hidden sm:block text-xs font-semibold text-white/40 hover:text-white/70 transition-colors"
              >
                {sl.affiliateLink}
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/40 max-w-xl">
              {sl.affiliateSub}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: "clamp(16px, 2vw, 32px)" }}>
            {AFFILIATE_GUIDES.map((g) => (
              <Link
                key={g.href}
                href={`/${locale}${g.href}`}
                className="group flex flex-col p-5 transition-all duration-300 bg-white/5 border border-white/[0.08] hover:bg-white/[0.09] hover:border-white/[0.15] hover:shadow-lg hover:shadow-white/10"
                style={{ borderRadius: "clamp(12px, 2vw, 20px)" }}
              >
                {/* Icon + badge */}
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${g.color}22`, border: `1px solid ${g.color}44`, borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                  >
                    {g.icon}
                  </div>
                  <span
                    className="font-mono text-[8px] uppercase tracking-wide px-2 py-0.5 border transition-all duration-200"
                    style={{ color: g.color, borderColor: `${g.color}44`, background: `${g.color}15`, borderRadius: "clamp(4px, 0.8vw, 8px)" }}
                  >
                    {g.badge}
                  </span>
                </div>

                {/* Category */}
                <div
                  className="font-mono text-[9px] uppercase tracking-wide mb-2"
                  style={{ color: g.color }}
                >
                  {g.category} · {g.label}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-2 flex-1 group-hover:text-[#0d9488] transition-colors">
                  {g.title}
                </h3>

                {/* Desc */}
                <p className="text-[12px] text-white/40 leading-relaxed mb-5 line-clamp-2">{g.desc}</p>

                {/* CTA */}
                <div className="flex justify-between items-center">
                  <span
                    className="font-mono text-[9px] uppercase tracking-wide px-2 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
                  >
                    Indépendant
                  </span>
                  <span className="text-xs font-semibold text-[#0d9488] group-hover:translate-x-0.5 transition-transform">
                    {g.cta} →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="mt-8 text-center text-[11px] text-white/20 font-mono">
            Nos guides sont 100% indépendants. Certains liens peuvent générer une commission sans impact sur nos recommandations.
          </p>
        </div>
      </section>

      {/* ── SECTION 4 : CRÉDIBILITÉ ──────────────────────────────── */}
      <section className="px-5 bg-white border-t border-border" style={{ paddingTop: "clamp(56px, 7.5vw, 110px)", paddingBottom: "clamp(56px, 7.5vw, 110px)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="border border-border p-8 lg:p-11 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-cream transition-all duration-300" style={{ borderRadius: "clamp(14px, 2.5vw, 24px)" }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#0d9488] mb-3">
                {sl.trustEyebrow}
              </p>
              <h2 className="text-2xl font-bold text-ink mb-4 leading-tight">
                {sl.trustTitle}<br />
                <span className="text-[#0d9488]">validé par des vétérinaires.</span>
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                {sl.trustBody}
              </p>
              <div className="flex gap-3">
                <Link
                  href={`/${locale}/${getCategorySlug("chien", locale)}`}
                  className="px-5 py-2.5 bg-[#0d9488] text-white text-sm font-semibold hover:bg-[#0f766e] hover:shadow-lg hover:shadow-[#0d9488]/20 transition-all duration-200"
                  style={{ borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                >
                  {sl.trustCta1}
                </Link>
                <Link
                  href={`/${locale}/${getCategorySlug("chat", locale)}`}
                  className="px-5 py-2.5 bg-white border border-border text-ink text-sm font-semibold hover:bg-gray-50 hover:shadow-sm transition-all duration-200"
                  style={{ borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                >
                  {sl.trustCta2}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {sl.trustPoints.map((v) => (
                <div key={v.title} className="p-4 bg-white border border-border hover:shadow-md hover:border-[#0d9488]/20 transition-all duration-200" style={{ borderRadius: "clamp(10px, 1.5vw, 16px)" }}>
                  <div className="text-xl mb-2.5">{v.icon}</div>
                  <div className="text-sm font-semibold text-ink mb-1">{v.title}</div>
                  <div className="text-[11px] text-muted leading-relaxed">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
