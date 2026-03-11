import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  getArticle,
  getAllSlugs,
  getArticlesByCategory,
  type ArticleCategory,
} from "@/lib/articles";
import Breadcrumb from "@/components/site/Breadcrumb";
import AffiliateCard from "@/components/site/AffiliateCard";
import RelatedArticles from "@/components/site/RelatedArticles";
import ReadingProgress from "@/components/site/ReadingProgress";
import TableOfContents from "@/components/site/TableOfContents";
import { getVetForArticle } from "@/lib/vets";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://pawmedic.fr";

const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  chien: "Chien",
  chat: "Chat",
  lapin: "Lapin",
  oiseau: "Oiseau",
  rongeurs: "Rongeurs",
  reptile: "Reptile",
  poisson: "Poisson",
  furet: "Furet",
  symptomes: "Symptômes",
  produits: "Produits",
};

/** Multiple photos per category — picked by slug hash for variety */
const CATEGORY_PHOTOS: Record<string, string[]> = {
  chien: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    "https://images.unsplash.com/photo-1552053831-71594a27632d",
    "https://images.unsplash.com/photo-1601979031925-424e53b6caaa",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8",
  ],
  chat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    "https://images.unsplash.com/photo-1573865526739-10659fec2a0b",
    "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e",
    "https://images.unsplash.com/photo-1561948955-570b270e7c36",
    "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d",
    "https://images.unsplash.com/photo-1472491235688-bdc81a63246b",
    "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e",
  ],
  lapin: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
    "https://images.unsplash.com/photo-1518796745738-41048802f99a",
  ],
  oiseau: [
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
    "https://images.unsplash.com/photo-1444464666168-49d633b86797",
  ],
  rongeurs: ["https://images.unsplash.com/photo-1548767797-d8c844163c4c"],
  reptile: [
    "https://images.unsplash.com/photo-1552435113-323534ca64ee",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c",
  ],
  poisson: ["https://images.unsplash.com/photo-1535591273668-578e31182c4f"],
  furet: ["https://images.unsplash.com/photo-1528089129176-3dd4a57f6461"],
  symptomes: [
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  ],
  produits: ["https://images.unsplash.com/photo-1559839734-2b71ea197ec2"],
};

/** Theme-specific hero photos — give each subject its own visual identity */
const THEME_PHOTOS: Record<string, string[]> = {
  sante: [
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf",
  ],
  veterinaire: [
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  ],
  alimentation: [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
  ],
  medicaments: [
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
  ],
  toilettage: [
    "https://images.unsplash.com/photo-1604693868716-4a5c8acf45e1",
  ],
  voyages: [
    "https://images.unsplash.com/photo-1517849845537-4d257902454a",
  ],
  sorties: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8",
  ],
  comportement: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
  ],
  jeux: [
    "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
  ],
};

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e";

function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

function getHeroPhoto(category: string, slug: string, theme?: string): string {
  const hash = strHash(slug);
  if (theme && THEME_PHOTOS[theme]?.length) {
    const pool = THEME_PHOTOS[theme];
    return pool[hash % pool.length];
  }
  const pool = CATEGORY_PHOTOS[category] ?? [DEFAULT_PHOTO];
  return pool[hash % pool.length];
}

const THEME_LABELS: Record<string, string> = {
  sante: "Santé",
  alimentation: "Alimentation",
  races: "Races",
  comportement: "Comportement",
  elevage: "Élevage",
  sorties: "Sorties & activités",
  medicaments: "Médicaments",
  veterinaire: "Vétérinaire",
  pedigree: "Pedigree",
  toilettage: "Toilettage",
  voyages: "Voyages",
  jeux: "Jeux & activités",
};

const DIFFICULTY_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  expert: "Expert",
};

interface PageProps {
  params: Promise<{ locale: string; category: string; slug: string }>;
}

/**
 * Injects landscape images at the 3rd and 5th H2 boundaries for SEO and readability.
 * Uses category photo pool with a slug-derived offset so images vary per article.
 */
function injectMidImages(content: string, category: string, slug: string): string {
  const pool = CATEGORY_PHOTOS[category] ?? [DEFAULT_PHOTO];
  const totalH2s = (content.match(/^## /gm) ?? []).length;
  if (totalH2s < 4) return content;

  let h2Count = 0;
  return content.replace(/^(## .+)$/gm, (match, heading) => {
    h2Count++;
    if (h2Count === 3 || (h2Count === 5 && totalH2s >= 6)) {
      const photoIdx = strHash(slug + "mid" + h2Count) % pool.length;
      const photo = pool[photoIdx];
      const alt = heading.replace(/^## /, "").trim();
      return `\n![${alt}](${photo}?auto=format&fit=crop&w=900&h=500&q=80)\n\n${match}`;
    }
    return match;
  });
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâä]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

const mdxComponents = {
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugify(typeof children === "string" ? children : "");
    return <h2 id={id} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const id = slugify(typeof children === "string" ? children : "");
    return <h3 id={id} {...props}>{children}</h3>;
  },
};

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(({ category, slug }) => ({ category, slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug, category } = await params;
  const article = getArticle(slug, locale);
  if (!article) return {};

  const { frontmatter } = article;
  const url = `${APP_URL}/${locale}/${frontmatter.category}/${frontmatter.slug}`;
  const heroPhoto = getHeroPhoto(category, slug, frontmatter.theme);
  const ogImage = `${heroPhoto}?auto=format&fit=crop&w=1200&h=630&q=85`;

  const titleWords = frontmatter.title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const keywords = [
    ...new Set([...titleWords, ...(frontmatter.tags ?? [])]),
  ].slice(0, 10);

  return {
    title: `${frontmatter.title} — Guide Pawmedic`,
    description: frontmatter.excerpt,
    keywords,
    metadataBase: new URL(APP_URL),
    alternates: { canonical: url },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      type: "article",
      siteName: "Pawmedic",
      publishedTime: frontmatter.publishedAt,
      modifiedTime: frontmatter.lastUpdatedAt ?? frontmatter.publishedAt,
      locale: "fr_FR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: frontmatter.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.excerpt,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  const article = getArticle(slug, locale);

  if (!article) notFound();

  const { frontmatter, content } = article;
  const category = frontmatter.category as ArticleCategory;
  const vet = getVetForArticle(category, frontmatter.theme, slug);

  const related = getArticlesByCategory(category, locale)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  const articleUrl = `${APP_URL}/${locale}/${category}/${slug}`;
  const heroPhoto = getHeroPhoto(category, slug, frontmatter.theme);
  const ogImage = `${heroPhoto}?auto=format&fit=crop&w=1200&h=630&q=85`;

  const publishedDate = new Date(
    frontmatter.lastUpdatedAt || frontmatter.publishedAt
  ).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLdSchemas: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: frontmatter.title,
      description: frontmatter.excerpt,
      datePublished: frontmatter.publishedAt,
      dateModified: frontmatter.lastUpdatedAt ?? frontmatter.publishedAt,
      author: { "@type": "Person", name: vet.name, url: `${APP_URL}/${locale}/veterinaires/${vet.slug}` },
      publisher: { "@type": "Organization", name: "Pawmedic", url: APP_URL },
      image: { "@type": "ImageObject", url: ogImage, width: 1200, height: 630 },
      keywords: frontmatter.tags?.join(", ") ?? "",
      about: { "@type": "Thing", name: CATEGORY_LABELS[category] },
      url: articleUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Accueil", item: `${APP_URL}/${locale}` },
        { "@type": "ListItem", position: 2, name: CATEGORY_LABELS[category], item: `${APP_URL}/${locale}/${category}` },
        { "@type": "ListItem", position: 3, name: frontmatter.title, item: articleUrl },
      ],
    },
  ];

  if (frontmatter.faq && frontmatter.faq.length > 0) {
    jsonLdSchemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: frontmatter.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
      />

      <div className="max-w-6xl mx-auto px-5 py-8">
        <div className="lg:flex lg:gap-10 lg:items-start">
          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ── EDITORIAL HERO ─────────────────────────────── */}
            <div className="relative h-48 sm:h-[300px] overflow-hidden rounded-2xl mb-8 shadow-lg">
              <img
                src={`${heroPhoto}?auto=format&fit=crop&w=1400&q=85`}
                alt={frontmatter.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient: top scrim for breadcrumb + heavy bottom for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

              {/* Breadcrumb — top left */}
              <div className="absolute top-4 left-5">
                <Breadcrumb
                  items={[
                    { label: "Accueil", href: `/${locale}` },
                    { label: CATEGORY_LABELS[category], href: `/${locale}/${category}` },
                    { label: frontmatter.title },
                  ]}
                  className="text-white/70"
                />
              </div>

              {/* Hero content — bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-16">
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {frontmatter.theme && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#0d9488] text-white px-2.5 py-1 rounded-full">
                      {THEME_LABELS[frontmatter.theme] ?? frontmatter.theme}
                    </span>
                  )}
                  {frontmatter.difficulty && (
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full">
                      {DIFFICULTY_LABELS[frontmatter.difficulty] ?? frontmatter.difficulty}
                    </span>
                  )}
                  <span className="text-[10px] font-mono text-white/60 ml-auto">
                    {CATEGORY_LABELS[category]} · {frontmatter.readingTime} min
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-3xl font-bold text-white leading-tight drop-shadow-sm">
                  {frontmatter.title}
                </h1>

                {/* Date */}
                <p className="mt-1.5 text-xs text-white/55 font-mono">
                  Mis à jour le {publishedDate}
                </p>
              </div>
            </div>

            {/* ── EXCERPT PULL-QUOTE ──────────────────────────── */}
            <p className="text-lg sm:text-xl text-ink/80 leading-relaxed font-light border-l-4 border-[#0d9488] pl-5 mb-8">
              {frontmatter.excerpt}
            </p>

            {/* ── KEY TAKEAWAYS ───────────────────────────────── */}
            {frontmatter.keyTakeaways && frontmatter.keyTakeaways.length > 0 && (
              <div className="mb-8 rounded-2xl bg-[#f0fdfa] border border-[#0d9488]/20 px-6 py-5">
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0d9488] mb-3 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Points clés à retenir
                </p>
                <ul className="space-y-2">
                  {frontmatter.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink leading-relaxed">
                      <span className="text-[#0d9488] font-bold shrink-0 mt-0.5">·</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── AUTHOR BLOCK (top — style Dentaly) ──────────── */}
            <div className="mb-8 flex items-center gap-3 py-4 border-y border-border">
              <a href={`/${locale}/veterinaires/${vet.slug}`} className="shrink-0">
                <img
                  src={`${vet.photo}?auto=format&fit=crop&crop=faces&w=80&h=80&q=80`}
                  alt={vet.name}
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: `2px solid ${vet.color}` }}
                />
              </a>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted">Rédigé par</span>
                  <a href={`/${locale}/veterinaires/${vet.slug}`} className="text-sm font-semibold text-ink hover:text-[#0d9488] transition-colors">
                    {vet.name}
                  </a>
                  <span className="text-xs text-muted">·</span>
                  <span className="text-xs text-muted">{vet.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-[#0d9488] text-white px-2 py-0.5 rounded-full font-medium">✓ Contenu vérifié</span>
                  <span className="text-[10px] text-muted font-mono">Mis à jour le {publishedDate}</span>
                </div>
              </div>
            </div>

            {/* ── MOBILE TOC ──────────────────────────────────── */}
            <TableOfContents content={content} variant="mobile" />

            {/* ── ARTICLE BODY ────────────────────────────────── */}
            <article id="article-body" className="prose">
              <MDXRemote
                source={injectMidImages(content, category, slug)}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                components={mdxComponents}
              />
            </article>

            {/* ── FAQ ─────────────────────────────────────────── */}
            {frontmatter.faq && frontmatter.faq.length > 0 && (
              <section className="mt-10 mb-8">
                <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  Questions fréquentes
                </h2>
                <div className="space-y-3">
                  {frontmatter.faq.map((item, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-border overflow-hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 bg-white hover:bg-cream transition-colors list-none">
                        <span className="text-sm font-semibold text-ink pr-4 leading-snug">
                          {item.question}
                        </span>
                        <span className="text-[#0d9488] text-xl font-light shrink-0 group-open:rotate-45 transition-transform duration-200">
                          +
                        </span>
                      </summary>
                      <div className="px-5 py-4 bg-cream border-t border-border">
                        <p className="text-sm text-ink/80 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* ── AFFILIATE PRODUCTS ──────────────────────────── */}
            {frontmatter.affiliateProducts && frontmatter.affiliateProducts.length > 0 && (
              <section className="mt-10">
                <h2 className="text-base font-semibold text-ink mb-4">
                  Produits recommandés
                </h2>
                {frontmatter.affiliateProducts.map((product, i) => (
                  <AffiliateCard
                    key={i}
                    productName={product.name}
                    description={product.description}
                    price={product.price}
                    affiliateUrl={product.url}
                    merchant={product.merchant}
                    locale={locale}
                  />
                ))}
              </section>
            )}

            {/* ── RELATED ARTICLES ────────────────────────────── */}
            <RelatedArticles
              articles={related.map((a) => ({
                title: a.title,
                excerpt: a.excerpt,
                category: a.category,
                slug: a.slug,
                readingTime: a.readingTime,
                publishedAt: a.publishedAt,
                locale,
              }))}
              locale={locale}
            />
          </div>

          {/* ── DESKTOP TOC SIDEBAR ─────────────────────────── */}
          <TableOfContents content={content} variant="desktop" />
        </div>
      </div>
    </>
  );
}
