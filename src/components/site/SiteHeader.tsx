"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { getCategorySlug } from "@/lib/categories";
import { localeConfig } from "@/i18n/config";

const MAIN_NAV = [
  { href: "/chien", label: "Chien" },
  { href: "/chat", label: "Chat" },
  { href: "/produits", label: "Produits" },
];

const THEMES_NAV = [
  { emoji: "🩺", label: "Santé & maladies", href: "/chien?theme=sante", desc: "Symptômes, diagnostics, soins" },
  { emoji: "🍖", label: "Alimentation", href: "/chien?theme=alimentation", desc: "Nutrition, régimes, compléments" },
  { emoji: "🧬", label: "Races", href: "/chien?theme=races", desc: "Caractère, morphologie, origines" },
  { emoji: "🧠", label: "Comportement", href: "/chien?theme=comportement", desc: "Éducation, socialisation, stress" },
  { emoji: "🐣", label: "Élevage", href: "/chien?theme=elevage", desc: "Reproduction, portées, sevrage" },
  { emoji: "🏃", label: "Sorties & activités", href: "/chien?theme=sorties", desc: "Sport, balades, voyages" },
  { emoji: "💊", label: "Médicaments", href: "/medicaments", desc: "Base de données médicaments vétérinaires" },
  { emoji: "🏥", label: "Vétérinaire", href: "/chien?theme=veterinaire", desc: "Consultations, urgences, coût" },
  { emoji: "📋", label: "Pedigree & LOF", href: "/chien?theme=pedigree", desc: "Inscriptions, expositions, lignées" },
];

const AUTRES_ANIMAUX = [
  { href: "/lapin", label: "Lapin", emoji: "🐰", desc: "Soins & santé", photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308" },
  { href: "/oiseau", label: "Oiseau", emoji: "🦜", desc: "Plumes & soins", photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3" },
  { href: "/rongeurs", label: "Rongeurs", emoji: "🐹", desc: "Hamster & cochon d'Inde", photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c" },
  { href: "/reptile", label: "Reptile", emoji: "🦎", desc: "Terrarium & soins", photo: "https://images.unsplash.com/photo-1552435113-323534ca64ee" },
  { href: "/poisson", label: "Poisson", emoji: "🐟", desc: "Aquarium & santé", photo: "https://images.unsplash.com/photo-1535591273668-578e31182c4f" },
  { href: "/furet", label: "Furet", emoji: "🦡", desc: "Alimentation & soins", photo: "https://images.unsplash.com/photo-1528089129176-3dd4a57f6461" },
];

const ALL_MOBILE_LINKS = [
  { href: "/chien", emoji: "🐕", label: "Chien" },
  { href: "/chat", emoji: "🐱", label: "Chat" },
  { href: "/lapin", emoji: "🐰", label: "Lapin" },
  { href: "/oiseau", emoji: "🦜", label: "Oiseau" },
  { href: "/rongeurs", emoji: "🐹", label: "Rongeurs" },
  { href: "/reptile", emoji: "🦎", label: "Reptile" },
  { href: "/poisson", emoji: "🐟", label: "Poisson" },
  { href: "/furet", emoji: "🦡", label: "Furet" },
  { href: "/symptomes", emoji: "🩺", label: "Santé" },
  { href: "/chien?theme=races", emoji: "🧬", label: "Races" },
  { href: "/chien?theme=comportement", emoji: "🧠", label: "Comportement" },
  { href: "/chien?theme=sorties", emoji: "🏃", label: "Sorties" },
  { href: "/medicaments", emoji: "💊", label: "Médicaments" },
  { href: "/produits", emoji: "🛍️", label: "Produits" },
  { href: "/themes", emoji: "📚", label: "Thèmes" },
];

/** Convert a canonical French href (/chien, /chien?theme=sante) to a localized one */
function localizeHref(href: string, locale: string): string {
  const [pathPart, query] = href.split("?");
  const segments = pathPart.split("/").filter(Boolean);
  if (segments.length > 0) {
    segments[0] = getCategorySlug(segments[0], locale);
  }
  return "/" + segments.join("/") + (query ? "?" + query : "");
}

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [animauxOpen, setAnimauxOpen] = useState(false);
  const [themesOpen, setThemesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const themesRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as string) || "fr";

  const isActive = (href: string) =>
    pathname.includes(href.replace("/", ""));

  const isAnimauxActive = AUTRES_ANIMAUX.some((a) =>
    pathname.includes(a.href.replace("/", ""))
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAnimauxOpen(false);
      }
      if (themesRef.current && !themesRef.current.contains(e.target as Node)) {
        setThemesOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
          {/* Paw print SVG */}
          <svg
            className="w-5 h-5 text-[#0d9488]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <ellipse cx="5" cy="7.5" rx="1.8" ry="2.5" />
            <ellipse cx="9" cy="5.5" rx="1.8" ry="2.5" />
            <ellipse cx="15" cy="5.5" rx="1.8" ry="2.5" />
            <ellipse cx="19" cy="7.5" rx="1.8" ry="2.5" />
            <path d="M12 10c-4 0-7 2.5-7 5.5 0 2 1.5 3.5 3.5 3.5.8 0 1.5-.2 2-.5.3-.2.7-.2 1 0 .5.3 1.2.5 2 .5 2 0 3.5-1.5 3.5-3.5C19 12.5 16 10 12 10z" />
          </svg>
          <span className="font-mono text-sm font-semibold tracking-widest text-[#1a1a18]">
            PAWMEDIC
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {MAIN_NAV.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${localizeHref(link.href, locale)}`}
              className={`px-3 py-2 text-sm transition-colors ${
                isActive(link.href)
                  ? "text-[#0d9488]"
                  : "text-gray-600 hover:text-[#1a1a18]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Thèmes mega-menu */}
          <div
            className="relative"
            ref={themesRef}
            onMouseLeave={() => setThemesOpen(false)}
          >
            <button
              type="button"
              onMouseEnter={() => setThemesOpen(true)}
              onClick={() => setThemesOpen(!themesOpen)}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-[#1a1a18] transition-colors"
            >
              Thèmes
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${themesOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {themesOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-white rounded-2xl shadow-2xl border border-border p-5 z-50"
                onMouseEnter={() => setThemesOpen(true)}
                onMouseLeave={() => setThemesOpen(false)}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-3">Tous les sujets</p>
                <div className="grid grid-cols-3 gap-2">
                  {THEMES_NAV.map((t) => (
                    <Link
                      key={t.label}
                      href={`/${locale}${localizeHref(t.href, locale)}`}
                      className="group flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[#f0fdfa] transition-colors"
                      onClick={() => setThemesOpen(false)}
                    >
                      <span className="text-xl mt-0.5">{t.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-[#1a1a18] group-hover:text-[#0d9488] transition-colors">{t.label}</p>
                        <p className="text-[10px] text-muted leading-tight">{t.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <Link
                    href={`/${locale}/themes`}
                    className="text-xs text-[#0d9488] font-medium hover:underline"
                    onClick={() => setThemesOpen(false)}
                  >
                    Voir tous les thèmes →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Animaux mega-menu */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseLeave={() => setAnimauxOpen(false)}
          >
            <button
              type="button"
              onMouseEnter={() => setAnimauxOpen(true)}
              onClick={() => setAnimauxOpen(!animauxOpen)}
              className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${
                isAnimauxActive
                  ? "text-[#0d9488]"
                  : "text-gray-600 hover:text-[#1a1a18]"
              }`}
            >
              Animaux
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${animauxOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Mega-menu dropdown */}
            {animauxOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-border p-5 z-50"
                onMouseEnter={() => setAnimauxOpen(true)}
                onMouseLeave={() => setAnimauxOpen(false)}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted mb-3">Autres animaux</p>
                <div className="grid grid-cols-3 gap-2">
                  {AUTRES_ANIMAUX.map((animal) => (
                    <Link
                      key={animal.href}
                      href={`/${locale}${localizeHref(animal.href, locale)}`}
                      className="group flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#f0fdfa] transition-colors"
                      onClick={() => setAnimauxOpen(false)}
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#f0fdfa]">
                        <img
                          src={`${animal.photo}?auto=format&fit=crop&w=80&q=70`}
                          alt={animal.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1a1a18] group-hover:text-[#0d9488] transition-colors">{animal.label}</p>
                        <p className="text-[10px] text-muted">{animal.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Language dropdown */}
          <div className="relative ml-2 border-l border-gray-200 pl-3" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-[#1a1a18]"
            >
              <span className="text-base leading-none">{localeConfig[locale as keyof typeof localeConfig]?.flag}</span>
              <span className="font-mono text-xs font-semibold tracking-widest uppercase">{locale}</span>
              <svg
                className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-border py-1.5 z-50">
                {["fr", "es", "de", "it", "pt", "nl"].map((loc) => {
                  const cfg = localeConfig[loc as keyof typeof localeConfig];
                  const isActive = locale === loc;
                  return (
                    <a
                      key={loc}
                      href={`/${loc}`}
                      onClick={() => setLangOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-[#f0fdfa] text-[#0d9488] font-semibold"
                          : "text-[#1a1a18] hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-base leading-none">{cfg?.flag}</span>
                      <div>
                        <div className="font-medium leading-tight">{cfg?.nativeName}</div>
                        <div className="text-[10px] text-muted font-mono uppercase tracking-wider">{loc}</div>
                      </div>
                      {isActive && (
                        <svg className="w-3.5 h-3.5 ml-auto text-[#0d9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden w-8 h-8 flex items-center justify-center text-[#1a1a18]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-5 py-4">
          <div className="grid grid-cols-2 gap-1">
            {ALL_MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${localizeHref(link.href, locale)}`}
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl transition-colors ${
                  isActive(link.href)
                    ? "bg-[#f0fdfa] text-[#0d9488]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#1a1a18]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-xl">{link.emoji}</span>
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
