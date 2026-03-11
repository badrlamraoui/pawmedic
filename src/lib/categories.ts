import type { Locale } from "@/i18n/config";

// Canonical (French) → localized slug per locale
export const CATEGORY_SLUGS: Record<string, Record<string, string>> = {
  fr: { chien: "chien", chat: "chat", lapin: "lapin", oiseau: "oiseau", rongeurs: "rongeurs", reptile: "reptile", furet: "furet", poisson: "poisson" },
  en: { chien: "dog", chat: "cat", lapin: "rabbit", oiseau: "bird", rongeurs: "rodents", reptile: "reptile", furet: "ferret", poisson: "fish" },
  es: { chien: "perro", chat: "gato", lapin: "conejo", oiseau: "pajaro", rongeurs: "roedores", reptile: "reptil", furet: "huron", poisson: "pez" },
  de: { chien: "hund", chat: "katze", lapin: "kaninchen", oiseau: "vogel", rongeurs: "nagetiere", reptile: "reptil", furet: "frettchen", poisson: "fisch" },
  it: { chien: "cane", chat: "gatto", lapin: "coniglio", oiseau: "uccello", rongeurs: "roditori", reptile: "rettile", furet: "furetto", poisson: "pesce" },
  pt: { chien: "cao", chat: "gato", lapin: "coelho", oiseau: "passaro", rongeurs: "roedores", reptile: "reptil", furet: "furao", poisson: "peixe" },
  nl: { chien: "hond", chat: "kat", lapin: "konijn", oiseau: "vogel", rongeurs: "knaagdieren", reptile: "reptiel", furet: "fret", poisson: "vis" },
};

// Reverse lookup: localized slug → canonical (French) category
const REVERSE_LOOKUP: Record<string, Record<string, string>> = {};
for (const [locale, map] of Object.entries(CATEGORY_SLUGS)) {
  REVERSE_LOOKUP[locale] = {};
  for (const [canonical, localized] of Object.entries(map)) {
    REVERSE_LOOKUP[locale][localized] = canonical;
  }
}

/** Get the localized URL slug for a canonical (French) category */
export function getCategorySlug(canonical: string, locale: string): string {
  return CATEGORY_SLUGS[locale]?.[canonical] ?? canonical;
}

/** Reverse-lookup: get the canonical (French) category from a localized slug */
export function getCanonicalCategory(localizedSlug: string, locale: string): string {
  return REVERSE_LOOKUP[locale]?.[localizedSlug] ?? localizedSlug;
}

/** Amazon config per locale */
export const AMAZON_CONFIG: Record<string, { domain: string; tag: string }> = {
  fr: { domain: "amazon.fr",     tag: "pawmedic-fr-21" },
  en: { domain: "amazon.co.uk",  tag: "pawmedic-gb-21" },
  es: { domain: "amazon.es",     tag: "pawmedic-es-21" },
  de: { domain: "amazon.de",     tag: "pawmedic-de-21" },
  it: { domain: "amazon.it",     tag: "pawmedic-it-21" },
  pt: { domain: "amazon.es",     tag: "pawmedic-es-21" }, // no amazon.pt
  nl: { domain: "amazon.nl",     tag: "pawmedic-nl-21" },
};

/** Build an Amazon affiliate URL for a product */
export function buildAmazonUrl(asin: string, locale: string): string {
  const config = AMAZON_CONFIG[locale] ?? AMAZON_CONFIG.fr;
  return `https://www.${config.domain}/dp/${asin}?tag=${config.tag}`;
}
