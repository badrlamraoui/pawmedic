import { AMAZON_CONFIG } from "@/lib/categories";

interface AffiliateCardProps {
  productName: string;
  description: string;
  price: string;
  affiliateUrl: string;
  merchant: "amazon" | "zoomalia";
  locale?: string;
}

const MERCHANT_LABELS: Record<AffiliateCardProps["merchant"], string> = {
  amazon: "Amazon",
  zoomalia: "Zoomalia",
};

const MERCHANT_COLORS: Record<AffiliateCardProps["merchant"], string> = {
  amazon: "bg-[#FF9900] hover:bg-[#e68a00]",
  zoomalia: "bg-[#0d9488] hover:bg-[#0b8076]",
};

const VIEW_ON: Record<string, string> = {
  fr: "Voir sur", en: "View on", es: "Ver en", de: "Ansehen auf", it: "Vedi su", pt: "Ver em", nl: "Bekijk op",
};

const AFFILIATE_LABEL: Record<string, string> = {
  fr: "Lien affilié", en: "Affiliate link", es: "Enlace afiliado", de: "Affiliate-Link", it: "Link affiliato", pt: "Link afiliado", nl: "Affiliatelink",
};

const FROM_LABEL: Record<string, string> = {
  fr: "À partir de", en: "From", es: "Desde", de: "Ab", it: "Da", pt: "A partir de", nl: "Vanaf",
};

function localizeAmazonUrl(url: string, locale: string): string {
  const config = AMAZON_CONFIG[locale] ?? AMAZON_CONFIG.fr;
  // amzn.to shortlinks are locale-independent
  if (url.includes("amzn.to")) return url;
  // Replace amazon domain
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("amazon.")) {
      parsed.hostname = `www.${config.domain}`;
      // Add affiliate tag
      parsed.searchParams.set("tag", config.tag);
      return parsed.toString();
    }
  } catch {
    // Not a valid URL, return as-is
  }
  return url;
}

export default function AffiliateCard({
  productName,
  description,
  price,
  affiliateUrl,
  merchant,
  locale,
}: AffiliateCardProps) {
  const resolvedLocale = locale ?? "fr";
  const finalUrl = merchant === "amazon"
    ? localizeAmazonUrl(affiliateUrl, resolvedLocale)
    : affiliateUrl;
  const viewOnLabel = VIEW_ON[resolvedLocale] ?? VIEW_ON.fr;
  const affiliateLabel = AFFILIATE_LABEL[resolvedLocale] ?? AFFILIATE_LABEL.fr;
  const fromLabel = FROM_LABEL[resolvedLocale] ?? FROM_LABEL.fr;

  return (
    <div className="my-6 flex items-start gap-4 rounded-2xl border border-border bg-[#f0fdfa]/60 p-5">
      {/* Icon */}
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[#0d9488]/10">
        <svg
          className="h-6 w-6 text-[#0d9488]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2">
        <p className="text-sm font-semibold text-ink leading-snug">{productName}</p>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="text-sm font-semibold text-ink">{fromLabel} {price}</span>
          <a
            href={finalUrl}
            target="_blank"
            rel="nofollow noopener sponsored"
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-colors ${MERCHANT_COLORS[merchant]}`}
          >
            {viewOnLabel} {MERCHANT_LABELS[merchant]}
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
          </a>
        </div>
        <span className="font-mono text-[10px] text-muted/60">{affiliateLabel}</span>
      </div>
    </div>
  );
}
