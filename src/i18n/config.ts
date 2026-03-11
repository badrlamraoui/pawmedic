export const locales = ["fr", "en", "es", "de", "it", "pt", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const localeConfig: Record<Locale, { name: string; nativeName: string; dateLocale: string; flag: string }> = {
  fr: { name: "French", nativeName: "Français", dateLocale: "fr-FR", flag: "🇫🇷" },
  en: { name: "English", nativeName: "English", dateLocale: "en-GB", flag: "🇬🇧" },
  es: { name: "Spanish", nativeName: "Español", dateLocale: "es-ES", flag: "🇪🇸" },
  de: { name: "German", nativeName: "Deutsch", dateLocale: "de-DE", flag: "🇩🇪" },
  it: { name: "Italian", nativeName: "Italiano", dateLocale: "it-IT", flag: "🇮🇹" },
  pt: { name: "Portuguese", nativeName: "Português", dateLocale: "pt-PT", flag: "🇵🇹" },
  nl: { name: "Dutch", nativeName: "Nederlands", dateLocale: "nl-NL", flag: "🇳🇱" },
};
