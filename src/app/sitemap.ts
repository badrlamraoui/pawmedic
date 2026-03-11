import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { locales } from "@/i18n/config";
import { getCategorySlug } from "@/lib/categories";
import { VETS } from "@/lib/vets";
import { MEDICATIONS } from "@/lib/medications";
import { BREEDS } from "@/lib/breeds";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.vercel.app";

const CONTENT_CATEGORIES = ["chien", "chat", "lapin", "oiseau", "rongeurs", "reptile", "poisson", "furet", "symptomes"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const frArticles = getAllArticles("fr");

  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${APP_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: locale === "fr" ? 1.0 : 0.9,
    });

    // Category hubs
    for (const cat of CONTENT_CATEGORIES) {
      const localizedCat = getCategorySlug(cat, locale);
      entries.push({
        url: `${APP_URL}/${locale}/${localizedCat}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: ["chien", "chat"].includes(cat) ? 0.9 : 0.8,
      });
    }

    // Articles
    for (const article of frArticles) {
      const localizedCat = getCategorySlug(article.category, locale);
      entries.push({
        url: `${APP_URL}/${locale}/${localizedCat}/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  // Vet profiles
  for (const vet of VETS) {
    for (const locale of locales) {
      entries.push({
        url: `${APP_URL}/${locale}/veterinaires/${vet.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Rodent sub-species pages
  const SUBSPECIES_KEYS = ["hamster", "cochon-inde", "souris", "rat"];
  for (const locale of locales) {
    for (const sp of SUBSPECIES_KEYS) {
      entries.push({
        url: `${APP_URL}/${locale}/rongeurs/${sp}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      });
    }
  }

  // Medications — index + individual pages
  for (const locale of locales) {
    entries.push({
      url: `${APP_URL}/${locale}/medicaments`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    });
    for (const med of MEDICATIONS) {
      entries.push({
        url: `${APP_URL}/${locale}/medicaments/${med.slug}`,
        lastModified: new Date(med.lastUpdatedAt),
        changeFrequency: "monthly",
        priority: 0.80,
      });
    }
  }

  // Breed profiles — index + individual pages
  for (const locale of locales) {
    for (const breedCat of ["chien", "chat"] as const) {
      const localizedCat = getCategorySlug(breedCat, locale);
      entries.push({
        url: `${APP_URL}/${locale}/${localizedCat}/races`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      });
    }
    for (const breed of BREEDS) {
      const localizedCat = getCategorySlug(breed.category, locale);
      entries.push({
        url: `${APP_URL}/${locale}/${localizedCat}/races/${breed.slug}`,
        lastModified: new Date(breed.lastUpdatedAt),
        changeFrequency: "monthly",
        priority: 0.80,
      });
    }
  }

  return entries;
}
