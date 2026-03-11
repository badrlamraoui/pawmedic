"use client";
import { useState, useEffect } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  variant?: "mobile" | "desktop" | "both";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâä]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
    .replace(/[òóôö]/g, "o").replace(/[ùúûü]/g, "u").replace(/[ç]/g, "c")
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function parseHeadings(content: string): Heading[] {
  const lines = content.split("\n");
  const headings: Heading[] = [];
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const text = match[2].trim();
      headings.push({ id: slugify(text), text, level: match[1].length });
    }
  }
  return headings;
}

export default function TableOfContents({ content, variant = "both" }: TableOfContentsProps) {
  const headings = parseHeadings(content);

  // Precompute H2-only counter (mirrors .prose h2::before CSS counter)
  let h2Idx = 0;
  const numbered = headings.map((h) => {
    if (h.level === 2) h2Idx++;
    return { ...h, num: h.level === 2 ? String(h2Idx).padStart(2, "0") : null };
  });
  const [activeId, setActiveId] = useState<string>("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (headings.length < 3) return null;

  const showMobile = variant === "mobile" || variant === "both";
  const showDesktop = variant === "desktop" || variant === "both";

  return (
    <>
      {/* Mobile: collapsible */}
      {showMobile && (
        <div className={`mb-6 rounded-xl border border-border bg-cream overflow-hidden ${variant === "both" ? "lg:hidden" : ""}`}>
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-ink"
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#0d9488]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
              Table des matières
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open && (
            <ol className="px-4 pb-4 space-y-1 border-t border-border pt-3">
              {numbered.map((h) => (
                <li key={h.id} style={{ paddingLeft: h.level === 3 ? "1rem" : "0" }}>
                  <a
                    href={`#${h.id}`}
                    className={`text-xs leading-relaxed hover:text-[#0d9488] transition-colors flex items-baseline gap-1.5 ${
                      activeId === h.id ? "text-[#0d9488] font-medium" : "text-muted"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {h.num && (
                      <span className="font-mono text-[9px] shrink-0 opacity-60">{h.num}</span>
                    )}
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Desktop: sticky sidebar */}
      {showDesktop && (
        <aside className={`sticky top-24 w-56 shrink-0 ${variant === "both" ? "hidden lg:block" : "block"}`}>
          <div className="rounded-xl border border-border bg-cream p-4">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-3 flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
              Sommaire
            </p>
            <ol className="space-y-1.5">
              {numbered.map((h) => (
                <li key={h.id} style={{ paddingLeft: h.level === 3 ? "0.75rem" : "0" }}>
                  <a
                    href={`#${h.id}`}
                    className={`text-xs leading-relaxed flex items-baseline gap-1.5 hover:text-[#0d9488] transition-colors ${
                      activeId === h.id ? "text-[#0d9488] font-semibold" : "text-muted"
                    }`}
                  >
                    {h.num && (
                      <span className="font-mono text-[9px] shrink-0 opacity-50">{h.num}</span>
                    )}
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      )}
    </>
  );
}
