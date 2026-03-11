"use client";

import { useState } from "react";
import Link from "next/link";
import { getCategorySlug } from "@/lib/categories";

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

const UI_LABELS: Record<string, { subjects: string; recent: string; explore: string }> = {
  fr: { subjects: "Sujets couverts", recent: "Guides récents", explore: "Explorer" },
  en: { subjects: "Topics covered", recent: "Recent guides", explore: "Explore" },
  es: { subjects: "Temas cubiertos", recent: "Guías recientes", explore: "Explorar" },
  de: { subjects: "Behandelte Themen", recent: "Aktuelle Ratgeber", explore: "Erkunden" },
  it: { subjects: "Argomenti trattati", recent: "Guide recenti", explore: "Esplora" },
  pt: { subjects: "Temas abordados", recent: "Guias recentes", explore: "Explorar" },
  nl: { subjects: "Behandelde onderwerpen", recent: "Recente gidsen", explore: "Verkennen" },
};

const THEME_EMOJIS: Record<string, string> = {
  sante: "🩺",
  alimentation: "🍖",
  races: "🧬",
  comportement: "🧠",
  elevage: "🐣",
  sorties: "🏃",
  medicaments: "💊",
  veterinaire: "🏥",
  pedigree: "📋",
  toilettage: "🛁",
  voyages: "✈️",
  jeux: "🎾",
};

const TAB_IMAGES: Record<string, { url: string; alt: string }> = {
  chien: { url: "https://images.unsplash.com/photo-1633722715463-d30628ceb4f9?auto=format&fit=crop&w=900&h=600&q=80", alt: "Golden Retriever jouant joyeusement dehors" },
  chat: { url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&h=600&q=80", alt: "Chat Maine Coon allongé confortablement" },
  lapin: { url: "https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f4?auto=format&fit=crop&w=900&h=600&q=80", alt: "Lapin gris adorable dans l'herbe" },
  oiseau: { url: "https://images.unsplash.com/photo-1591165946662-c7edf61cdccc?auto=format&fit=crop&w=900&h=600&q=80", alt: "Perroquet coloré perché sur une branche" },
  rongeurs: { url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&h=600&q=80", alt: "Petits rongeurs curieux et mignons" },
  reptile: { url: "https://images.unsplash.com/photo-1444464666175-1630541e4d5d?auto=format&fit=crop&w=900&h=600&q=80", alt: "Reptile exotique magnifique en terrarium" },
};

export interface SpeciesItem {
  id: string;
  emoji: string;
  label: string;
  number: string;
  color: string;
  light: string;
  border: string;
  tagline: string;
  desc: string;
  themes: string[];
  articles: Array<{
    title: string;
    slug: string;
    theme?: string;
    readingTime: number;
  }>;
  count: number;
}

interface SpeciesExplorerProps {
  species: SpeciesItem[];
  locale: string;
}

export default function SpeciesExplorer({ species, locale }: SpeciesExplorerProps) {
  const [activeId, setActiveId] = useState(species[0]?.id ?? "chien");
  const active = species.find((s) => s.id === activeId) ?? species[0];
  const ui = UI_LABELS[locale] ?? UI_LABELS.fr;

  if (!active) return null;

  return (
    <div>
      {/* Species tabs */}
      <div className="flex gap-2 mb-7 flex-wrap">
        {species.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm transition-all duration-300 border cursor-pointer hover:scale-105"
            style={
              activeId === s.id
                ? {
                    background: s.light,
                    borderColor: s.color,
                    color: s.color,
                    fontWeight: 700,
                    borderRadius: "clamp(8px, 1.5vw, 14px)",
                    boxShadow: `0 0 12px ${s.color}20`,
                  }
                : {
                    background: "white",
                    borderColor: "#E8E6E0",
                    color: "#6B6966",
                    fontWeight: 400,
                    borderRadius: "clamp(8px, 1.5vw, 14px)",
                  }
            }
          >
            <span>{s.emoji}</span>
            <span>{s.label}</span>
            <span className="font-mono text-[10px] opacity-50">{s.count}</span>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="bg-white border border-border overflow-hidden transition-all duration-300" style={{ borderRadius: "clamp(14px, 2.5vw, 24px)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left — description */}
          <div className="p-7">
            <div
              className="font-mono text-[9px] uppercase tracking-[2px] mb-3"
              style={{ color: active.color }}
            >
              {active.number} — {active.label}
            </div>
            <h3 className="text-lg font-bold text-ink mb-3 leading-tight">
              {active.tagline}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-6">{active.desc}</p>
            <Link
              href={`/${locale}/${getCategorySlug(active.id, locale)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: active.color, borderRadius: "clamp(8px, 1.5vw, 14px)", boxShadow: `0 0 12px ${active.color}30` }}
            >
              {ui.explore} {active.label}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Right — image */}
          <div className="hidden lg:block relative h-full min-h-[400px] overflow-hidden">
            <img
              src={TAB_IMAGES[active.id]?.url || TAB_IMAGES.chien.url}
              alt={TAB_IMAGES[active.id]?.alt || "Animal"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom — themes + articles */}
        <div className="p-7 border-t border-border space-y-8" style={{ backgroundColor: active.light + "40" }}>
          {/* Themes grid */}
          {active.themes.length > 0 && (
            <div>
              <div className="font-mono text-[9px] text-muted uppercase tracking-[1.5px] mb-3">
                {ui.subjects} · {active.themes.length}
              </div>
              <div className="flex flex-wrap gap-2">
                {active.themes.map((theme) => (
                  <Link
                    key={theme}
                    href={`/${locale}/${getCategorySlug(active.id, locale)}?theme=${theme}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:shadow-sm hover:scale-105"
                    style={{ background: active.light, color: active.color, borderRadius: "clamp(8px, 1.5vw, 14px)" }}
                  >
                    <span>{THEME_EMOJIS[theme]}</span>
                    <span>{THEME_LABELS[theme]}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Top articles */}
          {active.articles.length > 0 && (
            <div>
              <div className="font-mono text-[9px] text-muted uppercase tracking-[1.5px] mb-3">
                {ui.recent}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {active.articles.slice(0, 3).map((a) => (
                  <Link
                    key={a.slug}
                    href={`/${locale}/${getCategorySlug(active.id, locale)}/${a.slug}`}
                    className="group block p-4 border border-border hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 bg-cream transition-all duration-200"
                    style={{ borderRadius: "clamp(10px, 1.5vw, 16px)" }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="font-mono text-[9px] uppercase font-semibold"
                        style={{ color: active.color }}
                      >
                        {a.theme ? (THEME_LABELS[a.theme] ?? "Guide") : "Guide"}
                      </span>
                      <span className="font-mono text-[9px] text-muted">
                        {a.readingTime} min
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-ink leading-snug group-hover:text-[#0d9488] transition-colors line-clamp-2">
                      {a.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
