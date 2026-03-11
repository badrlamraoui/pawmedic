import WaitlistForm from "./WaitlistForm";
import PhoneMockup from "./PhoneMockup";

interface HeroSectionProps {
  title: string;
  titleHighlight: string;
  subtitle: string;
  cta: string;
  ctaNote: string;
  stats: { stat1: string; stat2: string; stat3: string };
  placeholder: string;
  button: string;
  success: string;
  alreadyRegistered: string;
  locale: string;
}

export default function HeroSection({
  title,
  titleHighlight,
  subtitle,
  cta,
  ctaNote,
  stats,
  placeholder,
  button,
  success,
  alreadyRegistered,
  locale,
}: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 px-5 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left column */}
        <div className="space-y-6">
          {/* Badge */}
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan/30 bg-cyan-light text-cyan text-xs font-mono font-medium tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              GUIDES SANTÉ ANIMALE
            </span>
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-tight text-ink">
              {title}
              <br />
              <em className="text-cyan not-italic">{titleHighlight}</em>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg text-muted leading-relaxed max-w-md">{subtitle}</p>

          {/* Waitlist Form */}
          <div className="space-y-3">
            <WaitlistForm
              placeholder={placeholder}
              buttonText={button}
              successText={success}
              alreadyRegisteredText={alreadyRegistered}
              locale={locale}
            />
            <p className="text-xs text-muted">{ctaNote}</p>
          </div>

          {/* Store Badges */}
          <div className="flex flex-wrap gap-3 pt-1">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 bg-ink text-white rounded-xl px-4 py-2.5 hover:bg-ink/80 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left leading-none">
                <div className="text-[9px] font-mono opacity-70 uppercase tracking-wide">Télécharger sur</div>
                <div className="text-sm font-medium">App Store</div>
              </div>
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 bg-ink text-white rounded-xl px-4 py-2.5 hover:bg-ink/80 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.3.17.64.22.98.14L14.84 12 3.18 .1c-.34-.08-.68-.03-.98.14C1.64.71 1.27 1.34 1.27 2.08v19.84c0 .74.37 1.37.91 1.84zM16.54 13.7l2.87 2.87-10.3 5.79L16.54 13.7zm3.77-3.77c.56.38.87.97.87 1.57s-.31 1.19-.87 1.57l-1.73.97-3.12-3.12 3.12-3.12 1.73.97zm-11.17-7.6l10.3 5.79-2.87 2.87L9.11 2.3z" />
              </svg>
              <div className="text-left leading-none">
                <div className="text-[9px] font-mono opacity-70 uppercase tracking-wide">Disponible sur</div>
                <div className="text-sm font-medium">Google Play</div>
              </div>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[stats.stat1, stats.stat2, stats.stat3].map((stat, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-full min-h-[2rem] bg-cyan/30 rounded-full shrink-0 mt-0.5" />
                <p className="text-xs text-muted leading-snug">{stat}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Phone mockup */}
        <div className="hidden lg:flex justify-center items-center">
          <PhoneMockup />
        </div>
      </div>
    </section>
  );
}
