import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Localized category slugs per locale (canonical = French name)
const CATEGORY_REWRITES: Record<string, Record<string, string>> = {
  en: { dog: "chien", cat: "chat", rabbit: "lapin", bird: "oiseau", rodents: "rongeurs", reptile: "reptile", ferret: "furet", fish: "poisson" },
  es: { perro: "chien", gato: "chat", conejo: "lapin", pajaro: "oiseau", roedores: "rongeurs", reptil: "reptile", huron: "furet", pez: "poisson" },
  de: { hund: "chien", katze: "chat", kaninchen: "lapin", vogel: "oiseau", nagetiere: "rongeurs", reptil: "reptile", frettchen: "furet", fisch: "poisson" },
  it: { cane: "chien", gatto: "chat", coniglio: "lapin", uccello: "oiseau", roditori: "rongeurs", rettile: "reptile", furetto: "furet", pesce: "poisson" },
  pt: { cao: "chien", gato: "chat", coelho: "lapin", passaro: "oiseau", roedores: "rongeurs", reptil: "reptile", furao: "furet", peixe: "poisson" },
  nl: { hond: "chien", kat: "chat", konijn: "lapin", vogel: "oiseau", knaagdieren: "rongeurs", reptiel: "reptile", fret: "furet", vis: "poisson" },
};

const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https" as const, hostname: "**.r2.dev" }] },
  serverExternalPackages: ["@react-pdf/renderer"],
  async rewrites() {
    const rules: { source: string; destination: string }[] = [];
    for (const [locale, map] of Object.entries(CATEGORY_REWRITES)) {
      for (const [localized, canonical] of Object.entries(map)) {
        // Skip if localized === canonical (would create loop)
        if (localized === canonical) continue;
        rules.push(
          { source: `/${locale}/${localized}`, destination: `/${locale}/${canonical}` },
          { source: `/${locale}/${localized}/:slug*`, destination: `/${locale}/${canonical}/:slug*` }
        );
      }
    }
    return rules;
  },
};

export default withNextIntl(nextConfig);
