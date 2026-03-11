import Link from "next/link";

interface UrgencesBannerProps {
  locale: string;
}

const URGENCES = [
  { label: "Chien vomit du sang", href: "/symptomes/vomissement-sang-chien", emoji: "🩸" },
  { label: "Convulsions", href: "/symptomes/convulsions-chien", emoji: "⚡" },
  { label: "Coup de chaleur", href: "/symptomes/coup-de-chaleur-animal", emoji: "🌡️" },
  { label: "Ventre gonflé", href: "/chien/chien-ventre-gonfle", emoji: "🚨" },
  { label: "Difficultés respiratoires", href: "/chien/chien-respire-mal", emoji: "😮‍💨" },
];

export default function UrgencesBanner({ locale }: UrgencesBannerProps) {
  return (
    <div className="bg-red-50 border-y border-red-100 px-5 py-4">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 font-mono text-xs font-semibold text-red-600 uppercase tracking-widest shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Urgences vétérinaires
        </span>
        <div className="flex flex-wrap gap-2">
          {URGENCES.map((u) => (
            <Link
              key={u.href}
              href={`/${locale}${u.href}`}
              className="flex items-center gap-1 text-xs text-red-700 bg-red-100 hover:bg-red-200 border border-red-200 rounded-full px-3 py-1.5 transition-colors font-medium"
            >
              <span>{u.emoji}</span>
              {u.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
