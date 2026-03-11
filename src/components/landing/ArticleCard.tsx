import Link from "next/link";

type Category =
  | "chien"
  | "chat"
  | "lapin"
  | "oiseau"
  | "rongeurs"
  | "reptile"
  | "poisson"
  | "furet"
  | "symptomes"
  | "produits";

/** djb2-style hash — much better distribution than charCodeAt(0) */
function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h;
}

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
    "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454",
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
    "https://images.unsplash.com/photo-1550159930-40066082a4fc",
    "https://images.unsplash.com/photo-1518796745738-41048802f99a",
  ],
  oiseau: [
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3",
    "https://images.unsplash.com/photo-1550159930-40066082a4fc",
    "https://images.unsplash.com/photo-1444464666168-49d633b86797",
  ],
  rongeurs: [
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c",
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
  ],
  reptile: [
    "https://images.unsplash.com/photo-1552435113-323534ca64ee",
    "https://images.unsplash.com/photo-1516912481808-3406841bd33c",
  ],
  poisson: [
    "https://images.unsplash.com/photo-1535591273668-578e31182c4f",
    "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d",
  ],
  furet: [
    "https://images.unsplash.com/photo-1528089129176-3dd4a57f6461",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
  ],
  symptomes: [
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf",
  ],
  produits: [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def",
  ],
};

/** Theme-based photo pools — used when theme is known */
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
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b",
  ],
  voyages: [
    "https://images.unsplash.com/photo-1517849845537-4d257902454a",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
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

function getArticlePhoto(category: string, slug: string, theme?: string): string {
  const hash = strHash(slug);
  // Theme-based photo if theme known
  if (theme && THEME_PHOTOS[theme]) {
    const pool = THEME_PHOTOS[theme];
    return pool[hash % pool.length];
  }
  const photos = CATEGORY_PHOTOS[category] ?? [DEFAULT_PHOTO];
  return photos[hash % photos.length];
}

const CATEGORY_LABELS: Record<Category, string> = {
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

const CATEGORY_COLORS: Record<Category, string> = {
  chien: "bg-amber-50 text-amber-700",
  chat: "bg-purple-50 text-purple-700",
  lapin: "bg-orange-50 text-orange-700",
  oiseau: "bg-sky-50 text-sky-700",
  rongeurs: "bg-yellow-50 text-yellow-700",
  reptile: "bg-lime-50 text-lime-700",
  poisson: "bg-blue-50 text-blue-700",
  furet: "bg-rose-50 text-rose-700",
  symptomes: "bg-[#f0fdfa] text-[#0d9488]",
  produits: "bg-green-50 text-green-700",
};

const CATEGORY_BORDER_COLOR: Record<Category, string> = {
  chien: "#d97706",
  chat: "#9333ea",
  lapin: "#ea580c",
  oiseau: "#0284c7",
  rongeurs: "#ca8a04",
  reptile: "#65a30d",
  poisson: "#2563eb",
  furet: "#e11d48",
  symptomes: "#0d9488",
  produits: "#16a34a",
};

const CATEGORY_EMOJI: Record<Category, string> = {
  chien: "🐕",
  chat: "🐱",
  lapin: "🐰",
  oiseau: "🦜",
  rongeurs: "🐹",
  reptile: "🦎",
  poisson: "🐟",
  furet: "🦡",
  symptomes: "🩺",
  produits: "🛍️",
};

export interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: Category;
  slug: string;
  readingTime: number;
  publishedAt?: string;
  locale?: string;
  theme?: string;
}

export default function ArticleCard({
  title,
  excerpt,
  category,
  slug,
  readingTime,
  locale = "fr",
  theme,
}: ArticleCardProps) {
  const photoUrl = getArticlePhoto(category, slug, theme);

  return (
    <Link
      href={`/${locale}/${category}/${slug}`}
      className="group flex flex-col gap-4 bg-white border border-border rounded-2xl p-5 hover:border-[#0d9488]/40 hover:shadow-lg transition-all duration-200"
      style={{ borderLeft: `3px solid ${CATEGORY_BORDER_COLOR[category]}` }}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-40 rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={`${photoUrl}?auto=format&fit=crop&w=600&q=75`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <span
          className="absolute top-3 right-3 text-2xl drop-shadow-md"
          role="img"
          aria-hidden="true"
        >
          {CATEGORY_EMOJI[category]}
        </span>
        <span className="absolute bottom-2 left-2 font-mono text-[10px] bg-black/60 text-white/90 px-2 py-0.5 rounded-full">
          {readingTime} min
        </span>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono font-medium ${CATEGORY_COLORS[category]}`}
        >
          {CATEGORY_LABELS[category]}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-[#0d9488] transition-colors line-clamp-2 flex-1">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-xs text-muted leading-relaxed line-clamp-2">
        {excerpt}
      </p>

      {/* CTA */}
      <span className="text-xs text-[#0d9488] font-medium inline-flex items-center gap-1 mt-auto">
        Lire l&apos;article
        <svg
          className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
          />
        </svg>
      </span>
    </Link>
  );
}
