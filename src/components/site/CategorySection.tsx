import Link from "next/link";
import { getArticlesByCategory, getAllArticles } from "@/lib/articles";

interface CategorySectionProps {
  locale: string;
}

const TOPICS = [
  { emoji: "🩺", label: "Santé & maladies", theme: "sante" },
  { emoji: "🍖", label: "Alimentation", theme: "alimentation" },
  { emoji: "🧬", label: "Races", theme: "races" },
  { emoji: "🧠", label: "Comportement", theme: "comportement" },
  { emoji: "🐣", label: "Élevage", theme: "elevage" },
  { emoji: "🏃", label: "Sorties & sport", theme: "sorties" },
  { emoji: "💊", label: "Médicaments", theme: "medicaments" },
  { emoji: "🏥", label: "Vétérinaire", theme: "veterinaire" },
  { emoji: "📋", label: "Pedigree", theme: "pedigree" },
  { emoji: "🛁", label: "Toilettage", theme: "toilettage" },
  { emoji: "✈️", label: "Voyages", theme: "voyages" },
  { emoji: "🎾", label: "Jeux & jouets", theme: "jeux" },
];

const OTHER_SPECIES = [
  { href: "/lapin",    emoji: "🐰", label: "Lapin",    photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80" },
  { href: "/oiseau",   emoji: "🦜", label: "Oiseau",   photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80" },
  { href: "/rongeurs", emoji: "🐹", label: "Rongeurs", photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" },
  { href: "/reptile",  emoji: "🦎", label: "Reptile",  photo: "https://images.unsplash.com/photo-1552435113-323534ca64ee?auto=format&fit=crop&w=800&q=80" },
  { href: "/poisson",  emoji: "🐟", label: "Poisson",  photo: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80" },
  { href: "/furet",    emoji: "🦡", label: "Furet",    photo: "https://images.unsplash.com/photo-1528089129176-3dd4a57f6461?auto=format&fit=crop&w=800&q=80" },
];

export default function CategorySection({ locale }: CategorySectionProps) {
  const chienCount = getArticlesByCategory("chien").length;
  const chatCount = getArticlesByCategory("chat").length;
  const totalCount = getAllArticles().length;

  return (
    <section className="px-5 bg-[#1a1a18]" style={{ paddingTop: "clamp(64px, 8.5vw, 130px)", paddingBottom: "clamp(64px, 8.5vw, 130px)" }}>
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center" style={{ marginBottom: "clamp(56px, 7vw, 110px)" }}>
          <p className="font-mono text-xs uppercase tracking-[0.15em] text-[#0d9488] mb-3">
            Explorer par espèce
          </p>
          <h2 className="text-4xl sm:text-5xl font-serif italic text-white">
            Tous nos guides animaux
          </h2>
          <p className="mt-3 font-mono text-xs text-white/30 tracking-widest">
            {totalCount}+ GUIDES · 8 ESPÈCES · RACES · SANTÉ · ÉLEVAGE · SORTIES
          </p>
        </div>

        {/* Hero: Chien & Chat */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0d9488]/20 border border-[#0d9488]/30 text-[#0d9488] text-xs font-mono uppercase tracking-widest" style={{ borderRadius: "clamp(6px, 1vw, 12px)" }}>
              <span className="w-1.5 h-1.5 bg-[#0d9488] animate-pulse inline-block" style={{ borderRadius: "50%" }} />
              Animaux les plus populaires
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "clamp(16px, 2vw, 32px)" }}>
            {/* Chien */}
            <Link
              href={`/${locale}/chien`}
              className="relative overflow-hidden h-80 group cursor-pointer block transition-all duration-300 hover:shadow-xl"
              style={{ borderRadius: "clamp(14px, 2.5vw, 24px)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80"
                alt="Chien golden retriever"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/75 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl">🐕</span>
                  <span className="text-3xl font-serif italic font-bold text-white">Chien</span>
                </div>
                <p className="text-sm text-white/60 mt-1">Santé, alimentation, comportement</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-mono text-xs text-white/40">{chienCount} guides</p>
                  <span className="text-sm text-[#0d9488] font-medium">Voir les guides →</span>
                </div>
              </div>
            </Link>
            {/* Chat */}
            <Link
              href={`/${locale}/chat`}
              className="relative overflow-hidden h-80 group cursor-pointer block transition-all duration-300 hover:shadow-xl"
              style={{ borderRadius: "clamp(14px, 2.5vw, 24px)" }}
            >
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80"
                alt="Chat roux"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/75 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl">🐱</span>
                  <span className="text-3xl font-serif italic font-bold text-white">Chat</span>
                </div>
                <p className="text-sm text-white/60 mt-1">Nutrition, maladies, bien-être</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="font-mono text-xs text-white/40">{chatCount} guides</p>
                  <span className="text-sm text-[#0d9488] font-medium">Voir les guides →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Thèmes */}
        <div style={{ marginTop: "clamp(56px, 7vw, 110px)", marginBottom: "clamp(16px, 2vw, 32px)" }}>
          <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-5">
            Tous nos sujets
          </p>
          <div className="flex flex-wrap" style={{ gap: "clamp(8px, 1.2vw, 16px)" }}>
            {TOPICS.map((t) => (
              <Link
                key={t.label}
                href={`/${locale}/chien?theme=${t.theme}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-sm transition-all duration-200"
                style={{ borderRadius: "clamp(6px, 1vw, 12px)" }}
              >
                <span>{t.emoji}</span>
                <span>{t.label}</span>
              </Link>
            ))}
            <Link
              href={`/${locale}/themes`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0d9488]/15 border border-[#0d9488]/30 text-[#0d9488] text-sm hover:bg-[#0d9488]/25 hover:shadow-md transition-all duration-200"
              style={{ borderRadius: "clamp(6px, 1vw, 12px)" }}
            >
              Voir tous les thèmes →
            </Link>
          </div>
        </div>

        {/* Autres animaux */}
        <p className="font-mono text-xs uppercase tracking-widest text-white/40" style={{ marginTop: "clamp(40px, 5vw, 80px)", marginBottom: "clamp(16px, 2vw, 32px)" }}>
          Autres animaux
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" style={{ gap: "clamp(12px, 1.5vw, 24px)" }}>
          {OTHER_SPECIES.map((sp) => {
            const count = getArticlesByCategory(sp.href.replace("/", "") as "lapin").length;
            return (
              <Link
                key={sp.href}
                href={`/${locale}${sp.href}`}
                className="relative overflow-hidden h-40 group cursor-pointer block transition-all duration-300 hover:shadow-lg"
                style={{ borderRadius: "clamp(10px, 2vw, 16px)" }}
              >
                <img
                  src={sp.photo}
                  alt={sp.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/70 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl">{sp.emoji}</span>
                    <span className="text-base font-serif italic font-bold text-white leading-tight">
                      {sp.label}
                    </span>
                  </div>
                  {count > 0 && (
                    <p className="font-mono text-[10px] text-white/50 mt-0.5">{count} guides</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
