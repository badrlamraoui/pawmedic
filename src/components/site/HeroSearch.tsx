"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { ArticleFrontmatter } from "@/lib/articles";

interface HeroSearchProps {
  articles: ArticleFrontmatter[];
  locale: string;
}

export default function HeroSearch({ articles, locale }: HeroSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results =
    query.length >= 2
      ? articles
          .filter(
            (a) =>
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.excerpt.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl">
      {/* Input */}
      <div className="relative flex items-center">
        <svg
          className="absolute left-4 w-5 h-5 text-white/40 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Chercher un symptôme, un animal…"
          className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/60 focus:border-[#0d9488]/60 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="absolute right-4 text-white/40 hover:text-white"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {open && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-border">
          {results.length > 0 ? (
            <ul>
              {results.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/${locale}/${article.category}/${article.slug}`}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-cream transition-colors group"
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="text-lg shrink-0 mt-0.5">
                      {(
                        {
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
                        } as Record<string, string>
                      )[article.category] ?? "📄"}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink group-hover:text-[#0d9488] transition-colors line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {article.excerpt}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-muted bg-cream px-2 py-0.5 rounded-full mt-0.5 capitalize">
                      {article.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted">
                Aucun résultat pour « {query} »
              </p>
              <p className="text-xs text-muted/60 mt-1">
                Essayez un autre terme ou parcourez nos catégories.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
