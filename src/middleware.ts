import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@/i18n/config";

const intlMiddleware = createMiddleware({ locales, defaultLocale, localePrefix: "always" });

const isPublicRoute = createRouteMatcher([
  // Landing & auth
  "/:locale",
  "/:locale/sign-in(.*)",
  "/:locale/sign-up(.*)",
  "/:locale/legal(.*)",
  // Content site — French canonical slugs (no auth required)
  "/:locale/chien(.*)",
  "/:locale/chat(.*)",
  "/:locale/lapin(.*)",
  "/:locale/oiseau(.*)",
  "/:locale/rongeurs(.*)",
  "/:locale/reptile(.*)",
  "/:locale/poisson(.*)",
  "/:locale/furet(.*)",
  "/:locale/symptomes(.*)",
  "/:locale/produits(.*)",
  // English localized category slugs
  "/:locale/dog(.*)",
  "/:locale/cat(.*)",
  "/:locale/rabbit(.*)",
  "/:locale/bird(.*)",
  "/:locale/rodents(.*)",
  "/:locale/ferret(.*)",
  "/:locale/fish(.*)",
  // Spanish localized category slugs
  "/:locale/perro(.*)",
  "/:locale/gato(.*)",
  "/:locale/conejo(.*)",
  "/:locale/pajaro(.*)",
  "/:locale/roedores(.*)",
  "/:locale/reptil(.*)",
  "/:locale/huron(.*)",
  "/:locale/pez(.*)",
  // German localized category slugs
  "/:locale/hund(.*)",
  "/:locale/katze(.*)",
  "/:locale/kaninchen(.*)",
  "/:locale/vogel(.*)",
  "/:locale/nagetiere(.*)",
  "/:locale/frettchen(.*)",
  "/:locale/fisch(.*)",
  // Italian localized category slugs
  "/:locale/cane(.*)",
  "/:locale/gatto(.*)",
  "/:locale/coniglio(.*)",
  "/:locale/uccello(.*)",
  "/:locale/roditori(.*)",
  "/:locale/rettile(.*)",
  "/:locale/furetto(.*)",
  "/:locale/pesce(.*)",
  // Portuguese localized category slugs
  "/:locale/cao(.*)",
  "/:locale/coelho(.*)",
  "/:locale/passaro(.*)",
  "/:locale/furao(.*)",
  "/:locale/peixe(.*)",
  // Dutch localized category slugs
  "/:locale/hond(.*)",
  "/:locale/kat(.*)",
  "/:locale/konijn(.*)",
  "/:locale/knaagdieren(.*)",
  "/:locale/reptiel(.*)",
  "/:locale/fret(.*)",
  "/:locale/vis(.*)",
  // Medications database
  "/:locale/medicaments(.*)",
  // Breed profiles under category
  "/:locale/chien/races(.*)",
  "/:locale/chat/races(.*)",
  "/:locale/dog/races(.*)",
  "/:locale/cat/races(.*)",
  // Vet profiles
  "/:locale/veterinaires(.*)",
  // Themes and misc
  "/:locale/themes(.*)",
  "/:locale/a-propos",
  "/:locale/mentions-legales",
  "/:locale/confidentialite",
  // APIs & system
  "/api/webhooks/(.*)",
  "/api/waitlist",
  "/sitemap.xml",
  "/robots.txt",
]);

const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // API routes: only apply auth check, skip intl locale redirect
  if (isApiRoute(req)) {
    if (!isPublicRoute(req)) await auth.protect();
    return NextResponse.next();
  }

  if (!isPublicRoute(req)) await auth.protect();
  return intlMiddleware(req);
});

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };
