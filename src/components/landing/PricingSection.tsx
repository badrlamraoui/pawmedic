"use client";

import WaitlistForm from "./WaitlistForm";
import { cn } from "@/lib/utils";

interface PricingPlan {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  badge?: string;
}

interface PricingSectionProps {
  eyebrow: string;
  title: string;
  betaNote: string;
  indicative: string;
  free: PricingPlan;
  premium: PricingPlan & { badge: string };
  famille: PricingPlan;
  placeholder: string;
  button: string;
  success: string;
  alreadyRegistered: string;
  locale: string;
}

export default function PricingSection({
  eyebrow,
  title,
  betaNote,
  indicative,
  free,
  premium,
  famille,
  placeholder,
  button,
  success,
  alreadyRegistered,
  locale,
}: PricingSectionProps) {
  const plans = [
    { plan: free, dark: false, featured: false },
    { plan: premium, dark: true, featured: true },
    { plan: famille, dark: false, featured: false },
  ];

  return (
    <section className="py-20 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <p className="text-xs font-mono text-muted tracking-widest uppercase mb-3">{eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl font-serif text-ink">{title}</h2>
        </div>
        <p className="text-center text-sm text-cyan font-medium mb-12">{betaNote}</p>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(({ plan, dark, featured }, i) => (
            <div
              key={i}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col",
                dark
                  ? "bg-ink border-ink text-white"
                  : "bg-white border-border",
                featured ? "md:scale-105 md:shadow-xl z-10" : "shadow-sm"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-cyan text-white text-xs font-mono font-medium rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={cn("text-lg font-medium mb-0.5", dark ? "text-white" : "text-ink")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm", dark ? "text-white/60" : "text-muted")}>{plan.tagline}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={cn("text-3xl font-serif", dark ? "text-white" : "text-ink")}>
                    {plan.price}
                  </span>
                  <span className={cn("text-sm", dark ? "text-white/60" : "text-muted")}>
                    {plan.period}
                  </span>
                </div>
                <p className={cn("text-xs mt-1 font-mono", dark ? "text-cyan" : "text-muted")}>
                  {indicative}
                </p>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-center gap-2">
                    <svg
                      className={cn("w-4 h-4 shrink-0", dark ? "text-cyan" : "text-emerald-500")}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={cn("text-sm", dark ? "text-white/80" : "text-ink")}>{feature}</span>
                  </li>
                ))}
              </ul>

              {i === 0 ? (
                <a
                  href={`/${locale}/sign-up`}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-medium text-center transition-colors",
                    "border border-border text-ink hover:bg-cream"
                  )}
                >
                  {plan.cta}
                </a>
              ) : (
                <WaitlistForm
                  placeholder={placeholder}
                  buttonText={plan.cta}
                  successText={success}
                  alreadyRegisteredText={alreadyRegistered}
                  locale={locale}
                  dark={dark}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
