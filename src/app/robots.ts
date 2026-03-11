import type { MetadataRoute } from "next";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/fr/chien/",
          "/fr/chat/",
          "/fr/symptomes/",
          "/fr/produits/",
          "/fr/a-propos",
          "/fr/mentions-legales",
          "/fr/confidentialite",
        ],
        disallow: [
          "/api/",
          "/fr/dashboard",
          "/fr/animals/",
          "/fr/carnet/",
          "/fr/diagnose",
          "/fr/profile",
          "/fr/onboarding",
          "/fr/sign-in/",
          "/fr/sign-up/",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
