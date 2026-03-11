import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Fil d'ariane" className="mb-6">
      <ol className={`flex flex-wrap items-center gap-1 text-xs font-mono ${className ?? "text-muted"}`}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="opacity-40">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:opacity-100 opacity-70 transition-opacity">
                {item.label}
              </Link>
            ) : (
              <span className="opacity-70 line-clamp-1 max-w-[200px]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
