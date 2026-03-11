import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type ArticleCategory = "chien" | "chat" | "lapin" | "oiseau" | "rongeurs" | "reptile" | "poisson" | "furet" | "symptomes" | "produits";

export const CATEGORY_META: Record<ArticleCategory, { label: string; emoji: string; description: string; photo: string }> = {
  chien:    { label: "Chien",     emoji: "🐕", description: "Symptômes, soins et conseils pour votre chien.",        photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80" },
  chat:     { label: "Chat",      emoji: "🐱", description: "Symptômes, soins et conseils pour votre chat.",         photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" },
  lapin:    { label: "Lapin",     emoji: "🐰", description: "Santé, alimentation et bien-être de votre lapin.",     photo: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80" },
  oiseau:   { label: "Oiseau",    emoji: "🦜", description: "Santé et soins pour vos oiseaux de compagnie.",        photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80" },
  rongeurs: { label: "Rongeurs",  emoji: "🐹", description: "Soins pour hamsters, cochons d'Inde et autres rongeurs.", photo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80" },
  reptile:  { label: "Reptile",   emoji: "🦎", description: "Santé et conditions de vie des reptiles.",             photo: "https://images.unsplash.com/photo-1552435113-323534ca64ee?auto=format&fit=crop&w=800&q=80" },
  poisson:  { label: "Poisson",   emoji: "🐟", description: "Entretien et santé des poissons en aquarium.",         photo: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80" },
  furet:    { label: "Furet",     emoji: "🦡", description: "Tout savoir sur l'alimentation et la santé du furet.", photo: "https://images.unsplash.com/photo-1528089129176-3dd4a57f6461?auto=format&fit=crop&w=800&q=80" },
  symptomes:{ label: "Symptômes", emoji: "🩺", description: "Identifier les symptômes et urgences vétérinaires.",  photo: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80" },
  produits: { label: "Produits",  emoji: "🛍️", description: "Comparatifs antiparasitaires, croquettes, accessoires.", photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" },
};

export interface AffiliateProduct {
  name: string;
  description: string;
  price: string;
  url: string;
  merchant: "amazon" | "zoomalia";
}

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  category: ArticleCategory;
  species?: "chien" | "chat" | "lapin" | "oiseau" | "rongeurs" | "hamster" | "cochon-inde" | "souris" | "rat" | "reptile" | "poisson" | "furet";
  excerpt: string;
  readingTime: number;
  publishedAt: string;
  affiliateProducts?: AffiliateProduct[];
  theme?: "sante" | "alimentation" | "races" | "comportement" | "elevage" | "sorties" | "medicaments" | "veterinaire" | "pedigree" | "toilettage" | "voyages" | "jeux";
  faq?: { question: string; answer: string }[];
  keyTakeaways?: string[];
  lastUpdatedAt?: string;
  author?: string;
  difficulty?: "debutant" | "intermediaire" | "expert";
  tags?: string[];
}

/** Resolve articles directory: locale-specific with fallback to French */
function getArticlesDir(locale = "fr"): string {
  if (locale === "fr") return path.join(process.cwd(), "src/content/articles");
  const localeDir = path.join(process.cwd(), `src/content/${locale}/articles`);
  if (fs.existsSync(localeDir)) return localeDir;
  return path.join(process.cwd(), "src/content/articles");
}

export function getAllArticles(locale = "fr"): ArticleFrontmatter[] {
  const dir = getArticlesDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      return matter(raw).data as ArticleFrontmatter;
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticlesByCategory(category: ArticleCategory, locale = "fr"): ArticleFrontmatter[] {
  return getAllArticles(locale).filter((a) => a.category === category);
}

export function getArticle(slug: string, locale = "fr"): { frontmatter: ArticleFrontmatter; content: string } | null {
  const dir = getArticlesDir(locale);
  if (!fs.existsSync(dir)) return null;
  const filePath = path.join(dir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as ArticleFrontmatter, content };
}

export function getAllSlugs(locale = "fr"): { category: ArticleCategory; slug: string }[] {
  const dir = getArticlesDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      return { category: data.category as ArticleCategory, slug: data.slug as string };
    })
    .filter((a) => a.category && a.slug);
}

export function getArticlesByTheme(theme: string, locale = "fr"): ArticleFrontmatter[] {
  return getAllArticles(locale).filter((a) => a.theme === theme);
}

export function getArticlesByCategoryAndTheme(category: ArticleCategory, theme: string, locale = "fr"): ArticleFrontmatter[] {
  return getAllArticles(locale).filter((a) => a.category === category && a.theme === theme);
}

export function getArticlesBySpecies(species: string, locale = "fr"): ArticleFrontmatter[] {
  return getAllArticles(locale).filter((a) => a.species === species);
}
