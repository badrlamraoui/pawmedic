"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { localeConfig, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "select" | "compact";
}

export default function LanguageSwitcher({
  className,
  variant = "select",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.locale as string;

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1 flex-wrap", className)}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleChange(locale)}
            className={cn(
              "px-2 py-1 text-xs font-mono rounded-lg transition-colors",
              locale === currentLocale
                ? "bg-cyan-light text-cyan font-medium"
                : "text-muted hover:text-ink hover:bg-cream"
            )}
          >
            {localeConfig[locale].flag} {locale.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <select
      value={currentLocale}
      onChange={(e) => handleChange(e.target.value)}
      className={cn(
        "appearance-none bg-cream border border-border text-ink text-sm font-mono rounded-lg px-3 py-1.5 pr-7 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan focus:border-transparent",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a8778' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {locales.map((locale) => (
        <option key={locale} value={locale}>
          {localeConfig[locale].flag} {localeConfig[locale].nativeName}
        </option>
      ))}
    </select>
  );
}
